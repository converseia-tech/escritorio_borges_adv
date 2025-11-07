/**
 * Tracking Utilities for Meta Pixel and Google Analytics 4
 * 
 * Funções para rastrear eventos de marketing e conversão
 */

// Tipos de eventos suportados
export type TrackingEvent = 
  | 'page_view'
  | 'view_content'
  | 'lead'
  | 'contact'
  | 'submit_form'
  | 'click_whatsapp'
  | 'view_blog'
  | 'read_article';

export interface TrackingParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  [key: string]: any;
}

/**
 * Rastreia evento no Meta Pixel (Facebook)
 * @param eventName Nome do evento
 * @param params Parâmetros adicionais
 */
export function trackMeta(eventName: TrackingEvent, params: TrackingParams = {}) {
  try {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', eventName, params);
      console.log('✅ [Meta Pixel] Event tracked:', eventName, params);
    } else {
      console.warn('⚠️ [Meta Pixel] fbq not available');
    }
  } catch (error) {
    console.error('❌ [Meta Pixel] Error tracking event:', error);
  }
}

/**
 * Rastreia evento no Google Analytics 4
 * @param eventName Nome do evento
 * @param params Parâmetros adicionais
 */
export function trackGA(eventName: TrackingEvent, params: TrackingParams = {}) {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
      console.log('✅ [GA4] Event tracked:', eventName, params);
    } else {
      console.warn('⚠️ [GA4] gtag not available');
    }
  } catch (error) {
    console.error('❌ [GA4] Error tracking event:', error);
  }
}

/**
 * Rastreia visualização de página em ambas as plataformas
 * @param pagePath Caminho da página
 * @param pageTitle Título da página
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  const params: TrackingParams = {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  };

  trackMeta('page_view', params);
  trackGA('page_view', params);
}

/**
 * Rastreia visualização de conteúdo (ex: artigo de blog)
 * @param contentName Nome do conteúdo
 * @param contentCategory Categoria do conteúdo
 * @param contentId ID do conteúdo
 */
export function trackViewContent(
  contentName: string,
  contentCategory: string = 'blog',
  contentId?: string
) {
  const params: TrackingParams = {
    content_name: contentName,
    content_category: contentCategory,
    content_ids: contentId ? [contentId] : undefined,
  };

  trackMeta('view_content', params);
  trackGA('view_content', params);
}

/**
 * Rastreia geração de lead (formulário de contato)
 * @param value Valor estimado do lead
 * @param currency Moeda (padrão BRL)
 */
export function trackLead(value?: number, currency: string = 'BRL') {
  const params: TrackingParams = {
    value,
    currency,
  };

  trackMeta('lead', params);
  trackGA('lead', params);
}

/**
 * Rastreia clique no WhatsApp
 */
export function trackWhatsAppClick() {
  const params: TrackingParams = {
    content_name: 'WhatsApp Click',
    content_category: 'contact',
  };

  trackMeta('contact', params);
  trackGA('contact', params);
}

/**
 * Rastreia envio de formulário
 * @param formName Nome do formulário
 */
export function trackFormSubmit(formName: string) {
  const params: TrackingParams = {
    content_name: formName,
    content_category: 'form',
  };

  trackMeta('submit_form', params);
  trackGA('submit_form', params);
}
