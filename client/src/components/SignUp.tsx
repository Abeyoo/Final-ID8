import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, AlertCircle, UserPlus, Copy, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react';

interface SignUpProps {
  onSignUp: (profile: any) => void;
  onBackToSignIn: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onBackToSignIn }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    grade: ''
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [assessmentResponses, setAssessmentResponses] = useState<Record<string, string>>({});
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Interest categories
  const interestCategories = [
    { id: 'Science', name: 'Science & Research', icon: '🔬', description: 'Biology, chemistry, physics, research' },
    { id: 'Technology', name: 'Technology & Programming', icon: '💻', description: 'Coding, robotics, engineering' },
    { id: 'Arts', name: 'Arts & Creativity', icon: '🎨', description: 'Visual arts, music, writing' },
    { id: 'Leadership', name: 'Leadership & Management', icon: '👑', description: 'Student government, organizing' },
    { id: 'Sports', name: 'Sports & Athletics', icon: '⚽', description: 'Team sports, fitness, competition' },
    { id: 'Community', name: 'Community Service', icon: '🤝', description: 'Volunteering, social impact' },
    { id: 'Business', name: 'Business & Finance', icon: '💼', description: 'Entrepreneurship, economics' },
    { id: 'Environment', name: 'Environment & Sustainability', icon: '🌍', description: 'Climate, conservation, green tech' }
  ];

  // Personality assessment questions
  const personalityQuestions = [
    {
      id: 'leadership_style',
      question: 'In group projects, you typically:',
      options: [
        { value: 'take_charge', text: 'Take charge and organize the team', personality: 'Leader' },
        { value: 'contribute_ideas', text: 'Contribute creative ideas and solutions', personality: 'Innovator' },
        { value: 'support_team', text: 'Support team members and ensure everyone participates', personality: 'Collaborator' },
        { value: 'focus_quality', text: 'Focus on details and ensure high-quality work', personality: 'Perfectionist' }
      ]
    },
    {
      id: 'problem_solving',
      question: 'When facing a challenging problem, you prefer to:',
      options: [
        { value: 'research_explore', text: 'Research thoroughly and explore multiple approaches', personality: 'Explorer' },
        { value: 'systematic_method', text: 'Use a systematic, proven method', personality: 'Perfectionist' },
        { value: 'brainstorm_team', text: 'Brainstorm with others and get different perspectives', personality: 'Collaborator' },
        { value: 'decide_quickly', text: 'Make a decision quickly and take action', personality: 'Leader' }
      ]
    },
    {
      id: 'communication_style',
      question: 'In discussions or debates, you tend to:',
      options: [
        { value: 'find_compromise', text: 'Find common ground and help others reach compromise', personality: 'Mediator' },
        { value: 'present_facts', text: 'Present well-researched facts and evidence', personality: 'Perfectionist' },
        { value: 'share_creative_ideas', text: 'Share creative or unconventional ideas', personality: 'Innovator' },
        { value: 'facilitate_discussion', text: 'Facilitate the discussion and ensure everyone is heard', personality: 'Collaborator' }
      ]
    },
    {
      id: 'learning_preference',
      question: 'You learn best when:',
      options: [
        { value: 'hands_on_experiment', text: 'You can experiment and try new approaches', personality: 'Explorer' },
        { value: 'step_by_step', text: 'Information is presented step-by-step with clear structure', personality: 'Perfectionist' },
        { value: 'group_discussion', text: 'You can discuss and learn with peers', personality: 'Collaborator' },
        { value: 'practical_application', text: 'You can see practical applications and take initiative', personality: 'Leader' }
      ]
    },
    {
      id: 'conflict_resolution',
      question: 'When there\'s conflict in your team, you usually:',
      options: [
        { value: 'mediate_peaceful', text: 'Try to mediate and find a peaceful solution', personality: 'Mediator' },
        { value: 'propose_alternative', text: 'Propose an alternative approach that satisfies everyone', personality: 'Innovator' },
        { value: 'address_directly', text: 'Address the issue directly and work toward resolution', personality: 'Leader' },
        { value: 'listen_understand', text: 'Listen to all sides and help people understand each other', personality: 'Collaborator' }
      ]
    }
  ];

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
    setError('');
  };

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else if (prev.length < 3) {
        return [...prev, interestId];
      } else {
        return prev;
      }
    });
  };

  const handleAssessmentResponse = (questionId: string, value: string) => {
    setAssessmentResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculatePersonality = () => {
    const personalityScores: Record<string, number> = {
      Leader: 0,
      Innovator: 0,
      Collaborator: 0,
      Perfectionist: 0,
      Explorer: 0,
      Mediator: 0
    };

    // Count responses for each personality type
    personalityQuestions.forEach(question => {
      const response = assessmentResponses[question.id];
      if (response) {
        const option = question.options.find(opt => opt.value === response);
        if (option) {
          personalityScores[option.personality]++;
        }
      }
    });

    // Find the personality type with the highest score
    const topPersonality = Object.entries(personalityScores)
      .reduce((max, [type, score]) => score > max[1] ? [type, score] : max, ['', 0])[0];

    return topPersonality;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate basic info
      if (!formData.name || !formData.email || !formData.school || !formData.grade) {
        setError('Please fill in all fields');
        return;
      }
    } else if (currentStep === 2) {
      // Validate interests
      if (selectedInterests.length !== 3) {
        setError('Please select exactly 3 interests');
        return;
      }
    } else if (currentStep === 3) {
      // Validate assessment
      if (Object.keys(assessmentResponses).length !== personalityQuestions.length) {
        setError('Please answer all questions');
        return;
      }
    }
    
    setError('');
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const personalityType = calculatePersonality();
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          password: generatedPassword,
          interests: selectedInterests,
          personalityType,
          assessmentResponses
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Pass the comprehensive user data to parent component
        onSignUp({
          ...data.user,
          interests: selectedInterests,
          personalityType,
          assessmentResponses
        });
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
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
            placeholder="Enter your email address"
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

      {/* Generated Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Password (Generated)
        </label>
        <div className="relative">
          <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={generatedPassword}
            readOnly
            className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
            <button
              type="button"
              onClick={copyPasswordToClipboard}
              className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
              title="Copy password"
            >
              {passwordCopied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
            <button
              type="button"
              onClick={generateSecurePassword}
              className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
              title="Generate new password"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Save this password securely. You'll need it to sign in.
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Your Interests</h2>
        <p className="text-gray-600">Choose exactly 3 areas that interest you most</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {interestCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => handleInterestToggle(category.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedInterests.includes(category.id)
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              {selectedInterests.includes(category.id) && (
                <CheckCircle size={20} className="text-purple-500 ml-auto" />
              )}
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-gray-500">
        Selected: {selectedInterests.length}/3
      </p>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Personality Assessment</h2>
        <p className="text-gray-600">Answer these questions to help us understand your personality type</p>
      </div>

      <div className="space-y-6">
        {personalityQuestions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <h3 className="font-medium text-gray-900">
              {index + 1}. {question.question}
            </h3>
            <div className="space-y-2">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAssessmentResponse(question.id, option.value)}
                  className={`w-full p-3 text-left rounded-lg border transition-all ${
                    assessmentResponses[question.id] === option.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {option.text}
                  {assessmentResponses[question.id] === option.value && (
                    <CheckCircle size={16} className="text-purple-500 ml-2 inline" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-purple-100">Step {currentStep} of 3</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle size={20} className="text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <div>
              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={onBackToSignIn}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Previous</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={nextStep}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentStep === 3 ? (isLoading ? 'Creating Account...' : 'Create Account') : 'Next'}</span>
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;