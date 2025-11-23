import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Navbar - Minimal, sleek */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
            ScholarshipMatcher
          </h1>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="max-w-3xl w-full mx-auto text-center">
          <div className="space-y-8">
            {/* Accent line */}
            <div className="flex justify-center">
              <div className="w-16 h-0.5 bg-cyan-500"></div>
            </div>
            
            {/* Headline - Centered */}
            <h2 className="text-5xl lg:text-6xl font-light text-slate-900 leading-tight tracking-tight">
              Find Your Perfect
              <span className="block font-medium text-cyan-500 mt-2">Scholarship Match</span>
            </h2>
            
            {/* Description - Centered */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto font-light">
              Discover scholarships tailored to your unique profile. Our 
              intelligent matching system connects you with opportunities 
              based on your academic achievements, interests, and background.
            </p>
            
            {/* CTA Button - Centered */}
            <div className="pt-4">
              <Link href="/auth">
                <button className="group px-8 py-3.5 bg-slate-900 text-white font-medium text-sm tracking-wide transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:cursor-pointer">
                  Get Started
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Minimal, clean */}
      <footer className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm font-medium text-slate-900">ScholarshipMatcher</div>
            <div className="text-xs text-slate-500">Made by: Areeba, Nour, AR</div>
          </div>
        </div>
      </footer>
    </div>
  );
}