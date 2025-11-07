import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '@/lib/tracking';

/**
 * Hook personalizado para rastrear visualizações de página automaticamente
 * Usa em App.tsx para tracking global
 */
export function usePageTracking() {
  const [location] = useLocation();

  useEffect(() => {
    // Rastreia visualização da página sempre que a rota mudar
    trackPageView(location);
  }, [location]);
}
