'use client';

import { useParams } from 'next/navigation';

export default function ScholarshipDetailPage() {
  const params = useParams();
  const scholarshipId = params.id;

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
      <main style={{ maxWidth: '60rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Back Button */}
        <button 
          className="back-button"
          onClick={() => window.location.href = '/scholarships'}
        >
          ← Back to Scholarships
        </button>

        {/* Scholarship Title */}
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', marginTop: '1.5rem' }}>
          Scholarship {scholarshipId}
        </h2>

        {/* Scholarship Details Container */}
        <div className="scholarship-detail-container">
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
            Description
          </h3>
          
          <div className="scholarship-description-box">
            <p style={{ lineHeight: '1.8', color: '#4b5563' }}>
              This is a placeholder for the scholarship description. 
              The actual details will be fetched from the backend. This section 
              will contain information about eligibility criteria, application 
              deadlines, award amounts, and other relevant details about the 
              scholarship opportunity.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="scholarship-actions">
            <button className="save-button">
              Save
            </button>
            <button 
                className="apply-button"
                onClick={() => window.location.href = `/scholarships/${scholarshipId}/essay`}
            >
                Apply
            </button>
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