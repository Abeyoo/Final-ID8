import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AuthChoiceProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
  onBack: () => void;
}

const AuthChoice: React.FC<AuthChoiceProps> = ({ onSignIn, onCreateAccount, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Thinkle</span>
            </h1>
            <p className="text-gray-600">Choose how you'd like to continue</p>
          </div>

          <div className="space-y-4">
            {/* Sign In Button */}
            <button
              onClick={onSignIn}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Sign In
            </button>

            {/* Create Account Button */}
            <button
              onClick={onCreateAccount}
              className="w-full bg-white text-gray-800 py-4 px-6 rounded-xl font-semibold border-2 border-gray-300 hover:border-purple-400 hover:bg-gray-50 transition-all duration-300"
            >
              Create Your Account
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to use Replit's secure authentication system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;