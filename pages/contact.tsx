import { useState } from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation('common');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">{t('Get in Touch')}</h1>
        <p className="text-gray-600">{t('Have a tip, a correction, or an inquiry? We want to hear from you.')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Info Side */}
        <div className="bg-slate-900 text-white p-10">
          <h3 className="text-xl font-bold mb-6">{t('Contact Information')}</h3>
          <div className="space-y-6">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">{t('Email')}</p>
              <p className="text-lg">editors@imuhira.com</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">{t('Signal / WhatsApp')}</p>
              <p className="text-lg">+243 000 000 000</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">{t('Office')}</p>
              <p className="text-lg">Bukavu, South Kivu<br />DRC</p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-10">
          {submitted ? (
            <div className="text-center py-10">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-bold">{t('Message Sent')}</h3>
              <p className="text-gray-600 mt-2">{t('Thank you for contacting us.')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">{t('Name')}</label>
                <input id="name" required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-red-600 outline-none" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">{t('Email')}</label>
                <input id="email" required type="email" className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-red-600 outline-none" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-1">{t('Message')}</label>
                <textarea id="message" required rows={4} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-red-600 outline-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition-colors">
                {t('Send Message')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
