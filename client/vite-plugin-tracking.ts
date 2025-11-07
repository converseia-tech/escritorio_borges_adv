import { Plugin } from 'vite';

/**
 * Plugin Vite para substituir placeholders de tracking no HTML
 */
export function trackingPlugin(): Plugin {
  return {
    name: 'vite-plugin-tracking',
    transformIndexHtml(html) {
      const metaPixelId = process.env.VITE_META_PIXEL_ID || '';
      const ga4MeasurementId = process.env.VITE_GA4_MEASUREMENT_ID || '';

      return html
        .replace(/__META_PIXEL_ID__/g, metaPixelId)
        .replace(/__GA4_MEASUREMENT_ID__/g, ga4MeasurementId);
    },
  };
}
