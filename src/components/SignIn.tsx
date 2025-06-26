import React, { useState } from 'react';
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

  // Mock user data for demonstration
  const mockUsers = [
    {
      email: 'john.doe@lincolnhs.org',
      password: 'password123',
      profile: {
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

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials against mock users
    const user = mockUsers.find(u => 
      u.email.toLowerCase() === formData.email.toLowerCase() && 
      u.password === formData.password
    );

    if (user) {
      onSignIn(user.profile);
    } else {
      setError('Invalid email or password. Please try again.');
    }

    setIsLoading(false);
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
          <p className="text-purple-100">Sign in to continue your journey with ID8</p>
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

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Demo Credentials:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Email:</strong> john.doe@lincolnhs.org</p>
                <p><strong>Password:</strong> password123</p>
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
            <p className="text-gray-600 text-sm mb-3">New to ID8?</p>
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