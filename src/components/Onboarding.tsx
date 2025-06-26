import React, { useState } from 'react';
import { User, Users, Brain, Camera, ChevronRight, ChevronLeft, Star, Heart, Zap, Target, Lightbulb, Shield, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: any) => void;
  onBackToSignIn?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onBackToSignIn }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    role: '',
    name: '',
    age: '',
    school: '',
    grade: '',
    email: '',
    emailVerified: false,
    interests: [],
    personalityType: '',
    strengths: [],
    parentalConsent: false
  });

  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isStudent: false,
    domain: '',
    message: ''
  });

  const steps = [
    'Role Selection',
    'Personal Info',
    'Email Verification',
    'Interests Survey',
    'Personality Assessment',
    'Profile Complete'
  ];

  const interests = [
    { id: 'science', label: 'Science & Research', icon: Brain },
    { id: 'arts', label: 'Arts & Creativity', icon: Heart },
    { id: 'technology', label: 'Technology & Programming', icon: Zap },
    { id: 'sports', label: 'Sports & Athletics', icon: Target },
    { id: 'leadership', label: 'Leadership & Management', icon: Star },
    { id: 'writing', label: 'Writing & Literature', icon: Lightbulb },
    { id: 'music', label: 'Music & Performance', icon: Heart },
    { id: 'environment', label: 'Environment & Sustainability', icon: Shield }
  ];

  const personalityQuestions = [
    {
      question: "In group projects, you prefer to:",
      options: [
        { text: "Take charge and organize the team", type: "Leader" },
        { text: "Come up with creative solutions", type: "Innovator" },
        { text: "Support others and ensure harmony", type: "Collaborator" },
        { text: "Focus on details and quality", type: "Perfectionist" }
      ]
    },
    {
      question: "When facing a challenge, you:",
      options: [
        { text: "Break it down into logical steps", type: "Analyst" },
        { text: "Look for creative alternatives", type: "Innovator" },
        { text: "Seek advice from others", type: "Collaborator" },
        { text: "Push through with determination", type: "Leader" }
      ]
    },
    {
      question: "You feel most energized when:",
      options: [
        { text: "Working with a team", type: "Collaborator" },
        { text: "Solving complex problems", type: "Analyst" },
        { text: "Creating something new", type: "Innovator" },
        { text: "Achieving ambitious goals", type: "Leader" }
      ]
    }
  ];

  const [personalityAnswers, setPersonalityAnswers] = useState<string[]>([]);

  // Common educational email domains
  const educationalDomains = [
    '.edu', '.ac.uk', '.edu.au', '.edu.ca', '.ac.nz', '.edu.sg', '.ac.za',
    'student.', 'students.', 'mail.', 'my.', 'alumni.',
    // Specific school domains (examples)
    'lincolnhs.org', 'techacademy.edu', 'centralhs.net', 'innovationacademy.org'
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(email);
    
    if (!isValidFormat) {
      setEmailValidation({
        isValid: false,
        isStudent: false,
        domain: '',
        message: 'Please enter a valid email address'
      });
      return;
    }

    const domain = email.split('@')[1].toLowerCase();
    const isEducational = educationalDomains.some(eduDomain => 
      domain.includes(eduDomain) || domain.endsWith(eduDomain)
    );

    setEmailValidation({
      isValid: isValidFormat,
      isStudent: isEducational,
      domain: domain,
      message: isEducational 
        ? 'Student email verified! ✓' 
        : 'Please use your school email address for verification'
    });

    setProfile(prev => ({
      ...prev,
      emailVerified: isEducational
    }));
  };

  const handleEmailChange = (email: string) => {
    setProfile(prev => ({ ...prev, email }));
    if (email) {
      validateEmail(email);
    } else {
      setEmailValidation({
        isValid: false,
        isStudent: false,
        domain: '',
        message: ''
      });
    }
  };

  const handleInterestToggle = (interestId: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handlePersonalityAnswer = (questionIndex: number, type: string) => {
    const newAnswers = [...personalityAnswers];
    newAnswers[questionIndex] = type;
    setPersonalityAnswers(newAnswers);
  };

  const calculatePersonalityType = () => {
    const counts = personalityAnswers.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Balanced';
  };

  const nextStep = () => {
    if (currentStep === 4) {
      const personalityType = calculatePersonalityType();
      setProfile(prev => ({ ...prev, personalityType }));
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const completeOnboarding = () => {
    onComplete(profile);
  };

  const handleBackToSignIn = () => {
    if (onBackToSignIn) {
      onBackToSignIn();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return profile.role !== '';
      case 1: return profile.name && profile.age && profile.school && profile.grade;
      case 2: return profile.email && emailValidation.isStudent;
      case 3: return profile.interests.length >= 3;
      case 4: return personalityAnswers.length === personalityQuestions.length;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to ID8</h1>
            <div className="flex items-center space-x-4">
              {onBackToSignIn && (
                <button
                  onClick={handleBackToSignIn}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Sign In
                </button>
              )}
              <span className="text-sm text-gray-600">{currentStep + 1} of {steps.length}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={step}
                className={`text-xs ${index <= currentStep ? 'text-purple-600 font-medium' : 'text-gray-400'}`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        <div className="p-8">
          {/* Step 0: Role Selection */}
          {currentStep === 0 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Role</h2>
              <p className="text-gray-600 mb-8">How would you like to use ID8?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button
                  onClick={() => setProfile(prev => ({ ...prev, role: 'student' }))}
                  className={`p-8 rounded-xl border-2 transition-all ${
                    profile.role === 'student'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <User size={48} className={`mx-auto mb-4 ${profile.role === 'student' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Student</h3>
                  <p className="text-gray-600">Discover your strengths, set goals, and connect with peers</p>
                </button>
                
                <button
                  onClick={() => setProfile(prev => ({ ...prev, role: 'mentor' }))}
                  className={`p-8 rounded-xl border-2 transition-all ${
                    profile.role === 'mentor'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <Users size={48} className={`mx-auto mb-4 ${profile.role === 'mentor' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mentor</h3>
                  <p className="text-gray-600">Guide students and share your expertise</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Tell Us About Yourself</h2>
              <p className="text-gray-600 mb-8 text-center">Help us personalize your experience</p>
              
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <select
                      value={profile.age}
                      onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select age</option>
                      {Array.from({ length: 8 }, (_, i) => i + 13).map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                  <input
                    type="text"
                    value={profile.school}
                    onChange={(e) => setProfile(prev => ({ ...prev, school: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your school name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                  <select
                    value={profile.grade}
                    onChange={(e) => setProfile(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select grade</option>
                    <option value="6">6th Grade</option>
                    <option value="7">7th Grade</option>
                    <option value="8">8th Grade</option>
                    <option value="9">9th Grade</option>
                    <option value="10">10th Grade</option>
                    <option value="11">11th Grade</option>
                    <option value="12">12th Grade</option>
                  </select>
                </div>

                {parseInt(profile.age) < 14 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="parentalConsent"
                        checked={profile.parentalConsent}
                        onChange={(e) => setProfile(prev => ({ ...prev, parentalConsent: e.target.checked }))}
                        className="mr-3"
                      />
                      <label htmlFor="parentalConsent" className="text-sm text-gray-700">
                        I have parental consent to use this platform
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Email Verification */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Verify Your Student Email</h2>
              <p className="text-gray-600 mb-8 text-center">We need to verify you're a student to ensure platform security</p>
              
              <div className="max-w-2xl mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <Mail size={24} className="text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Why do we need your school email?</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Verify you're a legitimate student</li>
                        <li>• Connect you with peers from your school</li>
                        <li>• Ensure platform safety and security</li>
                        <li>• Enable school-specific features and opportunities</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Email Address
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-all ${
                          profile.email && emailValidation.isValid
                            ? emailValidation.isStudent
                              ? 'border-green-300 bg-green-50'
                              : 'border-red-300 bg-red-50'
                            : 'border-gray-300'
                        }`}
                        placeholder="your.name@school.edu"
                      />
                      {profile.email && emailValidation.isValid && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {emailValidation.isStudent ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : (
                            <AlertCircle size={20} className="text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {emailValidation.message && (
                      <div className={`mt-2 text-sm flex items-center ${
                        emailValidation.isStudent ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {emailValidation.isStudent ? (
                          <CheckCircle size={16} className="mr-2" />
                        ) : (
                          <AlertCircle size={16} className="mr-2" />
                        )}
                        {emailValidation.message}
                      </div>
                    )}
                  </div>

                  {emailValidation.domain && !emailValidation.isStudent && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-1">Need help finding your school email?</h4>
                          <p className="text-sm text-yellow-700 mb-2">
                            Your school email usually ends with .edu or contains your school name. Examples:
                          </p>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• john.doe@lincolnhs.org</li>
                            <li>• jdoe@students.techacademy.edu</li>
                            <li>• john.doe@mail.centralhs.net</li>
                          </ul>
                          <p className="text-sm text-yellow-700 mt-2">
                            Contact your school's IT department if you're unsure about your email address.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {emailValidation.isStudent && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-green-600" />
                        <div>
                          <h4 className="font-medium text-green-800">Email Verified!</h4>
                          <p className="text-sm text-green-700">
                            Great! We've verified your student status. You can now proceed to the next step.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests Survey */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">What Interests You?</h2>
              <p className="text-gray-600 mb-8 text-center">Select at least 3 areas that excite you (you can change these later)</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {interests.map((interest) => {
                  const Icon = interest.icon;
                  const isSelected = profile.interests.includes(interest.id);
                  
                  return (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <Icon size={32} className={`mx-auto mb-3 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                      <h3 className={`text-sm font-medium text-center ${isSelected ? 'text-purple-900' : 'text-gray-700'}`}>
                        {interest.label}
                      </h3>
                    </button>
                  );
                })}
              </div>
              
              <p className="text-center text-sm text-gray-500 mt-6">
                Selected: {profile.interests.length} / 8
              </p>
            </div>
          )}

          {/* Step 4: Personality Assessment */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Personality Assessment</h2>
              <p className="text-gray-600 mb-8 text-center">Answer these questions to help us understand your working style</p>
              
              <div className="max-w-3xl mx-auto space-y-8">
                {personalityQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {qIndex + 1}. {q.question}
                    </h3>
                    <div className="space-y-3">
                      {q.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handlePersonalityAnswer(qIndex, option.type)}
                          className={`w-full p-4 text-left rounded-lg border transition-all ${
                            personalityAnswers[qIndex] === option.type
                              ? 'border-purple-500 bg-purple-50 text-purple-900'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-white'
                          }`}
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Profile Complete */}
          {currentStep === 5 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star size={48} className="text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to ID8!</h2>
              <p className="text-gray-600 mb-8">Your profile is complete. Here's what we discovered about you:</p>
              
              <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personal Info</h3>
                    <p className="text-sm text-gray-600">Name: {profile.name}</p>
                    <p className="text-sm text-gray-600">Grade: {profile.grade}th Grade</p>
                    <p className="text-sm text-gray-600">School: {profile.school}</p>
                    <p className="text-sm text-gray-600">Email: {profile.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personality Type</h3>
                    <p className="text-lg font-bold text-purple-600">{profile.personalityType}</p>
                    <p className="text-sm text-gray-600">
                      {profile.personalityType === 'Leader' && 'Natural leader who takes initiative'}
                      {profile.personalityType === 'Innovator' && 'Creative problem solver who thinks outside the box'}
                      {profile.personalityType === 'Collaborator' && 'Team player who values harmony and cooperation'}
                      {profile.personalityType === 'Analyst' && 'Logical thinker who loves solving complex problems'}
                      {profile.personalityType === 'Perfectionist' && 'Detail-oriented achiever who strives for excellence'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Top Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.slice(0, 5).map(interestId => {
                      const interest = interests.find(i => i.id === interestId);
                      return (
                        <span key={interestId} className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                          {interest?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <button
                onClick={completeOnboarding}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Start Your Journey
              </button>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="bg-gray-50 px-8 py-6 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} className="mr-2" />
              Previous
            </button>
            
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;