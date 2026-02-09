import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Hotel } from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onRegister: (userData: { name: string; email: string; phone: string; password: string }) => void;
}

export function RegisterPage({ onNavigateToLogin, onRegister }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    onRegister({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0F0C] p-4 py-12">
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
            Create Account
          </h1>
          <p className="text-[#ACC8A2]">Join us for exclusive experiences</p>
        </div>

        {/* Register Form */}
        <div className="bg-[#1A2517] rounded-2xl p-8 shadow-2xl border border-[rgba(172,200,162,0.2)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[#ACC8A2] mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ACC8A2]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#2D3D28] text-[#F9FAF9] rounded-lg pl-12 pr-4 py-3 border-2 border-transparent focus:border-[#ACC8A2] outline-none transition-all duration-300"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#ACC8A2] mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ACC8A2]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#2D3D28] text-[#F9FAF9] rounded-lg pl-12 pr-4 py-3 border-2 border-transparent focus:border-[#ACC8A2] outline-none transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[#ACC8A2] mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ACC8A2]" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#2D3D28] text-[#F9FAF9] rounded-lg pl-12 pr-4 py-3 border-2 border-transparent focus:border-[#ACC8A2] outline-none transition-all duration-300"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#ACC8A2] mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ACC8A2]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-[#ACC8A2] mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ACC8A2]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#2D3D28] text-[#F9FAF9] rounded-lg pl-12 pr-12 py-3 border-2 border-transparent focus:border-[#ACC8A2] outline-none transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ACC8A2] hover:text-[#F9FAF9] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start text-sm">
              <input type="checkbox" className="mr-2 mt-1 w-4 h-4 accent-[#ACC8A2]" required />
              <label className="text-[#ACC8A2]">
                I agree to the{' '}
                <a href="#" className="text-[#F9FAF9] hover:underline">Terms & Conditions</a>
                {' '}and{' '}
                <a href="#" className="text-[#F9FAF9] hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <AnimatedButton variant="outline" type="submit" className="w-full mt-6">
              Create Account
            </AnimatedButton>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-[rgba(172,200,162,0.2)]" />
            <span className="px-4 text-[#ACC8A2] text-sm">or</span>
            <div className="flex-1 h-px bg-[rgba(172,200,162,0.2)]" />
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-[#ACC8A2]">
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-[#F9FAF9] hover:underline transition-all"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
