import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Phone } from "lucide-react";

export default function ChatWidget() {
  const { data: chatSettings } = trpc.admin.getChatSettings.useQuery();
  const [isVisible, setIsVisible] = useState(false);

  const isEnabled = chatSettings?.enabled === 1;

  useEffect(() => {
    // Mostrar widget após 1 segundo (animação suave)
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Injetar script personalizado
  useEffect(() => {
    if (isEnabled && chatSettings.type === "custom" && chatSettings.customScript) {
      // Criar elemento script
      const scriptContainer = document.createElement("div");
      scriptContainer.innerHTML = chatSettings.customScript;
      
      // Extrair e executar scripts
      const scripts = scriptContainer.getElementsByTagName("script");
      Array.from(scripts).forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
      });

      // Cleanup ao desmontar
      return () => {
        // Remover scripts injetados
        const injectedScripts = document.querySelectorAll('script[src*="chatbot"], script[src*="widget"]');
        injectedScripts.forEach(script => script.remove());
        
        // Remover elementos de widget
        const chatbotElements = document.querySelectorAll('[id*="chatbot"], [id*="widget"], ra-chatbot-widget');
        chatbotElements.forEach(el => el.remove());
      };
    }
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
