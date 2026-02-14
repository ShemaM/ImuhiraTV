// components/common/AdBanner.tsx
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { SITE_LOGO } from '../../constants/site';

interface Ad {
  id: string;
  image: string;
  link: string;
  title: string;
}

interface AdBannerProps {
  type: 'banner' | 'sidebar';
  ads?: Ad[];
}

// Default placeholder ads for demonstration
const defaultAds: Ad[] = [
  {
    id: 'placeholder-1',
    image: SITE_LOGO,
    link: '#',
    title: 'Advertisement',
  },
];

export default function AdBanner({ type, ads = defaultAds }: AdBannerProps) {
  const { t } = useTranslation('common');

  if (!ads || ads.length === 0) {
    // Show placeholder if no ads provided
    return (
      <div 
        className={`
          bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-300 rounded-lg
          ${type === 'banner' ? 'h-24 md:h-32 w-full' : 'aspect-video md:aspect-square w-full'}
        `}
      >
        <span className="font-bold">{t('Advertisement')}</span>
        <span className="text-xs">{type === 'banner' ? '728x90' : '300x250'}</span>
      </div>
    );
  }

  // Banner type: horizontal layout for wide ads
  if (type === 'banner') {
    return (
      <div className="w-full space-y-4">
        {ads.map((ad) => (
          <a
            key={ad.id}
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full h-24 md:h-32 bg-slate-100 rounded-lg overflow-hidden group"
            title={ad.title}
          >
            <Image
              src={ad.image}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute top-1 right-1 bg-slate-900/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              {t('Advertisement')}
            </div>
          </a>
        ))}
      </div>
    );
  }

  // Sidebar type: vertical/square layout for sidebar ads
  return (
    <div className="w-full space-y-4">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative w-full aspect-video md:aspect-square bg-slate-100 rounded-lg overflow-hidden group"
          title={ad.title}
        >
          <Image
            src={ad.image}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute top-2 right-2 bg-slate-900/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
            {t('Advertisement')}
          </div>
        </a>
      ))}
    </div>
  );
}
