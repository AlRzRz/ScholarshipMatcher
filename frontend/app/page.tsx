import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: 'url(/newbg-1920.jpg)',
        }}
      />
      {/* Header Navbar - Minimal, sleek */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-white/10">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Modern Logo with Icon */}
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-lg">
              ScholarshipMatcher
            </h1>
          </Link>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="max-w-3xl w-full mx-auto text-center">
          <div className="space-y-8">
            {/* Accent line */}
            <div className="flex justify-center">
              <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            </div>
            
            {/* Headline - Centered */}
            <h2 className="text-5xl lg:text-7xl font-semibold text-white leading-tight tracking-tight drop-shadow-2xl">
              Find Your Perfect
              <span 
                className="block font-bold bg-gradient-to-r from-amber-200 via-orange-300 to-emerald-400 bg-clip-text text-transparent mt-2 drop-shadow-xl"
                style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}
              >
                Scholarship Match
              </span>
            </h2>
            
            {/* Description - Centered */}
            <p className="text-lg text-white/90 leading-relaxed max-w-xl mx-auto font-light drop-shadow-md">
              Discover scholarships tailored to your unique profile. Our 
              intelligent matching system connects you with opportunities 
              based on your academic achievements, interests, and background.
            </p>
            
            {/* CTA Button - Centered */}
            <div className="pt-4">
              <Link href="/auth">
                <button className="group px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm tracking-wide rounded-lg transition-all duration-300 hover:from-amber-600 hover:to-orange-600 hover:shadow-2xl hover:scale-105 hover:cursor-pointer shadow-xl">
                  Get Started
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Minimal, clean */}
      <footer className="border-t border-white/20 backdrop-blur-sm bg-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-500 to-orange-500"></div>
              <div className="text-sm font-semibold text-white drop-shadow-md">ScholarshipMatcher</div>
            </div>
            <div className="text-xs text-white/80">Made by: Areeba, Nour, AR</div>
          </div>
        </div>
      </footer>
    </div>
  );
}