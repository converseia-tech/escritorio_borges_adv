import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';

export function useFavicon() {
  const { data: settings } = trpc.site.getSiteSettings.useQuery();

  useEffect(() => {
    if (settings?.faviconUrl) {
      // Remove favicon antigo
      const existingFavicon = document.querySelector("link[rel='icon']");
      if (existingFavicon) {
        existingFavicon.remove();
      }

      // Adiciona novo favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = settings.faviconUrl;
      document.head.appendChild(link);

      // Também atualiza o apple-touch-icon
      const existingApple = document.querySelector("link[rel='apple-touch-icon']");
      if (existingApple) {
        existingApple.remove();
      }

      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = settings.faviconUrl;
      document.head.appendChild(appleLink);
    }
  }, [settings?.faviconUrl]);
}
