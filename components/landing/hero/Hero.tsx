

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center px-10 sm:px-6 lg:px-8 flex flex-col items-end ml-[10vh]">
    
          <h1 className="text-6xl sm:text-8xl lg:text-[250px] BSC  text-white font-normal leading-none tracking-wide mb-4">
            VIMIC
          </h1>
          

          <h2 className="text-2xl sm:text-4xl lg:text-[100px] BSC text-white font-normal leading-tight mb-8">
            On Viral
          </h2>

        <p className="text-sm sm:text-base text-white/90 max-w-2xl">
          Vimic는 밈(Meme) 기반 마케팅 콘텐츠 제작을 위한 AI 음악 생성 서비스입니다.
        </p>
        
      </div>
    </section>
  );
}