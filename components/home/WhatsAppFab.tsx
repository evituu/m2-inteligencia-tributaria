import { AiOutlineWhatsApp } from "react-icons/ai";

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/5588992156717?text=Ol%C3%A1!%20Gostaria%20de%20uma%20an%C3%A1lise%20tribut%C3%A1ria%20gratuita."
      className="whatsapp-fab"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
    >
      <AiOutlineWhatsApp className="h-8 w-8" />
    </a>
  );
}
