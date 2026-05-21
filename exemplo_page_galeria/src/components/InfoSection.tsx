/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  FileCheck2,
  BookmarkCheck,
  Briefcase,
  Users,
  X
} from "lucide-react";
import { TEAM_MEMBERS, TESTIMONIALS } from "../data";
import { TeamMember } from "../types";

export default function InfoSection() {
  const [selectedPartner, setSelectedPartner] = useState<TeamMember | null>(null);
  const [activeOfficeTab, setActiveOfficeTab] = useState<"sp" | "rj" | "df">("sp");
  const [bookingFormData, setBookingFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    turnover: "5M-50M",
    office: "sp",
    termsAccepted: false
  });
  const [submittedTicket, setSubmittedTicket] = useState<{
    code: string;
    date: string;
    time: string;
  } | null>(null);

  const offices = {
    sp: {
      city: "São Paulo",
      address: "Av. Brigadeiro Faria Lima, 4500 - 14º andar - Itaim Bibi",
      phone: "+55 (11) 3957-2200",
      email: "sp.office@m2tax.com.br",
      coords: "LAT -23.5855, LONG -46.6815",
      specialty: "Fusões, Aquisições e Agronegócios Fiscais"
    },
    rj: {
      city: "Rio de Janeiro",
      address: "Avenida Athos da Silveira Ramos, 120 - Leblon",
      phone: "+55 (21) 3905-8830",
      email: "rj.office@m2tax.com.br",
      coords: "LAT -22.9824, LONG -43.2239",
      specialty: "Óleo, Gás e Comércio Exterior Marítimo"
    },
    df: {
      city: "Brasília",
      address: "Setor de Autarquias Sul, Quadra 4, Bloco A - Asa Sul",
      phone: "+55 (61) 3942-1150",
      email: "df.office@m2tax.com.br",
      coords: "LAT -15.7997, LONG -47.8863",
      specialty: "Planejamento Tributário e Tribunais Superiores"
    }
  };

  const currentOffice = offices[activeOfficeTab];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setBookingFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setBookingFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingFormData.name || !bookingFormData.email || !bookingFormData.termsAccepted) {
      alert("Por favor, preencha todos os campos obrigatórios e aceite os termos.");
      return;
    }

    // Generate simulated corporate ticket code
    const ticketCode = "M2-" + Math.floor(100000 + Math.random() * 900000);
    const dateOptions = ["28/05/2026", "29/05/2026", "02/06/2026", "03/06/2026"];
    const timeOptions = ["10:00", "14:00", "16:00"];
    
    setSubmittedTicket({
      code: ticketCode,
      date: dateOptions[Math.floor(Math.random() * dateOptions.length)],
      time: timeOptions[Math.floor(Math.random() * timeOptions.length)]
    });
  };

  const resetBooking = () => {
    setBookingFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      turnover: "5M-50M",
      office: "sp",
      termsAccepted: false
    });
    setSubmittedTicket(null);
  };

  return (
    <div className="w-full bg-white text-stone-900 py-16 px-4 md:px-12" id="info-interactive-section">
      <div className="max-w-6xl mx-auto">
        
        {/* Statistics highlights in premium style banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 border-y border-stone-200 py-10 text-center" id="corporate-stats-row">
          <div>
            <div className="text-2xl md:text-4xl font-extrabold text-stone-950 font-serif mb-1">R$ 1.8B+</div>
            <div className="text-[10px] md:text-xs tracking-widest text-[#C5A059] uppercase font-bold">Créditos Homologados</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-extrabold text-stone-950 font-serif mb-1">99.4%</div>
            <div className="text-[10px] md:text-xs tracking-widest text-[#C5A059] uppercase font-bold">Segurança Jurídica</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-extrabold text-stone-950 font-serif mb-1">100+</div>
            <div className="text-[10px] md:text-xs tracking-widest text-[#C5A059] uppercase font-bold">Corporações Atendidas</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-extrabold text-stone-950 font-serif mb-1">24 Horas</div>
            <div className="text-[10px] md:text-xs tracking-widest text-[#C5A059] uppercase font-bold">Acordo Governança SLA</div>
          </div>
        </div>

        {/* SECTION: SÓCIOS */}
        <div className="mb-24" id="socios-section">
          <div className="flex flex-col mb-12">
            <span className="text-xs font-mono tracking-[0.2em] text-[#C5A059] uppercase font-bold mb-2">Pessoas por Trás do Esforço</span>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4">
              <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-stone-950" style={{ fontFamily: "Montserrat" }}>
                Diretoria e Sócios Fundadores
              </h2>
              <span className="text-xs md:text-sm text-stone-500 italic max-w-sm">
                Nossos consultores sêniores alinham décadas de saber jurídico a métodos proprietários avançados de análise de dados.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((partner) => (
              <div 
                key={partner.name}
                onClick={() => setSelectedPartner(partner)}
                className="group border border-stone-200 hover:border-[#C5A059] rounded-sm p-5 bg-stone-50/50 hover:bg-stone-50 cursor-pointer transition-all duration-300 flex flex-col justify-between"
                id={`partner-card-${partner.name.replace(/\s+/g, "-")}`}
              >
                <div>
                  <div className="aspect-square w-full rounded overflow-hidden mb-5 border border-stone-150 relative">
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-[#C5A059]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <h3 className="font-bold text-base md:text-lg text-stone-900 group-hover:text-[#C5A059] transition-colors font-sans mb-1">
                    {partner.name}
                  </h3>
                  <div className="text-[10px] font-mono tracking-widest text-stone-500 uppercase font-bold mb-3 border-b border-stone-100 pb-2">
                    {partner.role}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 italic">
                    "{partner.bio}"
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100/50 flex justify-between items-center text-[10px] md:text-xs font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                  <span>Conhecer Perfil Sênior</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TESTIMONIALS SLIDER SECTION */}
        <div className="mb-24 bg-stone-950 text-white rounded p-8 md:p-12 relative overflow-hidden" id="testimonials-block">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full pointer-events-none blur-3xl"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
            <span className="text-[10px] tracking-widest text-[#C5A059] uppercase font-bold mb-4">Reconhecimento Corporativo</span>
            
            <div className="space-y-12">
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-4xl text-[#C5A059] font-serif leading-none mb-4">“</span>
                  <p className="text-sm md:text-lg text-stone-200 italic font-light max-w-3xl leading-relaxed mb-6">
                    {t.quote}
                  </p>
                  <div className="text-xs md:text-sm font-semibold text-white font-sans">{t.author}</div>
                  <div className="text-[10px] md:text-xs text-[#C5A059] font-mono tracking-wider uppercase mt-1">
                    {t.position} — <span className="text-stone-400 font-bold">{t.logoText}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TWO COLUMN GRID: OFFICES ON LEFT, BOOKING ON RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6" id="interactive-layout-grid">
          
          {/* Left Column: Office details tabs (spans 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between" id="office-directory-box">
            <div>
              <span className="text-xs font-mono tracking-[0.2em] text-[#C5A059] uppercase font-bold mb-2">Presença Geográfica</span>
              <h3 className="text-lg md:text-2xl font-bold tracking-tight text-stone-950 mb-4" style={{ fontFamily: "Montserrat" }}>
                Nossas Localidades
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-6">
                Contamos com centros estratégicos próximos aos maiores polos de decisão administrativa, portuária e jurídica do país. Escolha uma de nossas unidades para correspondências ou agende uma reunião:
              </p>

              {/* Tabs list */}
              <div className="flex gap-2 mb-6 border-b border-stone-200 pb-3">
                {(Object.keys(offices) as Array<"sp" | "rj" | "df">).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveOfficeTab(tab)}
                    className={`flex-grow py-2 text-xs font-bold tracking-widest uppercase transition-colors rounded-sm ${
                      activeOfficeTab === tab
                        ? "bg-black text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                    id={`tab-office-${tab}`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Active Tab Panel */}
              <div className="bg-stone-50/50 p-6 rounded border border-stone-150 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-1.5 bg-[#C5A059]/10 text-[#C5A059] rounded">
                    <Building2 size={16} />
                  </span>
                  <span className="text-sm font-bold text-stone-900 font-sans tracking-wide">
                    Unidade {currentOffice.city}
                  </span>
                </div>

                <div className="space-y-4 text-xs text-stone-700">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-[#C5A059] mt-0.5 shrink-0" />
                    <span>{currentOffice.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#C5A059] shrink-0" />
                    <span>{currentOffice.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[#C5A059] shrink-0" />
                    <span>{currentOffice.email}</span>
                  </div>

                  <div className="pt-3 border-t border-stone-200">
                    <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#C5A059] mb-1">Área Setorial Clave</div>
                    <p className="text-stone-800 font-medium font-sans">{currentOffice.specialty}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality assurance footer note */}
            <div className="hidden lg:flex items-center gap-2 border border-stone-100 p-4 rounded bg-stone-50/20">
              <ShieldCheck size={20} className="text-[#C5A059]" />
              <div className="text-[10px] text-stone-500 leading-snug">
                Credenciado oficial para Auditorias Fiscais sob resoluções corporativas de compliance de classe executiva.
              </div>
            </div>
          </div>

          {/* Right Column: Advanced Private consulting scheduling form (spans 7 cols) */}
          <div className="lg:col-span-7 bg-stone-50 border border-stone-200 rounded p-6 md:p-8 relative" id="consulting-booking-form">
            {!submittedTicket ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-stone-200 pb-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></div>
                  <h3 className="text-base font-bold text-stone-950 font-sans uppercase tracking-wider">
                    Agendamento de Consulta VIP
                  </h3>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Selecione seu perfil corporativo para que nossos sócios preparem uma análise tributária prévia em nossa "Sala de Inteligência".
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={bookingFormData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: Dr. Carlos Vasconcelos"
                      className="p-3 text-xs bg-white border border-stone-200 focus:border-[#C5A059] rounded-sm outline-none"
                    />
                  </div>

                  {/* Company client name */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-700 mb-1">
                      Empresa / Holding
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={bookingFormData.company}
                      onChange={handleInputChange}
                      placeholder="Ex: Metalúrgica Norte S.A."
                      className="p-3 text-xs bg-white border border-stone-200 focus:border-[#C5A059] rounded-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Executive email */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-700 mb-1">
                      E-mail Corporativo *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={bookingFormData.email}
                      onChange={handleInputChange}
                      placeholder="Ex: dircfo@metalnorte.com.br"
                      className="p-3 text-xs bg-white border border-stone-200 focus:border-[#C5A059] rounded-sm outline-none"
                    />
                  </div>

                  {/* Phone contact */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-700 mb-1">
                      Telefone Corporativo (com DDD)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingFormData.phone}
                      onChange={handleInputChange}
                      placeholder="Ex: (11) 94850-2200"
                      className="p-3 text-xs bg-white border border-stone-200 focus:border-[#C5A059] rounded-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Turnover dropdown */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-700 mb-1">
                      Faturamento Anual Estimado
                    </label>
                    <select
                      name="turnover"
                      value={bookingFormData.turnover}
                      onChange={handleInputChange}
                      className="p-3 text-xs bg-white border border-stone-200 focus:border-[#C5A059] rounded-sm outline-none"
                    >
                      <option value="Ate-5M">Até R$ 5 Milhões</option>
                      <option value="5M-50M">R$ 5 Milhões a R$ 50 Milhões</option>
                      <option value="50M-200M">R$ 50 Milhões a R$ 200 Milhões</option>
                      <option value="Acima-200M">Acima de R$ 200 Milhões</option>
                    </select>
                  </div>

                  {/* Office choice synced with state */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-700 mb-1">
                      Unidade de Atendimento Pref.
                    </label>
                    <select
                      name="office"
                      value={bookingFormData.office}
                      onChange={(e) => {
                        handleInputChange(e);
                        setActiveOfficeTab(e.target.value as "sp" | "rj" | "df");
                      }}
                      className="p-3 text-xs bg-white border border-stone-200 focus:border-[#C5A059] rounded-sm outline-none"
                    >
                      <option value="sp">São Paulo (Faria Lima)</option>
                      <option value="rj">Rio de Janeiro (Leblon)</option>
                      <option value="df">Brasília (Asa Sul)</option>
                    </select>
                  </div>
                </div>

                {/* terms and conditions */}
                <div className="flex items-start gap-2 pt-2">
                  <input
                    required
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={bookingFormData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 sticky shrink-0 outline-none text-[#C5A059] focus:ring-[#C5A059]"
                  />
                  <label htmlFor="termsAccepted" className="text-[11px] text-stone-500 leading-snug cursor-pointer selection:bg-none">
                    Entendo que este convite passará por triagem de escopo tributário. Autorizo a M2 Intelligence Tax a processar meus dados corporativos em concordância com suas rígidas diretrizes corporativas (LGPD).
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#C5A059] hover:bg-[#b08d48] text-white py-3 px-6 text-xs font-semibold uppercase tracking-widest duration-300 transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer rounded-sm"
                  style={{ letterSpacing: "0.15em" }}
                  id="submit-consulting-booking"
                >
                  <BookmarkCheck size={15} />
                  SOLICITAR AGENDAMENTO CORPORATIVO
                </button>
              </form>
            ) : (
              // Booking success confirmation ticket layout
              <div className="flex flex-col items-center text-center p-4 md:p-6 bg-white border-2 border-dashed border-[#C5A059] rounded animate-scale-up" id="booking-success-ticket">
                
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-4">
                  <FileCheck2 size={24} />
                </div>
                
                <span className="text-[10px] tracking-widest text-[#C5A059] uppercase font-bold mb-1">
                  Reserva Solicitada
                </span>
                
                <h4 className="text-base font-bold text-stone-900 font-sans mb-2">
                  Ticket de Protocolo Solicitado
                </h4>
                
                <p className="text-xs text-stone-600 leading-relaxed mb-6 max-w-md">
                  Prezado <strong>{bookingFormData.name}</strong>, nossa secretária executiva sênior entrará em contato nas próximas 3 horas úteis para confirmar a disponibilidade da Sala de Inteligência com o consultor designado.
                </p>

                {/* Ticket card view */}
                <div className="w-full bg-stone-50 p-4 rounded border border-stone-150 text-left space-y-2 font-mono text-xs mb-6 max-w-sm">
                  <div className="flex justify-between border-b border-stone-200 pb-1.5 text-[10px] text-stone-400">
                    <span>M2 INTEL PROTOCOLO</span>
                    <span className="font-bold text-stone-600">{submittedTicket.code}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-500">Unidade:</span>
                    <span className="font-bold text-stone-800">{bookingFormData.office.toUpperCase()} Office</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-500 font-normal">Previsão Data:</span>
                    <span className="font-bold text-stone-800">{submittedTicket.date}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-500 font-normal">Sessão Proposta:</span>
                    <span className="font-bold text-stone-800">{submittedTicket.time} horas</span>
                  </div>

                  <div className="flex justify-between border-t border-stone-200 pt-1.5 text-[10px] text-stone-400">
                    <span>Comentários:</span>
                    <span className="text-stone-700 font-sans text-[11px]">Empresa: {bookingFormData.company || "Independente"}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={resetBooking}
                    className="border border-stone-200 hover:border-black text-stone-700 hover:text-black py-2.5 px-6 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                    id="booking-ticket-new"
                  >
                    Novo Agendamento
                  </button>

                  <button
                    onClick={() => {
                      alert("Protocolo copiado para a área de transferência!");
                    }}
                    className="bg-[#C5A059] hover:bg-[#b08d48] text-white py-2.5 px-6 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                    id="booking-ticket-copy"
                  >
                    Copiar Código
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Sócio modal details dialogue (simulating deep detailed legal profiles) */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="partner-modal-backdrop">
          <div className="bg-white max-w-2xl w-full rounded shadow-2xl overflow-hidden border border-stone-200 animate-scale-up">
            <div className="bg-black text-white p-6 relative">
              <button
                onClick={() => setSelectedPartner(null)}
                className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                id="partner-modal-close"
              >
                <X size={18} />
              </button>

              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C5A059] shrink-0">
                  <img
                    src={selectedPartner.avatar}
                    alt={selectedPartner.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale font-sans"
                  />
                </div>
                <div>
                  <span className="text-[10px] tracking-widest text-[#C5A059] uppercase font-bold">Diretoria M2</span>
                  <h3 className="text-sm md:text-xl font-bold tracking-wide font-sans">{selectedPartner.name}</h3>
                  <p className="text-xs text-stone-400 font-mono tracking-wider">{selectedPartner.role}</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-[#C5A059] tracking-wider mb-2 border-b border-stone-100 pb-1">
                  Biografia Profissional Detalhada
                </h4>
                <p className="text-xs md:text-sm text-stone-700 leading-relaxed font-light">
                  {selectedPartner.name} comanda nosso conselho de consultores na M2 Intelligence Tax. Detém renome nacional, com passagens em comissões de readequação fiscal estaduais e governamentais, assessorando na formatação de regimes fiscais equilibrados para indústrias petroquímicas, metalúrgicas, distribuidoras farmacêuticas e e-commerces multinacionais.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-[#C5A059] tracking-wider mb-2 border-b border-stone-100 pb-1">
                  Especializações Acadêmicas & Doutrinas
                </h4>
                <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1.5 font-sans">
                  <li>Consultoria de Fusões & Aquisições (M&A) e Planejamento Societário Internacional.</li>
                  <li>Patrocínio de defesas em Litígios Administrativos no âmbito do CARF.</li>
                  <li>Implementação e Inteligência Sistêmica de Compliance de Tributos Indiretos (PIS/COFINS/ICMS).</li>
                  <li>Especialização em Direito Tributário pela Pontifícia Universidade Católica (PUC-SP).</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="border border-stone-200 hover:border-stone-800 text-stone-700 hover:text-stone-900 p-2.5 px-6 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  id="partner-modal-back"
                >
                  Voltar
                </button>
                
                <button
                  onClick={() => {
                    alert(`Mensagem direta enviada para a assessoria de ${selectedPartner.name}.`);
                    setSelectedPartner(null);
                  }}
                  className="bg-[#C5A059] hover:bg-[#b08d48] text-white p-2.5 px-6 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  style={{ letterSpacing: "0.1em" }}
                  id="partner-modal-hire"
                >
                  Agendar Reunião Direta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
