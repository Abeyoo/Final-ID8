import React, { useState, useEffect } from 'react';
import { Brain, Play, CheckCircle, BarChart3, Lightbulb, Star, Target, Users, Zap, MessageCircle, Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

// Component to display actual strength results
const StrengthResults: React.FC<{ userProfile?: any }> = ({ userProfile }) => {
  const [personalityData, setPersonalityData] = useState<any>(null);
  const [percentileData, setPercentileData] = useState<any>({});

  useEffect(() => {
    if (userProfile?.id) {
      fetchPersonalityData();
      fetchPercentileData();
    }
  }, [userProfile?.id]);

  const fetchPersonalityData = async () => {
    try {
      const response = await fetch(`/api/personality/${userProfile.id}`);
      if (response.ok) {
        const data = await response.json();
        setPersonalityData(data);
      }
    } catch (error) {
      console.error('Failed to fetch personality data:', error);
    }
  };

  const fetchPercentileData = async () => {
    try {
      const response = await fetch(`/api/personality/${userProfile.id}/percentiles`);
      if (response.ok) {
        const data = await response.json();
        setPercentileData(data);
      }
    } catch (error) {
      console.error('Failed to fetch percentile data:', error);
    }
  };

  const personalityInsights = {
    Leader: {
      strengths: ['Takes charge', 'Motivates others', 'Strategic thinking', 'Decision making'],
    },
    Innovator: {
      strengths: ['Innovation', 'Creative thinking', 'Problem solving', 'Vision'],
    },
    Collaborator: {
      strengths: ['Team building', 'Communication', 'Empathy', 'Conflict resolution'],
    },
    Perfectionist: {
      strengths: ['Attention to detail', 'Quality focus', 'Organization', 'Reliability'],
    },
    Explorer: {
      strengths: ['Learning agility', 'Curiosity', 'Research skills', 'Open-mindedness'],
    },
    Mediator: {
      strengths: ['Conflict resolution', 'Diplomacy', 'Understanding', 'Bridge building'],
    },
    Strategist: {
      strengths: ['Strategic planning', 'Pattern analysis', 'Long-term thinking', 'Risk assessment'],
    },
    Anchor: {
      strengths: ['Reliability', 'Stability', 'Support', 'Calm under pressure'],
    }
  };

  const getStrengthsFromAI = () => {
    if (personalityData?.personalityScores) {
      const scores = personalityData.personalityScores;
      
      const aiStrengths = Object.entries(scores).map(([type, score]: [string, any], index: number) => {
        const strengthNames = personalityInsights[type as keyof typeof personalityInsights]?.strengths || [type];
        const primaryStrength = strengthNames[0] || type;
        
        const baseScore = Math.round(score * 100);
        const confidenceMultiplier = personalityData.confidence || 0.8;
        const activityLevel = userProfile?.completedAssessments || 0;
        
        let masteryLevel = baseScore * confidenceMultiplier;
        
        if (activityLevel >= 3) {
          masteryLevel += Math.min(8, activityLevel * 1.5);
        }
        
        const finalProgress = Math.min(95, Math.max(25, Math.round(masteryLevel)));
        
        return {
          name: primaryStrength,
          score: finalProgress,
          aiScore: score,
          color: ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'][index % 5]
        };
      });
      
      return aiStrengths.sort((a, b) => b.aiScore - a.aiScore).slice(0, 5);
    }
    
    // Fallback if no AI data
    return [
      { name: 'Complete assessments', score: 0, color: 'bg-gray-400' },
      { name: 'for personalized', score: 0, color: 'bg-gray-400' },
      { name: 'strength analysis', score: 0, color: 'bg-gray-400' }
    ];
  };

  const strengths = getStrengthsFromAI();

  return (
    <div className="space-y-4">
      {strengths.map((strength, index) => (
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
      {personalityData?.personalityScores && (
        <p className="text-xs text-gray-500 mt-3">
          Based on AI personality analysis • Last updated: {new Date(personalityData.lastUpdated).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

interface SelfAssessmentProps {
  userProfile?: any;
}

const SelfAssessment: React.FC<SelfAssessmentProps> = ({ userProfile }) => {
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'bot' | 'user', message: string}>>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Fetch user's personality data for the profile section
  const { data: personalityData } = useQuery({
    queryKey: ['/api/personality', userProfile?.id],
    enabled: !!userProfile?.id,
  });

  const { data: percentileData } = useQuery({
    queryKey: ['/api/personality', userProfile?.id, 'percentiles'],
    enabled: !!userProfile?.id,
  });

  // Fetch user's assessment completion status
  const { data: completionStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['/api/assessments', userProfile?.id],
    enabled: !!userProfile?.id,
  });

  const assessmentTemplates = [
    {
      id: 'strengths',
      title: 'Strengths Discovery',
      description: 'Identify your top 5 character strengths and natural talents',
      duration: '15 min',
      questions: 25,
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
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      category: 'Leadership'
    }
  ];

  // Combine template data with real completion status
  const assessments = assessmentTemplates.map(template => ({
    ...template,
    completed: completionStatus ? (completionStatus as any)[template.id] || false : false
  }));

  // Chatbot conversation logic
  const chatbotQuestions = [
    "Hi! I'm here to help you discover more about yourself. What activities make you feel most energized and excited?",
    "That's interesting! When you imagine your ideal day, what would you be doing?",
    "What subjects or topics do you find yourself naturally curious about?",
    "Tell me about a time when you felt really proud of something you accomplished.",
    "If you could solve any problem in the world, what would it be?",
    "What kind of environment helps you do your best work - quiet and focused, or collaborative and energetic?",
    "What skills do you most want to develop over the next year?",
    "Thanks for sharing! Based on our conversation, I can see you have some really interesting passions and strengths. Have you considered taking the personality assessment to get even deeper insights?"
  ];

  const initiateChatbot = () => {
    setShowChatbot(true);
    setChatMessages([{
      role: 'bot',
      message: chatbotQuestions[0]
    }]);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    // Add user message
    const newMessages = [...chatMessages, { role: 'user' as const, message: currentInput }];
    setChatMessages(newMessages);
    setCurrentInput('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponseIndex = Math.floor(newMessages.length / 2);
      
      if (botResponseIndex < chatbotQuestions.length) {
        setChatMessages(prev => [...prev, {
          role: 'bot',
          message: chatbotQuestions[botResponseIndex]
        }]);
      } else {
        // End of questions, provide insights
        setChatMessages(prev => [...prev, {
          role: 'bot',
          message: "I've learned a lot about you! Your answers show some fascinating patterns. The formal assessments above can give you even more detailed insights into your personality and strengths. Would you like to try one?"
        }]);
      }
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

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

  const handleAnswer = async (questionIndex: number, answer: any) => {
    const assessment = assessments.find(a => a.id === activeAssessment);
    if (!assessment || !userProfile?.id) return;

    // Save answer locally
    setAnswers(prev => ({
      ...prev,
      [`${activeAssessment}_${questionIndex}`]: answer
    }));

    // Send response to backend for tracking
    try {
      await fetch('/api/assessment/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile.id,
          assessmentType: activeAssessment,
          questionId: `${activeAssessment}_${questionIndex}`,
          response: answer
        })
      });
    } catch (error) {
      console.error('Failed to track assessment response:', error);
    }
  };

  const nextQuestion = async () => {
    const assessment = assessments.find(a => a.id === activeAssessment);
    if (!assessment || !userProfile?.id) return;

    const questions = activeAssessment === 'strengths' ? strengthsQuestions : personalityQuestions;
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete assessment - invalidate cache to update completion status and stats
      setActiveAssessment(null);
      setCurrentQuestion(0);
      
      // Invalidate both assessment completion status and user stats
      queryClient.invalidateQueries({ queryKey: ['/api/assessments', userProfile.id] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userProfile.id}/stats`] });
    }
  };

  const prevQuestion = () => {
    setCurrentQuestion(Math.max(0, currentQuestion - 1));
  };

  // Show loading state while fetching completion status
  if (isLoadingStatus) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Back to Quizzes
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
                  onClick={() => handleAnswer(currentQuestion, activeAssessment === 'personality' ? (option as any).type || index : index)}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Know Yourself</h1>
        <p className="text-gray-600">Discover your strengths, personality traits, and interests through fun, interactive quizzes.</p>
      </div>

      {/* Interactive Chatbot Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Discovery Chat</h3>
                <p className="text-sm text-gray-600">Have a conversation to explore your interests and passions</p>
              </div>
            </div>
            {!showChatbot && (
              <button
                onClick={initiateChatbot}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center"
              >
                <MessageCircle size={16} className="mr-2" />
                Start Chat
              </button>
            )}
          </div>

          {showChatbot && (
            <div className="bg-white rounded-lg border border-gray-200 h-96 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg max-w-xs">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleChatSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !currentInput.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
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
                {assessment.completed ? 'View Results' : 'Start Quiz'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Results Dashboard - Only show if assessments completed */}
      {assessments.some(a => a.completed) && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Personal Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Zap size={20} className="mr-2" />
                <h3 className="font-semibold">Top Strengths</h3>
              </div>
              <ul className="text-sm space-y-1 opacity-90">
                {personalityData?.personalityScores ? 
                  Object.entries(personalityData.personalityScores)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 4)
                    .map(([type, score], index) => (
                      <li key={type}>• {type} ({Math.round((score as number) * 100)}%)</li>
                    ))
                  :
                  [
                    <li key="1">• Complete quizzes to see your strengths</li>,
                    <li key="2">• Take personality assessment first</li>,
                    <li key="3">• Discover your unique traits</li>,
                    <li key="4">• Build your personal profile</li>
                  ]
                }
              </ul>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Brain size={20} className="mr-2" />
                <h3 className="font-semibold">Personality Type</h3>
              </div>
              {personalityData?.personalityType ? (
                <>
                  <p className="text-sm opacity-90 font-medium">{personalityData.personalityType}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {personalityData.personalityType === 'Leader' && 'Natural born leaders, full of passion and charisma. Inspiring and motivating others.'}
                    {personalityData.personalityType === 'Innovator' && 'Creative problem-solvers who love exploring new ideas and possibilities.'}
                    {personalityData.personalityType === 'Collaborator' && 'Team players who excel at bringing people together and building consensus.'}
                    {personalityData.personalityType === 'Perfectionist' && 'Detail-oriented individuals who strive for excellence and high standards.'}
                    {personalityData.personalityType === 'Explorer' && 'Curious learners who love discovering new knowledge and experiences.'}
                    {personalityData.personalityType === 'Mediator' && 'Diplomatic individuals who excel at resolving conflicts and finding common ground.'}
                    {personalityData.personalityType === 'Strategist' && 'Strategic thinkers who excel at long-term planning and pattern recognition.'}
                    {personalityData.personalityType === 'Anchor' && 'Reliable individuals who provide stability and support to their teams.'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm opacity-90 font-medium">Take the personality quiz</p>
                  <p className="text-xs opacity-75 mt-1">Complete the personality assessment to discover your unique type and characteristics.</p>
                </>
              )}
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Star size={20} className="mr-2" />
                <h3 className="font-semibold">Core Values</h3>
              </div>
              <ul className="text-sm space-y-1 opacity-90">
                {userProfile?.initialInterests && userProfile.initialInterests.length > 0 ? 
                  userProfile.initialInterests.slice(0, 4).map((interest: string, index: number) => (
                    <li key={index}>• {interest}</li>
                  ))
                  :
                  [
                    <li key="1">• Complete your profile setup</li>,
                    <li key="2">• Add your interests during signup</li>,
                    <li key="3">• Set goals to discover values</li>,
                    <li key="4">• Take assessments to learn more</li>
                  ]
                }
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Results - Only show if assessments completed */}
      {assessments.some(a => a.completed) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Strength Categories</h3>
            <StrengthResults userProfile={userProfile} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interest Areas</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Science & Research', level: 'High' },
                { name: 'Technology & Programming', level: 'Medium' },
                { name: 'Arts & Creativity', level: 'High' },
                { name: 'Leadership & Management', level: 'Very High' },
                { name: 'Sports & Athletics', level: 'Medium' },
                { name: 'Community Service', level: 'Very High' },
                { name: 'Business & Finance', level: 'Medium' },
                { name: 'Environment & Sustainability', level: 'High' },
                { name: 'Social Sciences', level: 'High' }
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
      )}

      {/* No Results Message - Show when no assessments completed */}
      {!assessments.some(a => a.completed) && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Brain size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Discover Yourself?</h3>
          <p className="text-gray-600 mb-4">
            Take your first quiz to uncover your unique strengths, personality traits, and interests.
          </p>
          <div className="text-sm text-gray-500">
            Choose any quiz above to start your journey of self-discovery.
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfAssessment;