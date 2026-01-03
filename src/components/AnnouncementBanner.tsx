
'use client';

import { useDoc } from '@/firebase';
import { SiteSettings } from '@/lib/types';
import { Megaphone, X } from 'lucide-react';
import { useState } from 'react';

export default function AnnouncementBanner() {
  const { data: siteSettings, loading } = useDoc<SiteSettings>('settings/site');
  const [isVisible, setIsVisible] = useState(true);

  if (loading || !siteSettings?.announcement?.enabled || !siteSettings?.announcement?.message || !isVisible) {
    return null;
  }

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-2 text-sm text-center flex items-center justify-center gap-2">
        <Megaphone className="h-4 w-4" />
        <p>{siteSettings.announcement.message}</p>
        <button onClick={() => setIsVisible(false)} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
