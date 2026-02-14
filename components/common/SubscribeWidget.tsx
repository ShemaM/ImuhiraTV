import { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface SubscribeWidgetProps {
  variant?: 'light' | 'dark';
}

export default function SubscribeWidget({ variant = 'light' }: SubscribeWidgetProps) {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

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
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to connect. Please try again.');
    }
  };

  const isLight = variant === 'light';

  if (status === 'success') {
    return (
      <div className={`p-6 rounded-lg border ${isLight ? 'bg-green-50 border-green-200' : 'bg-green-900/30 border-green-700'}`}>
        <div className={`text-center ${isLight ? 'text-green-700' : 'text-green-300'}`}>
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="font-bold">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
      <h3 className={`font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
        {t('Subscribe')}
      </h3>
      <p className={`text-sm mb-4 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
        {t('Get the latest updates delivered to your inbox.')}
      </p>
      
      {status === 'error' && (
        <div className={`p-2 mb-3 rounded text-sm ${isLight ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-red-900/30 border border-red-700 text-red-300'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <input 
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('Your email address')}
          className={`w-full px-3 py-2 rounded mb-2 text-sm ${isLight ? 'border border-gray-300 bg-white text-gray-900' : 'border border-slate-600 bg-slate-700 text-white'} focus:outline-none focus:border-red-600`}
        />
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-red-600 text-white text-sm font-bold py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-wait"
        >
          {status === 'loading' ? '...' : t('Join Now')}
        </button>
      </form>
    </div>
  );
}
