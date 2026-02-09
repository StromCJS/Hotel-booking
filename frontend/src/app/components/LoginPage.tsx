import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Hotel } from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onLogin: (email: string, password: string) => void;
}

export function LoginPage({ onNavigateToRegister, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0F0C] p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #ACC8A2 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ACC8A2] rounded-full mb-4">
            <Hotel className="w-8 h-8 text-[#1A2517]" />
          </div>
          <h1 className="text-4xl font-[700] text-[#F9FAF9] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome Back
          </h1>
          <p className="text-[#ACC8A2]">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1A2517] rounded-2xl p-8 shadow-2xl border border-[rgba(172,200,162,0.2)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-[#ACC8A2] mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ACC8A2]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#2D3D28] text-[#F9FAF9] rounded-lg pl-12 pr-4 py-3 border-2 border-transparent focus:border-[#ACC8A2] outline-none transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[#ACC8A2] mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ACC8A2]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2D3D28] text-[#F9FAF9] rounded-lg pl-12 pr-12 py-3 border-2 border-transparent focus:border-[#ACC8A2] outline-none transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ACC8A2] hover:text-[#F9FAF9] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-[#ACC8A2] cursor-pointer">
                <input type="checkbox" className="mr-2 w-4 h-4 accent-[#ACC8A2]" />
                Remember me
              </label>
              <a href="#" className="text-[#ACC8A2] hover:text-[#F9FAF9] transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <AnimatedButton variant="outline" type="submit" className="w-full">
              Sign In
            </AnimatedButton>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-[rgba(172,200,162,0.2)]" />
            <span className="px-4 text-[#ACC8A2] text-sm">or</span>
            <div className="flex-1 h-px bg-[rgba(172,200,162,0.2)]" />
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-[#ACC8A2]">
              Don't have an account?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-[#F9FAF9] hover:underline transition-all"
              >
                Create one now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
