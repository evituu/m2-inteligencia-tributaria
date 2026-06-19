import Image from "next/image";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import {
  AiFillLinkedin,
  AiFillYoutube,
  AiOutlineMail,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Serviços", href: "/servicos" },
  { label: "Blog", href: "/blog" },
  { label: "Galeria", href: "/galeria-m2" },
  { label: "Contato", href: "/#formulario" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/m2inteligenciatributaria",
    icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/m2-intelig%C3%AAnciatribut%C3%A1ria",
    icon: AiFillLinkedin,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@M2Inteligenciatributaria",
    icon: AiFillYoutube,
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@m2inteligenciatributaria",
    icon: FaThreads,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/5588992156717",
    icon: AiOutlineWhatsApp,
  },
  {
    label: "E-mail",
    href: "mailto:m2inteligenciadptovendas@gmail.com",
    icon: AiOutlineMail,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#f2c40f]/45 bg-[#05080d] text-white">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <Image
              src="/imagens/logo/LOGO_M2.png"
              alt="Logo M2 Inteligência Tributária"
              width={84}
              height={84}
              className="h-12 w-12 object-contain md:h-16 md:w-16"
              priority
            />
            <span className="text-gold-gradient">Inteligência Tributária</span>
          </div>
          <p className="max-w-sm text-justify text-sm leading-6 text-zinc-300">
            Especialistas em recuperação de créditos tributários para empresas de
            todos os portes. Atuação em todo o Brasil, com rigor técnico e
            compromisso com resultado.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-gold-gradient">
            Dados da empresa
          </h3>
          <ul className="space-y-3 text-sm text-zinc-200">
            <li className="flex items-start gap-3">
              <MapPin className="icon-gold-stroke mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Juazeiro do Norte/CE
                <br />
                Av. Ana Saraiva de Menezes, 938 — Jd. Gonzaga · CEP 63.046-515
                <br />
                <br />
                Porangatu/GO
                <br />
                Rua 14, nº 49 — Centro · CEP 76.550-000
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Building2 className="icon-gold-stroke h-4 w-4" />
              <span>CNPJ: 51.055.469/0001-69</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="icon-gold-stroke h-4 w-4" />
              <span>(88) 9 9215-6717</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="icon-gold-stroke h-4 w-4" />
              <span>m2inteligenciadptovendas@gmail.com</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-gold-gradient">
            Navegação rápida
          </h3>
          <nav className="flex flex-col gap-2.5">
            {quickLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover-text-gold-gradient text-sm text-zinc-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-gold-gradient">
            Redes sociais
          </h3>
          <div className="flex flex-col gap-2.5">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-text-gold-gradient inline-flex items-center gap-2 text-sm text-zinc-200"
              >
                <Icon className="h-4 w-4 text-[#d7aa52]" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800/90">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-2 px-5 py-5 text-center text-xs text-zinc-400 md:px-8">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} M2 Inteligência Tributária. Todos os
            direitos reservados. · CNPJ: 51.055.469/0001-69 ·{" "}
          </p>
        </div>
      </div>
    </footer>
  );
}
