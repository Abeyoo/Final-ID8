import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, AlertCircle, UserPlus } from 'lucide-react';

interface SignUpProps {
  onSignUp: (profile: any) => void;
  onBackToSignIn: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onBackToSignIn }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    grade: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          school: formData.school,
          grade: formData.grade
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save credentials for easy return access
        const savedAccounts = JSON.parse(localStorage.getItem('id8_accounts') || '[]');
        const newAccount = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          createdAt: new Date().toISOString(),
          school: formData.school,
          grade: formData.grade
        };
        
        // Add to saved accounts if not already exists
        if (!savedAccounts.find((acc: any) => acc.email === formData.email)) {
          savedAccounts.push(newAccount);
          localStorage.setItem('id8_accounts', JSON.stringify(savedAccounts));
        }

        const newUserProfile = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          school: formData.school,
          grade: formData.grade,
          age: '', // Will be filled in onboarding
          interests: [],
          personalityType: '',
          role: 'student',
          completedAssessments: data.user.completedAssessments,
          activeGoals: data.user.activeGoals,
          teamProjects: data.user.teamProjects,
          achievements: data.user.achievements
        };
        
        onSignUp(newUserProfile);
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.password && 
                     formData.confirmPassword && formData.school && formData.grade;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Join ID8</h1>
          <p className="text-purple-100">Create your account and start your journey</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

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

            {/* School Field */}
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                School
              </label>
              <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="Enter your school name"
                required
              />
            </div>

            {/* Grade Field */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                required
              >
                <option value="">Select your grade</option>
                <option value="9">9th Grade</option>
                <option value="10">10th Grade</option>
                <option value="11">11th Grade</option>
                <option value="12">12th Grade</option>
              </select>
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
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Back to Sign In */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm mb-3">Already have an account?</p>
            <button
              onClick={onBackToSignIn}
              className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;