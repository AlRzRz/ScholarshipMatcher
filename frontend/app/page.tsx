import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
  <div className="min-h-screen bg-gray-50" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header Navbar */}
      <header className="header-navbar">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">
            ScholarshipMaster
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Container Box with Description and Logo */}
        <div className="content-container">
          {/* Left side: Description and Button */}
          <div className="description-section">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Find Your Perfect Scholarship Match
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Discover scholarships tailored to your unique profile. Our 
              intelligent matching system connects you with opportunities 
              based on your academic achievements, interests, and background. 
              Start your journey to funding your education today!
            </p>
            
            {/* Get Started Button */}
            <Link href="/auth">
              <button className="get-started-button">
                Get Started →
              </button>
            </Link>
          </div>
          {/* Right side: Logo */}
          <div className="logo-section">
            <img 
              src="/ScholarshipMatcher.png" 
              alt="ScholarshipMatcher Logo" 
              className="logo-image"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-title">ScholarshipMaster</div>
        <div className="footer-credit">Made by: [Your Name Here]</div>
      </footer>
    </div>
  );
}