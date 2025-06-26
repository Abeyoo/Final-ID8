import React, { useState } from 'react';
import { Brain, Play, CheckCircle, BarChart3, Lightbulb, Star, Target, Users, Zap } from 'lucide-react';

const SelfAssessment: React.FC = () => {
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const assessments = [
    {
      id: 'strengths',
      title: 'Strengths Discovery',
      description: 'Identify your top 5 character strengths and natural talents',
      duration: '15 min',
      questions: 25,
      completed: true,
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      category: 'Core Assessment'
    },
    {
      id: 'personality',
      title: 'Personality Type (MBTI-Style)',
      description: 'Understand your personality preferences and working style',
      duration: '20 min',
      questions: 30,
      completed: false,
      icon: Lightbulb,
      color: 'from-blue-500 to-blue-600',
      category: 'Personality'
    },
    {
      id: 'interests',
      title: 'Interest Inventory',
      description: 'Explore your passions and areas of natural curiosity',
      duration: '12 min',
      questions: 20,
      completed: true,
      icon: Star,
      color: 'from-green-500 to-green-600',
      category: 'Interests'
    },
    {
      id: 'values',
      title: 'Values Assessment',
      description: 'Discover what matters most to you in life and work',
      duration: '10 min',
      questions: 15,
      completed: false,
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      category: 'Values'
    },
    {
      id: 'learning',
      title: 'Learning Style',
      description: 'Discover how you learn best and retain information',
      duration: '8 min',
      questions: 16,
      completed: true,
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600',
      category: 'Learning'
    },
    {
      id: 'leadership',
      title: 'Leadership Style',
      description: 'Understand your natural leadership approach and preferences',
      duration: '15 min',
      questions: 22,
      completed: false,
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      category: 'Leadership'
    }
  ];

  const strengthsQuestions = [
    {
      question: "I naturally take charge in group situations and enjoy leading others.",
      category: "Leadership",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
      question: "I love coming up with new ideas and creative solutions to problems.",
      category: "Creativity",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
      question: "I feel energized when helping others and making a positive impact.",
      category: "Empathy",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
      question: "I enjoy analyzing complex problems and finding logical solutions.",
      category: "Analytical Thinking",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
      question: "I communicate my ideas clearly and enjoy public speaking.",
      category: "Communication",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    }
  ];

  const personalityQuestions = [
    {
      question: "At parties, you:",
      options: [
        { text: "Interact with many people, including strangers", type: "E" },
        { text: "Interact with a few people you know well", type: "I" }
      ]
    },
    {
      question: "You are more drawn to:",
      options: [
        { text: "Practical, concrete information", type: "S" },
        { text: "Theoretical concepts and possibilities", type: "N" }
      ]
    },
    {
      question: "When making decisions, you rely more on:",
      options: [
        { text: "Logic and objective analysis", type: "T" },
        { text: "Personal values and how others are affected", type: "F" }
      ]
    },
    {
      question: "You prefer to:",
      options: [
        { text: "Have things decided and settled", type: "J" },
        { text: "Keep your options open and flexible", type: "P" }
      ]
    }
  ];

  const handleAnswer = (questionIndex: number, answer: any) => {
    const assessment = assessments.find(a => a.id === activeAssessment);
    if (!assessment) return;

    setAnswers(prev => ({
      ...prev,
      [`${activeAssessment}_${questionIndex}`]: answer
    }));
  };

  const nextQuestion = () => {
    const assessment = assessments.find(a => a.id === activeAssessment);
    if (!assessment) return;

    const questions = activeAssessment === 'strengths' ? strengthsQuestions : personalityQuestions;
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete assessment
      setActiveAssessment(null);
      setCurrentQuestion(0);
    }
  };

  const prevQuestion = () => {
    setCurrentQuestion(Math.max(0, currentQuestion - 1));
  };

  if (activeAssessment) {
    const assessment = assessments.find(a => a.id === activeAssessment);
    const questions = activeAssessment === 'strengths' ? strengthsQuestions : personalityQuestions;
    const currentQ = questions[currentQuestion];
    
    if (!assessment || !currentQ) return null;

    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Assessment Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${assessment.color} rounded-lg flex items-center justify-center`}>
                  <assessment.icon size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
                  <p className="text-gray-600">{assessment.description}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveAssessment(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Assessments
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${assessment.color} transition-all duration-300`}
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQ.question}
            </h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, activeAssessment === 'personality' ? option.type : index)}
                  className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  {typeof option === 'string' ? option : option.text}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                disabled={currentQuestion === 0}
                onClick={prevQuestion}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Self Assessment</h1>
        <p className="text-gray-600">Discover your strengths, personality traits, and interests through comprehensive assessments.</p>
      </div>

      {/* Assessment Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {assessments.map((assessment) => {
          const Icon = assessment.icon;
          return (
            <div key={assessment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${assessment.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                {assessment.completed && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle size={20} className="mr-1" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {assessment.category}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{assessment.duration}</span>
                <span>{assessment.questions} questions</span>
              </div>
              
              <button
                onClick={() => setActiveAssessment(assessment.id)}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-all ${
                  assessment.completed
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                }`}
              >
                <Play size={16} className="mr-2" />
                {assessment.completed ? 'Review Results' : 'Start Assessment'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Results Dashboard */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Assessment Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Zap size={20} className="mr-2" />
              <h3 className="font-semibold">Top Strengths</h3>
            </div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Leadership (95%)</li>
              <li>• Creativity (88%)</li>
              <li>• Communication (92%)</li>
              <li>• Empathy (85%)</li>
              <li>• Problem Solving (90%)</li>
            </ul>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Brain size={20} className="mr-2" />
              <h3 className="font-semibold">Personality Type</h3>
            </div>
            <p className="text-sm opacity-90 font-medium">ENFJ - The Protagonist</p>
            <p className="text-xs opacity-75 mt-1">Natural born leaders, full of passion and charisma. Inspiring and motivating others.</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Star size={20} className="mr-2" />
              <h3 className="font-semibold">Core Values</h3>
            </div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Making a Difference</li>
              <li>• Collaboration</li>
              <li>• Innovation</li>
              <li>• Personal Growth</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Strength Categories</h3>
          <div className="space-y-4">
            {[
              { name: 'Leadership', score: 95, color: 'bg-purple-500' },
              { name: 'Communication', score: 92, color: 'bg-blue-500' },
              { name: 'Problem Solving', score: 90, color: 'bg-green-500' },
              { name: 'Creativity', score: 88, color: 'bg-orange-500' },
              { name: 'Empathy', score: 85, color: 'bg-pink-500' }
            ].map((strength, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{strength.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{strength.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interest Areas</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Science & Research', level: 'High' },
              { name: 'Leadership & Management', level: 'Very High' },
              { name: 'Arts & Creativity', level: 'High' },
              { name: 'Technology', level: 'Medium' },
              { name: 'Social Impact', level: 'Very High' },
              { name: 'Public Speaking', level: 'High' }
            ].map((interest, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900">{interest.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  interest.level === 'Very High' ? 'bg-green-100 text-green-600' :
                  interest.level === 'High' ? 'bg-blue-100 text-blue-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {interest.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfAssessment;