import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import {
  AiFillFacebook,
  AiFillLinkedin,
  AiOutlineMail,
  AiOutlineWhatsApp,
} from "react-icons/ai";

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "Serviços", href: "#" },
  { label: "Sobre nós", href: "#" },
];

const socialLinks = [
  { label: "Facebook", href: "#", icon: AiFillFacebook },
  { label: "LinkedIn", href: "#", icon: AiFillLinkedin },
  {
    label: "WhatsApp",
    href: "https://wa.me/5511999999999",
    icon: AiOutlineWhatsApp,
  },
  {
    label: "E-mail",
    href: "mailto:m2inteligenciatributaria@gmail.com",
    icon: AiOutlineMail,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#f2c40f]/45 bg-[#05080d] text-white">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-2xl font-black tracking-tight text-[#f2c40f]">
            <Building2 className="h-6 w-6" />
            <span>M2 Inteligência Tributária</span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-zinc-300">
            Escritório especializado em recuperação de crédito para empresas de
            contabilidade, com atuação estratégica, jurídica e operacional.
          </p>
          <a
            href="#"
            className="inline-flex h-11 items-center justify-center bg-[#f2c40f] px-6 text-sm font-bold uppercase tracking-wide text-[#0a0f16] transition-colors hover:bg-[#ffd82f]"
          >
            Solicitar consultoria
          </a>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#f2c40f]">
            Dados da empresa
          </h3>
          <ul className="space-y-3 text-sm text-zinc-200">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[#f2c40f]" />
              <span>
                Av. Exemplo Corporativo, 1234 - Sala 801
                <br />
                Centro Empresarial, Sao Paulo - SP
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-[#f2c40f]" />
              <span>CNPJ: 00.000.000/0001-00</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#f2c40f]" />
              <span>(11) 0000-0000</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#f2c40f]" />
              <span>m2inteligenciatributaria@gmail.com</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#f2c40f]">
            Navegação rápida
          </h3>
          <nav className="flex flex-col gap-2.5">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-zinc-200 transition-colors hover:text-[#f2c40f]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#f2c40f]">
            Redes sociais
          </h3>
          <div className="flex flex-col gap-2.5">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-zinc-200 transition-colors hover:text-[#f2c40f]"
              >
                <Icon className="h-4 w-4 text-[#f2c40f]" />
                <span>{label}</span>
              </a>
            ))}
          </div>
          <p className="pt-3 text-xs leading-5 text-zinc-400">
            Atendemos todo o Brasil com consultoria especializada para
            recuperação tributária e compliance fiscal.
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-800/90">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2 px-5 py-5 text-xs text-zinc-400 md:flex-row justify-center md:px-8">
          <p>© {new Date().getFullYear()} M2 Inteligência Tributária. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
