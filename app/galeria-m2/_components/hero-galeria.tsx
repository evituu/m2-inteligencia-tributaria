'use client'

const officeImages = [
  "/imagens/office/fachada_m2.webp",
  "/imagens/office/foto_calculadora_m2.png",
  "/imagens/office/m2_colaboradores_trabalhando.png",
  "/imagens/office/m2_lideres_socios.png",
  "/imagens/office/fachada_m2.webp",
  "/imagens/office/m2_colaboradores_trabalhando.png",
]

// Clip-paths orgânicos para cada coluna criando formas onduladas/curvas
const clipPaths = [
  "polygon(0% 0%, 95% 5%, 100% 50%, 95% 95%, 0% 100%)",
  "polygon(5% 0%, 100% 3%, 100% 15%, 98% 50%, 100% 85%, 100% 97%, 5% 100%, 0% 85%, 2% 50%, 0% 15%)",
  "polygon(0% 0%, 100% 2%, 100% 100%, 0% 98%)",
  "polygon(3% 0%, 100% 5%, 98% 50%, 100% 95%, 3% 100%, 0% 90%, 2% 50%, 0% 10%)",
  "polygon(0% 0%, 95% 8%, 100% 100%, 0% 100%)",
  "polygon(0% 5%, 100% 0%, 100% 95%, 5% 100%)",
]

export function HeroGaleria() {
  return (
    <section className="relative w-full min-h-screen md:min-h-[600px] bg-[#05090c] overflow-hidden flex items-center justify-center">
      {/* Background com faixas verticais orgânicas */}
      <div className="absolute inset-0 flex w-full h-full">
        {officeImages.map((image, idx) => (
          <div
            key={idx}
            className="relative flex-1 h-full overflow-hidden"
            style={{
              clipPath: clipPaths[idx],
            }}
          >
            {/* Imagem de fundo */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
              style={{
                backgroundImage: `url('${image}')`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            
            {/* Overlay escuro para contraste */}
            <div className="absolute inset-0 bg-[#05090c]/55" />
            
            {/* Gradient overlay para transição suave */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#05090c]/30 via-transparent to-[#05090c]/40" />
          </div>
        ))}
      </div>

      {/* Conteúdo central com alta legibilidade */}
      <div className="relative z-10 max-w-4xl flex flex-col items-center text-center px-4 py-20 md:py-32">
        <span className="text-[#f2c40f] text-sm md:text-sm font-semibold tracking-[0.2em] uppercase mb-4 drop-shadow-lg">
          Nossas Memórias
        </span>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold-gradient mb-6 tracking-tight drop-shadow-lg">
          Galeria M2
        </h1>
        
        <p className="text-white text-base md:text-lg mb-12 max-w-2xl leading-relaxed drop-shadow-md">
          Transparência, excelência corporativa e a dedicação da nossa equipe refletidas em nosso 
          ambiente de trabalho e eventos. Conheça os bastidores da M2 Intelligence Tax.
        </p>
        
        <div className="w-16 h-1 mt-2 bg-[#f2c40f] rounded-full drop-shadow-lg"></div>
      </div>
    </section>
  )
}
