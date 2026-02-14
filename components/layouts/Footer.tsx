import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { SITE_LOGO } from '../../constants/site';

export default function Footer() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const lng = (router.query.lng as string) || 'en';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* COLUMN 1: BRANDING with Logo */}
          <div className="col-span-1 md:col-span-1">
            <Link href={`/${lng}/`} className="flex items-center gap-2 group">
              <Image 
                src={SITE_LOGO} 
                alt="Imuhira TV"
                width={40}
                height={40}
                className="h-10 w-10 object-contain rounded-sm"
              />
              <span className="text-2xl font-bold font-serif tracking-tighter text-white group-hover:text-red-500 transition-colors">
                IMUHIRA
              </span>
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
              <li><Link href={`/${lng}/category/history`} className="text-gray-400 hover:text-white transition text-sm">{t('History')}</Link></li>
              <li><Link href={`/${lng}/category/culture`} className="text-gray-400 hover:text-white transition text-sm">{t('Culture')}</Link></li>
              <li><Link href={`/${lng}/category/conflict`} className="text-gray-400 hover:text-white transition text-sm">{t('Conflict')}</Link></li>
              <li><Link href={`/${lng}/category/stories`} className="text-gray-400 hover:text-white transition text-sm">{t('Stories')}</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT */}
          <div>
            <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3">
              <li><Link href={`/${lng}/about`} className="text-gray-400 hover:text-white transition text-sm">{t('About Us')}</Link></li>
              <li><Link href={`/${lng}/our-stance`} className="text-gray-400 hover:text-white transition text-sm">{t('Our Stance')}</Link></li>
              <li><Link href={`/${lng}/contact`} className="text-gray-400 hover:text-white transition text-sm">{t('Contact')}</Link></li>
              <li><Link href={`/${lng}/privacy`} className="text-gray-400 hover:text-white transition text-sm">{t('Privacy Policy')}</Link></li>
              <li><Link href={`/${lng}/terms`} className="text-gray-400 hover:text-white transition text-sm">{t('Terms of Service')}</Link></li>
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
