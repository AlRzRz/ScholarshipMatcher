'use client';

import { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Navbar - Minimal, sleek (shared with root page) */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
            ScholarshipMatcher
          </h1>
        </div>
      </header>

      {/* Auth Container - Centered */}
      <main className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-md">
          <div className="space-y-8">
            {/* Accent line */}
            <div className="flex justify-center">
              <div className="w-16 h-0.5 bg-slate-900"></div>
            </div>

            {/* Toggle Buttons - Minimal, navy blue */}
            <div className="flex border border-slate-200 rounded-lg overflow-hidden">
              <button
                className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 ${
                  isLogin
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 ${
                  !isLogin
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <h2 className="text-2xl font-light text-slate-900 text-center tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isLogin) {
                    // After registration, switch to login
                    setIsLogin(true);
                    alert('Registration successful! Please log in.');
                  } else {
                    // After login, redirect to scholarships page
                    window.location.href = '/scholarships';
                  }
                }}
                className="space-y-5"
              >
                {/* Name Field (only for Register) */}
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {/* Submit Button - Navy blue */}
                <button
                  type="submit"
                  className="w-full group px-8 py-3.5 bg-slate-900 text-white font-medium text-sm tracking-wide transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:cursor-pointer"
                >
                  {isLogin ? 'Login' : 'Register'}
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Minimal, clean (shared with root page) */}
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