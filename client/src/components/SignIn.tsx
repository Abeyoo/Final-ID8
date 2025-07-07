import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, AlertCircle } from 'lucide-react';

interface SignInProps {
  onSignIn: (profile: any) => void;
  onGoToOnboarding: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onGoToOnboarding }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedAccounts, setSavedAccounts] = useState<any[]>([]);

  // Load saved accounts on component mount
  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem('thinkle_accounts') || '[]');
    setSavedAccounts(accounts);
  }, []);

  // Mock user data for demonstration
  const mockUsers = [
    {
      email: 'john.doe@lincolnhs.org',
      password: 'password123',
      profile: {
        id: 1,
        name: 'John Doe',
        age: '16',
        school: 'Lincoln High School',
        grade: '11',
        email: 'john.doe@lincolnhs.org',
        interests: ['science', 'technology', 'leadership'],
        personalityType: 'Leader',
        role: 'student'
      }
    },
    {
      email: 'sarah.chen@techacademy.edu',
      password: 'password123',
      profile: {
        id: 2,
        name: 'Sarah Chen',
        age: '17',
        school: 'Tech Academy',
        grade: '12',
        email: 'sarah.chen@techacademy.edu',
        interests: ['science', 'arts', 'technology'],
        personalityType: 'Innovator',
        role: 'student'
      }
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSignIn(data.user);
      } else {
        setError(data.error || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-purple-100">Sign in to continue your journey with Thinkle</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="your.email@school.edu"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </button>

            {/* Demo Accounts */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                <User size={16} className="mr-2" />
                Available Demo Accounts
              </h4>
              <div className="space-y-3">
                {/* Comprehensive Demo Account */}
                <div className="bg-white rounded-md p-3 border border-blue-100">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">John Doe - Full Demo</h5>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Email:</strong> john.doe@lincolnhs.org</p>
                    <p><strong>Password:</strong> password123</p>
                    <p className="text-xs text-gray-600 mt-2">
                      • 5 Goals (30-100% progress) • 5 Achievements • Team Leadership roles • AI Personality Analysis
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ email: 'john.doe@lincolnhs.org', password: 'password123' });
                    }}
                    className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                  >
                    Use These Credentials
                  </button>
                </div>

                {/* Saved User Accounts */}
                {savedAccounts.length > 0 && (
                  <>
                    {savedAccounts.slice(0, 2).map((account, index) => (
                      <div key={account.email} className="bg-white rounded-md p-3 border border-blue-100">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{account.name}</h5>
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Your Account</span>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p><strong>Email:</strong> {account.email}</p>
                          <p><strong>Password:</strong> {account.password}</p>
                          <p className="text-xs text-gray-600 mt-2">
                            • {account.school} • Grade {account.grade} • Created {new Date(account.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ email: account.email, password: account.password });
                          }}
                          className="mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                        >
                          Use These Credentials
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {/* New User Account */}
                <div className="bg-white rounded-md p-3 border border-blue-100">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">New User Experience</h5>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Fresh Start</span>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Action:</strong> Click "Create your account" below</p>
                    <p className="text-xs text-gray-600 mt-2">
                      • Complete onboarding flow • Start with 0 stats • Build your profile from scratch
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-700">
                  💡 <strong>Tip:</strong> Your account progress is automatically saved. Return anytime with the same credentials.
                </p>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          </form>

          {/* New User Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm mb-3">New to Thinkle?</p>
            <button
              onClick={onGoToOnboarding}
              className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              Create your account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;