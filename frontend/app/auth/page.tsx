'use client';

import { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Header Navbar */}
      <header className="header-navbar">
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
            ScholarshipMaster
          </h1>
        </div>
      </header>

      {/* Auth Container */}
      <main style={{ maxWidth: '28rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div className="auth-container">
          {/* Toggle Buttons */}
          <div className="auth-toggle">
            <button
              className={`toggle-button ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`toggle-button ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <div className="auth-form">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>

            <form onSubmit={(e) => {
                e.preventDefault();
                if (!isLogin) {
                // After registration, switch to login
                setIsLogin(true);
                alert('Registration successful! Please log in.');
                } else {
                // After login, redirect to scholarships page
                window.location.href = '/scholarships';
                }
            }}>
              {/* Name Field (only for Register) */}
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="auth-submit-button">
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>
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