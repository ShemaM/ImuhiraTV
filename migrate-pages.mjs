import fs from 'fs/promises';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'pages');
const appDir = path.join(process.cwd(), 'app');

async function migratePages(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const oldPath = path.join(dir, file.name);
    const newPath = path.join(appDir, '[lng]', oldPath.replace(pagesDir, ''));

    if (file.isDirectory()) {
      await migratePages(oldPath);
    } else {
      if (file.name.startsWith('_')) {
        continue;
      }

      const newDir = newPath.replace('.tsx', '');
      const newFile = path.join(newDir, 'page.tsx');

      try {
        await fs.mkdir(newDir, { recursive: true });

        const oldContent = await fs.readFile(oldPath, 'utf-8');
        
        // Basic content transformation, this will need to be more robust
        const newContent = oldContent
          .replace(/import Layout from '..\/components\/layouts\/Layout';/, '')
          .replace(/export const getStaticProps: GetStaticProps = async \({ locale }\) => \({[^]+}\);/, '')
          .replace(/export default function \w+\(\) {/, 'export default async function Page({ params: { lng } }: { params: { lng: string } }) {')
          .replace(/const { t } = useTranslation\('common'\);/, 'const { t } = await useTranslation(lng, \'common\');')
          .replace(/{t\(([^)]+)\)}/g, '{t($1)}');


        await fs.writeFile(newFile, newContent);
        console.log(`Migrated ${oldPath} to ${newFile}`);
      } catch (error) {
        console.error(`Could not migrate ${oldPath}:`, error);
      }
    }
  }
}

migratePages(pagesDir);
