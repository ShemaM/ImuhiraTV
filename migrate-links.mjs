import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

async function migrateLinks() {
  const files = await glob('components/**/*.tsx');

  for (const file of files) {
    try {
      let content = await fs.readFile(file, 'utf-8');

      if (content.includes('import Link from \'next/link\';')) {
        let isClientComponent = content.includes('"use client";');

        if (isClientComponent) {
          if (!content.includes('import { usePathname } from \'next/navigation\';')) {
            content = 'import { usePathname } from \'next/navigation\';\n' + content;
          }
          if (!content.includes('const pathname = usePathname();')) {
            content = content.replace(/(export default function \w+\(.*\) {)/, '$1\n  const pathname = usePathname();');
          }
          if (!content.includes('const lng = pathname.split(\'/\')[1];')) {
            content = content.replace(/(export default function \w+\(.*\) {)/, '$1\n  const lng = pathname.split(\'/\')[1];');
          }
        } else {
          // It's a server component, so we need to add a lng prop
          content = content.replace(/(export default function \w+\({(.*)}\):?.* {)/, 'export default function Component({$2, lng}: { $2; lng: string }) {');
        }

        // Prepend lng to all hrefs
        content = content.replace(/href="(\/[^ vital]*)"/g, 'href={`/${lng}$1`');

        await fs.writeFile(file, content);
        console.log(`Migrated ${file}`);
      }
    } catch (error) {
      console.error(`Could not migrate ${file}:`, error);
    }
  }
}

migrateLinks();
