'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: 'url(/newbg-1920.jpg)',
        }}
      />
      {/* Header Navbar - Minimal, sleek (shared with root page) */}
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

      {/* Auth Container - Centered */}
      <main className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-md">
          <div className="space-y-8">
            {/* Accent line */}
            <div className="flex justify-center">
              <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            </div>

            {/* Toggle Buttons - Warm gradient */}
            <div className="flex border-2 border-white/30 rounded-lg overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl">
              <button
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-all duration-300 ${
                  isLogin
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white/90 text-slate-700 hover:bg-white'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-all duration-300 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white/90 text-slate-700 hover:bg-white'
                }`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <div className="bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-xl p-8 shadow-2xl space-y-6">
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
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-800 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {/* Submit Button - Warm gradient */}
                <button
                  type="submit"
                  className="w-full group px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm tracking-wide rounded-lg transition-all duration-300 hover:from-amber-600 hover:to-orange-600 hover:shadow-2xl hover:scale-105 hover:cursor-pointer shadow-xl"
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