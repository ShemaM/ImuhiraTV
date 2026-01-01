import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function Footer() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lng = router.locale || 'en';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* COLUMN 1: BRANDING (Replaces Vercel Logo) */}
          <div className="col-span-1 md:col-span-1">
            <Link href={`/${lng}/`} className="text-2xl font-bold font-serif tracking-tighter text-white hover:text-red-500 transition-colors">
              IMUHIRA
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              {t('footer.description')}
            </p>
            
            {/* Social Icons (Placeholders) */}
            <div className="flex space-x-4 mt-6">
              <SocialIcon label="Twitter" />
              <SocialIcon label="Facebook" />
              <SocialIcon label="LinkedIn" />
            </div>
          </div>

          {/* COLUMN 2: SECTIONS */}
          <div>
            <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase mb-4">{t('footer.sections')}</h3>
            <ul className="space-y-3">
              <li><Link href="/category/history" className="text-gray-400 hover:text-white transition text-sm">{t('footer.history')}</Link></li>
              <li><Link href="/category/culture" className="text-gray-400 hover:text-white transition text-sm">{t('footer.culture')}</Link></li>
              <li><Link href="/category/conflict" className="text-gray-400 hover:text-white transition text-sm">{t('footer.conflict')}</Link></li>
              <li><Link href="/category/stories" className="text-gray-400 hover:text-white transition text-sm">{t('footer.stories')}</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT */}
          <div>
            <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition text-sm">{t('footer.about')}</Link></li>
              <li><Link href="/our-stance" className="text-gray-400 hover:text-white transition text-sm">{t('footer.ourStance')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition text-sm">{t('footer.contact')}</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition text-sm">{t('footer.privacy')}</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition text-sm">{t('footer.terms')}</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER */}
          <div>
            <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase mb-4">{t('footer.briefing')}</h3>
            <p className="text-xs text-gray-400 mb-4">
              {t('footer.newsletterPrompt')}
            </p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder={t('footer.emailPlaceholder')}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-red-600"
              />
              <button className="bg-red-600 text-white text-xs font-bold py-2 rounded hover:bg-red-700 transition-colors uppercase tracking-wide">
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-500 uppercase">
            &copy; {currentYear} Imuhira.
          </p>
          <p className="text-xs text-slate-500 uppercase mt-2 md:mt-0">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}

// Helper for Social Icons (Just circles for now)
function SocialIcon({ label }: { label: string }) {
  return (
    <a href="#" className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors group" aria-label={label}>
      {/* Simple generic icon */}
      <span className="text-gray-400 group-hover:text-white text-xs font-bold">
        {label[0]}
      </span>
    </a>
  );
}