import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, AlertCircle, UserPlus, Copy, RefreshCw } from 'lucide-react';

interface SignUpProps {
  onSignUp: (profile: any) => void;
  onBackToSignIn: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onBackToSignIn }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    grade: ''
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate secure password on component mount
  useEffect(() => {
    generateSecurePassword();
  }, []);

  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGeneratedPassword(password);
    setPasswordCopied(false);
  };

  const copyPasswordToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

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
    if (!formData.name || !formData.email || !formData.school || !formData.grade) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!generatedPassword) {
      setError('Password generation failed. Please try regenerating.');
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
          password: generatedPassword,
          school: formData.school,
          grade: formData.grade
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save credentials for easy return access
        const savedAccounts = JSON.parse(localStorage.getItem('thinkle_accounts') || '[]');
        const newAccount = {
          name: formData.name,
          email: formData.email,
          password: generatedPassword,
          createdAt: new Date().toISOString(),
          school: formData.school,
          grade: formData.grade
        };
        
        // Add to saved accounts if not already exists
        if (!savedAccounts.find((acc: any) => acc.email === formData.email)) {
          savedAccounts.push(newAccount);
          localStorage.setItem('thinkle_accounts', JSON.stringify(savedAccounts));
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

  const isFormValid = formData.name && formData.email && formData.school && formData.grade && generatedPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Join Thinkle</h1>
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

            {/* Generated Password Display */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-green-900 mb-3">
                <Lock size={16} className="inline mr-2" />
                Your Secure Password (Automatically Generated)
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-white border border-green-200 rounded-lg p-3 font-mono text-sm text-gray-800 break-all">
                  {generatedPassword}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={copyPasswordToClipboard}
                    className={`p-3 rounded-lg transition-all ${
                      passwordCopied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                    title="Copy password to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={generateSecurePassword}
                    className="p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all"
                    title="Generate new password"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-3 text-xs text-green-700">
                <p>🔒 <strong>Important:</strong> Save this password! You'll need it to sign back in.</p>
                <p>• 12 characters with letters, numbers, and symbols for maximum security</p>
                <p>• Click the copy button to save it to your clipboard</p>
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