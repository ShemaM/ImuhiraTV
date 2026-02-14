import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SITE_LOGO } from '../../constants/site';
import { useTranslation } from 'next-i18next';

export default function Footer() {
  const router = useRouter();
  const lng = (router.query.lng as string) || 'en';
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation('common');
  
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');
    setSubscribeMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribeStatus('success');
        setSubscribeMessage(data.message);
        setEmail('');
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(data.message || 'Something went wrong.');
      }
    } catch {
      setSubscribeStatus('error');
      setSubscribeMessage('Failed to connect. Please try again.');
    }
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* COLUMN 1: BRANDING with Logo */}
          <div className="col-span-1 md:col-span-1">
            <Link href={`/${lng}/`} className="inline-block group">
              <Image 
                src={SITE_LOGO} 
                alt="Imuhira TV"
                width={64}
                height={64}
                className="h-16 w-16 object-contain rounded-sm"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* COLUMN 2: SECTIONS */}
          <div>
            <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase mb-4">{t('footer.sections')}</h3>
            <ul className="space-y-3">
              <li><Link href={`/${lng}/category/history`} className="text-gray-400 hover:text-white transition text-sm">{t('footer.history')}</Link></li>
              <li><Link href={`/${lng}/category/culture`} className="text-gray-400 hover:text-white transition text-sm">{t('footer.culture')}</Link></li>
              <li><Link href={`/${lng}/category/conflict`} className="text-gray-400 hover:text-white transition text-sm">{t('footer.conflict')}</Link></li>
              <li><Link href={`/${lng}/category/stories`} className="text-gray-400 hover:text-white transition text-sm">{t('footer.stories')}</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: COMPANY */}
          <div>
            <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3">
              <li><Link href={`/${lng}/about`} className="text-gray-400 hover:text-white transition text-sm">{t('footer.about')}</Link></li>
              <li><Link href={`/${lng}/our-stance`} className="text-gray-400 hover:text-white transition text-sm">{t('footer.ourStance')}</Link></li>
              <li><Link href={`/${lng}/contact`} className="text-gray-400 hover:text-white transition text-sm">{t('footer.contact')}</Link></li>
              <li><Link href={`/${lng}/privacy`} className="text-gray-400 hover:text-white transition text-sm">{t('footer.privacy')}</Link></li>
              <li><Link href={`/${lng}/terms`} className="text-gray-400 hover:text-white transition text-sm">{t('footer.terms')}</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER */}
          <div>
            <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase mb-4">{t('footer.briefing')}</h3>
            <p className="text-xs text-gray-400 mb-4">
              {t('footer.newsletterPrompt')}
            </p>
            {subscribeStatus === 'success' ? (
              <div className="p-3 bg-green-900/50 border border-green-700 rounded text-green-300 text-sm">
                {subscribeMessage}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                {subscribeStatus === 'error' && (
                  <div className="p-2 bg-red-900/50 border border-red-700 rounded text-red-300 text-xs">
                    {subscribeMessage}
                  </div>
                )}
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-red-600"
                />
                <button 
                  type="submit"
                  disabled={subscribeStatus === 'loading'}
                  className="bg-red-600 text-white text-xs font-bold py-2 rounded hover:bg-red-700 transition-colors uppercase tracking-wide disabled:opacity-70 disabled:cursor-wait"
                >
                  {subscribeStatus === 'loading' ? '...' : t('footer.subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-500 uppercase">
            &copy; {currentYear} Imuhira TV.
          </p>
          <p className="text-xs text-slate-500 uppercase mt-2 md:mt-0">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
