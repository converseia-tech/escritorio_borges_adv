import { useEffect, useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Phone } from "lucide-react";

export default function ChatWidget() {
  const { data: chatSettings } = trpc.admin.getChatSettings.useQuery();
  const [isVisible, setIsVisible] = useState(false);
  const scriptInjectedRef = useRef(false); // Prevenir re-injeção

  const isEnabled = chatSettings?.enabled === 1;

  useEffect(() => {
    // Mostrar widget após 1 segundo (animação suave)
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Injetar script personalizado
  useEffect(() => {
    if (!isEnabled || chatSettings?.type !== "custom" || !chatSettings.customScript) {
      return;
    }

    // ✅ Prevenir injeção duplicada (mesmo após hot reload)
    if (scriptInjectedRef.current) {
      console.log("[ChatWidget] Script já foi injetado nesta sessão, pulando");
      return;
    }

    const existingWidget = document.getElementById("custom-chat-widget-container");
    if (existingWidget) {
      console.log("[ChatWidget] Widget já existe no DOM, pulando injeção");
      scriptInjectedRef.current = true;
      return;
    }

    console.log("[ChatWidget] 🚀 Injetando script personalizado...");
    scriptInjectedRef.current = true;

    // Criar container único para o widget
    const container = document.createElement("div");
    container.id = "custom-chat-widget-container";
    container.setAttribute("data-chat-widget", "true");
    
    // Injetar HTML do script
    container.innerHTML = chatSettings.customScript;
    
    // Adicionar ao body
    document.body.appendChild(container);

    // Extrair e executar scripts dentro do HTML
    const scripts = container.getElementsByTagName("script");
    const executedScripts: HTMLScriptElement[] = [];

    Array.from(scripts).forEach((oldScript) => {
      const newScript = document.createElement("script");
      
      // Copiar atributos (src, type, etc.)
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copiar conteúdo inline
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }
      
      // Marcar script como injetado pelo widget
      newScript.setAttribute("data-chat-widget-script", "true");
      
      // Substituir script antigo pelo novo (para executar)
      oldScript.parentNode?.replaceChild(newScript, oldScript);
      executedScripts.push(newScript);
    });

    console.log("[ChatWidget] ✅ Script injetado com sucesso");

    // Cleanup ao desmontar componente
    return () => {
      console.log("[ChatWidget] 🧹 Limpando widget...");
      scriptInjectedRef.current = false; // Permitir re-injeção após cleanup
      
      // Remover container principal
      const containerToRemove = document.getElementById("custom-chat-widget-container");
      if (containerToRemove) {
        containerToRemove.remove();
      }

      // Remover scripts injetados
      const injectedScripts = document.querySelectorAll('script[data-chat-widget-script="true"]');
      injectedScripts.forEach(script => script.remove());

      // Remover elementos de chatbot conhecidos
      const chatbotSelectors = [
        'ra-chatbot-widget',
        '[id*="ra_wc_chatbot"]',
        '[id*="chatbot"]',
        '[class*="chatbot"]',
        'iframe[src*="chatbot"]',
        'iframe[src*="widget"]'
      ];
      
      chatbotSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          // Só remover se foi criado pelo widget (não remover se já existia)
          if (el.closest('[data-chat-widget="true"]') || !el.closest('body > *:not([data-chat-widget])')) {
            el.remove();
          }
        });
      });

      console.log("[ChatWidget] ✅ Limpeza concluída");
    };
  }, [chatSettings, isEnabled]);

  // Não renderizar se desabilitado ou se for script personalizado (já foi injetado)
  if (!isEnabled || chatSettings?.type === "custom") {
    return null;
  }

  // Renderizar WhatsApp widget
  if (chatSettings.type === "whatsapp" && chatSettings.whatsappNumber) {
    const whatsappUrl = `https://wa.me/${chatSettings.whatsappNumber}${
      chatSettings.whatsappMessage ? `?text=${encodeURIComponent(chatSettings.whatsappMessage)}` : ""
    }`;

    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 group ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        aria-label="Fale conosco pelo WhatsApp"
      >
        <Phone className="h-6 w-6" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-gray-900 text-white text-sm py-2 px-3 rounded-lg whitespace-nowrap shadow-lg">
            Fale conosco pelo WhatsApp
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
          </div>
        </div>
        
        {/* Pulso de animação */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
      </a>
    );
  }

  return null;
}
