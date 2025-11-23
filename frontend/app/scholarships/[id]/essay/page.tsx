'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function EssayPage() {
  const params = useParams();
  const scholarshipId = params.id;
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [essayText, setEssayText] = useState(
    'This is where the AI generated essay will be. The essay content will be dynamically generated based on your profile and the scholarship requirements.'
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    setIsEditing(false);
    setIsSubmitted(true);
  };

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
          onClick={() => window.location.href = `/scholarships/${scholarshipId}`}
        >
          ← Back to Scholarship
        </button>

        {isSubmitted ? (
          /* Success Message */
          <div className="success-container">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '1rem' }}>
                Essay Submitted Successfully!
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
                Your application has been submitted for Scholarship {scholarshipId}
              </p>
              <button 
                className="back-to-scholarships-button"
                onClick={() => window.location.href = '/scholarships'}
              >
                Back to Scholarships List
              </button>
            </div>
          </div>
        ) : (
          /* Essay Editor */
          <div className="essay-container">
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', marginTop: '1.5rem' }}>
              AI Generated Personal Essay
            </h2>

            {/* Essay Text Box */}
            <div className="essay-box-container">
              {isEditing ? (
                <textarea
                  className="essay-textarea"
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  rows={12}
                />
              ) : (
                <div className="essay-display">
                  {essayText}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="essay-actions">
              <button 
                className="edit-essay-button"
                onClick={handleEdit}
              >
                Edit Essay
              </button>
              <button 
                className="submit-essay-button"
                onClick={handleSubmit}
              >
                Submit Essay
              </button>
            </div>
          </div>
        )}
      </main>
        {/* Footer */}
      <footer className="footer">
        <div className="footer-title">ScholarshipMaster</div>
        <div className="footer-credit">Made by: [Your Name Here]</div>
      </footer>

    </div>
  );
}