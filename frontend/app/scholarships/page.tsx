'use client';

export default function ScholarshipsPage() {
  // Temporary dummy data - will be replaced with backend data later
  const dummyScholarships = Array(10).fill(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header Navbar */}
      <header className="header-navbar">
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
            ScholarshipMaster
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
          Available Scholarships
        </h2>

        {/* Scholarships List */}
        <div className="scholarships-list">
          {dummyScholarships.map((_, index) => (
            <div 
            key={index} 
            className="scholarship-box"
            onClick={() => window.location.href = `/scholarships/${index + 1}`}
        >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
                Scholarship {index + 1}
            </h3>
        </div>
    ))}
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