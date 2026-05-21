/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Album, InstagramPost, TeamMember } from "./types";

export const ALBUMS: Album[] = [
  {
    id: "sede",
    title: "Inauguração da Sede",
    description: "Celebração da abertura do nosso novo espaço de trabalho corporativo, projetado para excelência técnica, foco estratégico e atendimento personalizado.",
    coverImage: "https://lh3.googleusercontent.com/aida/ADBb0ujBezsy9YDR30CNDDvDQ7SyzjMINYQH2LQxHS6NRr601dMa7YsqtCxg06p3Z0WeH5wppKARWrS3mVRbGjnoGFsrZdgnlf9MkaIwGmr-qIrD6L3iCm5FjWqIFBFY0pOmAPZ2QnWocd0Ei0-yKHzmUzM8iMHjdHaKRjgTTPnZoq-7YF6u2BD8RIh9FBWoNSGd26v-qzYxnGIfn73Nz3JhLyuiI37w3_eEHPtGly3nh08E-1lsB8b278vvvb1E",
    category: "sede",
    date: "14 de Fevereiro de 2024",
    location: "São Paulo, SP - Av. Brigadeiro Faria Lima",
    stats: [
      { label: "Espaço", value: "850 m²" },
      { label: "Postos", value: "80+ Colaboradores" },
      { label: "Salas de Inteligência", value: "6 Salas VIP" }
    ],
    photos: [
      {
        id: "sede-1",
        url: "https://lh3.googleusercontent.com/aida/ADBb0ujBezsy9YDR30CNDDvDQ7SyzjMINYQH2LQxHS6NRr601dMa7YsqtCxg06p3Z0WeH5wppKARWrS3mVRbGjnoGFsrZdgnlf9MkaIwGmr-qIrD6L3iCm5FjWqIFBFY0pOmAPZ2QnWocd0Ei0-yKHzmUzM8iMHjdHaKRjgTTPnZoq-7YF6u2BD8RIh9FBWoNSGd26v-qzYxnGIfn73Nz3JhLyuiI37w3_eEHPtGly3nh08E-1lsB8b278vvvb1E",
        alt: "Abertura oficial do novo escritório corporativo da M2 Intelligence Tax",
        caption: "Nossa área principal de inteligência integrada, projetada para otimizar a sinergia entre nossas equipes de consultores tributários e seniores.",
        category: "sede",
        date: "Fevereiro de 2024",
        location: "Faria Lima, SP",
        photographer: "Lucas Mendes"
      },
      {
        id: "sede-2",
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        alt: "Área de recepção executive suite",
        caption: "Recepção moderna e clean de nossa sede corporativa, pronta para acolher clientes corporativos nacionais e internacionais com máxima discrição.",
        category: "sede",
        date: "Fevereiro de 2024",
        location: "M2 Sede - Recepção",
        photographer: "Lucas Mendes"
      },
      {
        id: "sede-3",
        url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
        alt: "Sala de Conselho M2",
        caption: "Nossa principal sala de conselhos e mesas redondas, equipada com tecnologias de videoconferência de última geração para assembleias críticas com clientes.",
        category: "sede",
        date: "Fevereiro de 2024",
        location: "M2 Sede - Executive Boardroom",
        photographer: "Lucas Mendes"
      },
      {
        id: "sede-4",
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        alt: "Estações de trabalho colaborativas",
        caption: "As ilhas de conformidade fiscal e auditoria, onde os dados de nossos clientes são minuciosamente revisados sob os mais rígidos padrões de segurança digital.",
        category: "sede",
        date: "Fevereiro de 2024",
        location: "M2 Sede - Open Office",
        photographer: "Amanda Salles"
      },
      {
        id: "sede-5",
        url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
        alt: "Espaço de foco individual",
        caption: "Espaço de foco direcionado para elaboração de defesas em litígios fiscais de alta complexidade regulatória.",
        category: "sede",
        date: "Fevereiro de 2024",
        location: "M2 Sede - Focus Zone",
        photographer: "Amanda Salles"
      }
    ]
  },
  {
    id: "conferencia",
    title: "Conferência Tributária 2024",
    description: "Nossos sócios fundadores e convidados apresentando insights de mercado, tendências das novas reformas tributárias e discutindo estratégias fiscais inovadoras.",
    coverImage: "https://lh3.googleusercontent.com/aida/ADBb0uiJQIFBNUA-jtnOQsV4ERX_rZoMYZYKbBiRN8OTHcb3smCz1ACSdFxzGT3UPZtrJxtkp07uG2n9FFjM6dQfyVYqgC_eOw1qfdlUjR5OOi5Ti0mrsKIaLEUnBbdHp_NOD8M30krGKe9g5PrEvkCo4wfiFh7Ff2Y13RNDNj2f94WI6gJlS2muGdgIbWUMezZlt0RbhDiZ0oVYv-3QK7v1NfOzdq-BX0QbY13pxYJJwJmApJpImOU3Ro2RnnT2",
    category: "conferencia",
    date: "28 de Março de 2024",
    location: "Centro de Convenções Rooftop, SP",
    stats: [
      { label: "Palestrantes", value: "6 Experts" },
      { label: "Espectadores", value: "350+ Líderes" },
      { label: "Empresas", value: "110 Grandes Marcas" }
    ],
    photos: [
      {
        id: "conf-1",
        url: "https://lh3.googleusercontent.com/aida/ADBb0uiJQIFBNUA-jtnOQsV4ERX_rZoMYZYKbBiRN8OTHcb3smCz1ACSdFxzGT3UPZtrJxtkp07uG2n9FFjM6dQfyVYqgC_eOw1qfdlUjR5OOi5Ti0mrsKIaLEUnBbdHp_NOD8M30krGKe9g5PrEvkCo4wfiFh7Ff2Y13RNDNj2f94WI6gJlS2muGdgIbWUMezZlt0RbhDiZ0oVYv-3QK7v1NfOzdq-BX0QbY13pxYJJwJmApJpImOU3Ro2RnnT2",
        alt: "Sócios Fundadores da M2 Intelligence Tax guiando discussões em painel interativo",
        caption: "Nossos sócios liderando o painel de abertura sobre a Reforma Tributária Nacional, respondendo a perguntas cruciais de empresários parceiros.",
        category: "conferencia",
        date: "Março de 2024",
        location: "Auditório Principal M2",
        photographer: "Mateus Ribeiro"
      },
      {
        id: "conf-2",
        url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
        alt: "Apresentação dos dados de mercado pelo CEO",
        caption: "Delineamento de tendências macroeconômicas e análise preditiva de redução de custos corporativos por meio de incentivos de ICMS.",
        category: "conferencia",
        date: "Março de 2024",
        location: "Palco de Convenções",
        photographer: "Mateus Ribeiro"
      },
      {
        id: "conf-3",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        alt: "Plenária de líderes e conselheiros",
        caption: "Visão parcial de nossa plateia seleta, formada em grande maioria por CEOs, CFOs, Diretores Jurídicos e Controladores de grandes holdings do país.",
        category: "conferencia",
        date: "Março de 2024",
        location: "Plenária Principal",
        photographer: "Mateus Ribeiro"
      },
      {
        id: "conf-4",
        url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
        alt: "Networking inteligente e negócios",
        caption: "Momentos de troca e prospecções no coquetel exclusivo oferecido após os debates regulatórios centrais.",
        category: "conferencia",
        date: "Março de 2024",
        location: "Foyer Premium",
        photographer: "Juliana Castilho"
      },
      {
        id: "conf-5",
        url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
        alt: "Perguntas e respostas com a bancada jurídica",
        caption: "Bancada jurídica respondendo de forma individualizada a dúvidas específicas do setor logístico e de comércio exterior de nossos parceiros.",
        category: "conferencia",
        date: "Março de 2024",
        location: "Auditorio Principal",
        photographer: "Juliana Castilho"
      }
    ]
  },
  {
    id: "teambuilding",
    title: "Team Building Estratégico",
    description: "Mesas redondas de estratégia tributária, análise preditiva e integração de novos talentos, aliando precisão analítica a um ambiente focado em inteligência coletiva.",
    coverImage: "https://lh3.googleusercontent.com/aida/ADBb0uhjwu2J2qJsB5N8Bsl7awLKXkspKbCEzTM10CRtQf9b9Sc7bcGOPqUG45W4OsV46_T7A4uMlxixKQWJ30YJDHVrfknRw5K7VMBDyFjsG38ANAVSYhnXEdfn3jH-vU2YtowdEP5RNYs2AoLAp2xzVsgGfC5tUM8McQD98-pl8zky4uvljHPeCuKJqKu6H4FDsW3vS9dzrCgmhJKcanT1SWe7OV7XPU-RXODW8wm1GNCNvdxasgsAWMXHJNg",
    category: "teambuilding",
    date: "12 de Maio de 2024",
    location: "M2 Strategy Lab / Espaço Conceito",
    stats: [
      { label: "Integração", value: "100% dos Consultores" },
      { label: "Projetos Sociais", value: "M2+ Solidária" },
      { label: "Treinamentos", value: "48h Programadas" }
    ],
    photos: [
      {
        id: "tb-1",
        url: "https://lh3.googleusercontent.com/aida/ADBb0uhjwu2J2qJsB5N8Bsl7awLKXkspKbCEzTM10CRtQf9b9Sc7bcGOPqUG45W4OsV46_T7A4uMlxixKQWJ30YJDHVrfknRw5K7VMBDyFjsG38ANAVSYhnXEdfn3jH-vU2YtowdEP5RNYs2AoLAp2xzVsgGfC5tUM8McQD98-pl8zky4uvljHPeCuKJqKu6H4FDsW3vS9dzrCgmhJKcanT1SWe7OV7XPU-RXODW8wm1GNCNvdxasgsAWMXHJNg",
        alt: "Equipe técnica M2 reunida em mesa redonda de projetos tributários",
        caption: "Sessão intensiva de design de soluções tributárias. Juntos, analisamos bilhões de dados fiscais para gerar economias legítimas aos nossos clientes.",
        category: "teambuilding",
        date: "Maio de 2024",
        location: "Strategy Lab M2",
        photographer: "Carolina Gouvêa"
      },
      {
        id: "tb-2",
        url: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1200&q=80",
        alt: "Planejamento visual de conformidade",
        caption: "Dynamic Brainstorm: Mapeamento de teses tributárias com o uso de metodologias ágeis e cartões conceituais em nosso laboratório.",
        category: "teambuilding",
        date: "Maio de 2024",
        location: "M2 Creative Rooms",
        photographer: "Carolina Gouvêa"
      },
      {
        id: "tb-3",
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        alt: "Equipe de conformidade comemorando resultados",
        caption: "Nossa equipe fiscal comemora o pioneirismo no desenvolvimento de um bot proprietário de compliance que reduz auditorias de 60 para 2 dias.",
        category: "teambuilding",
        date: "Maio de 2024",
        location: "Strategy Suite",
        photographer: "Vitor Lombardi"
      },
      {
        id: "tb-4",
        url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80",
        alt: "Treinamento interno de novos líderes",
        caption: "Workshop conduzido por mentores seniores para aperfeiçoamento da nova turma de analistas fiscais admitida no Programa Trainee M2.",
        category: "teambuilding",
        date: "Maio de 2024",
        location: "Auditório Sul M2",
        photographer: "Vitor Lombardi"
      },
      {
        id: "tb-5",
        url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
        alt: "Comemoração e brinde de conquistas anuais",
        caption: "Nosso tradicional almoço de comemoração de atingimento de metas. O engajamento absoluto de pessoas move nossa busca incessante por precisão tributária.",
        category: "teambuilding",
        date: "Maio de 2024",
        location: "M2 Lounge Garden",
        photographer: "Juliana Castilho"
      }
    ]
  }
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "inst-1",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    caption: "Estabilidade, governança e conformidade. Na M2 Intelligence Tax, aliamos profunda expertise jurídica com inteligência sistêmica para salvaguardar os ativos e otimizar a carga tributária das maiores corporações do mercado. 💡💼 #Tributario #FariaLima #M2Intelligence",
    likes: 412,
    comments: 24,
    date: "A duas horas"
  },
  {
    id: "inst-2",
    imageUrl: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=600&q=80",
    caption: "Nossos líderes de consultoria participaram do Simpósio Anual de Tecnologia Fiscal, explorando os impactos cruciais das ferramentas baseadas em IA no preenchimento de obrigações acessórias federais. 🤖📊 #Technology #TaxReform2024",
    likes: 318,
    comments: 18,
    date: "Ontem"
  },
  {
    id: "inst-3",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
    caption: "M2 Carreiras: Oferecemos um ecossistema moldado para o desenvolvimento contínuo de talentos que buscam tornarem-se autoridades no mercado tributário nacional. Venha construir soluções reais ao nosso lado! 🚀✨ #Trainee2024 #M2Carreiras",
    likes: 589,
    comments: 42,
    date: "Há 3 dias"
  },
  {
    id: "inst-4",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
    caption: "Buscando insights constantes e auditorias periódicas sobre incentivos e regimes especiais de tributação? Visite nosso site oficial e assine o M2 Intelligence Advisor mensal gratuito. Link na bio! 📈📬 #M2Intelligence #CFOInsights",
    likes: 275,
    comments: 11,
    date: "Há 1 semana"
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Dr. Roberto Medeiros",
    role: "Sócio-Fundador & Diretor Tributário",
    bio: "Ex-conselheiro da Receita Federal e mestre em Direito Tributário com mais de 25 anos de experiência estruturando planejamentos fiscais para multinacionais industriais.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    name: "Dra. Carolina M. Siqueira",
    role: "Sócia-Fundadora & Diretora de Contencioso",
    bio: "Especialista em defesas administrativas em tribunais fiscais estaduais e federais. Doutoranda pela USP e autora de três livros de doutrina tributária consolidada.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    name: "Dr. Marcos Alencar",
    role: "Sócio & Diretor de Inteligência Digital",
    bio: "Engenheiro de Sistemas e advogado especialista em Tax Tech, líder técnico do desenvolvimento do ecossistema de robôs de conformidade da M2 Intelligence Tax.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80"
  }
];

export const TESTIMONIALS = [
  {
    quote: "A M2 Intelligence Tax foi fundamental na recuperação de mais de R$ 42 milhões em créditos fiscais homologados com absoluta segurança jurídica. O atendimento e competência são impecáveis.",
    author: "Ricardo G. Albuquerque",
    position: "CFO de Conglomerado Logístico",
    logoText: "LogiGroup SA"
  },
  {
    quote: "A equipe técnica da M2 não apenas entende as leis tributárias em nível avançado, mas entrega relatórios e visualizações limpas, que facilitam nossa tomada de decisão executiva.",
    author: "Elisa Vasconcellos",
    position: "Diretora Jurídica e de Relações Governamentais",
    logoText: "EnerBras S.A."
  }
];
