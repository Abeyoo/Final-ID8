import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, Paperclip, MoreHorizontal, Sparkles, Brain, Target, Users, Trophy } from 'lucide-react';

interface AIChatProps {
  userProfile?: any;
}

const AIChat: React.FC<AIChatProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hi ${userProfile?.name || 'there'}! I'm your AI assistant here to help you discover your strengths, plan your development, and achieve your goals. What would you like to explore today?`,
      timestamp: new Date(),
      suggestions: [
        'Help me set a new goal',
        'Analyze my strengths',
        'Find team opportunities',
        'Career guidance'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Get help creating SMART goals',
      prompt: 'Help me set a new development goal based on my strengths and interests'
    },
    {
      icon: Brain,
      title: 'Strength Analysis',
      description: 'Analyze your assessment results',
      prompt: 'Can you analyze my strengths and suggest areas for development?'
    },
    {
      icon: Users,
      title: 'Team Matching',
      description: 'Find compatible teammates',
      prompt: 'Help me find teammates that complement my skills and personality'
    },
    {
      icon: Trophy,
      title: 'Opportunities',
      description: 'Discover relevant competitions',
      prompt: 'What competitions or opportunities would be good for someone with my profile?'
    }
  ];

  const generateAIResponse = (userMessage: string) => {
    // Simulate AI thinking time
    setIsTyping(true);
    
    setTimeout(() => {
      let response = '';
      let suggestions = [];

      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('goal') || lowerMessage.includes('objective')) {
        response = `Based on your profile as a ${userProfile?.personalityType || 'Leader'}, I'd recommend setting goals that leverage your natural strengths. Here's a framework for your next goal:

**SMART Goal Template:**
- **Specific**: What exactly do you want to achieve?
- **Measurable**: How will you track progress?
- **Achievable**: Is this realistic given your current skills?
- **Relevant**: Does this align with your interests and values?
- **Time-bound**: When do you want to complete this?

For someone with your leadership qualities, consider goals around:
• Leading a team project or initiative
• Developing public speaking skills
• Mentoring younger students
• Organizing a community service project

Would you like help crafting a specific goal in any of these areas?`;
        
        suggestions = ['Help me create a leadership goal', 'Set a public speaking goal', 'Plan a mentoring initiative'];
      } else if (lowerMessage.includes('strength') || lowerMessage.includes('skill')) {
        response = `Great question! Based on your assessment results, here's your strength profile:

**Your Top Strengths:**
🎯 **Leadership (95%)** - You naturally take charge and inspire others
💬 **Communication (92%)** - You express ideas clearly and persuasively  
🧠 **Problem Solving (90%)** - You excel at finding creative solutions
🎨 **Creativity (88%)** - You think outside the box and generate innovative ideas
❤️ **Empathy (85%)** - You understand and connect with others well

**Development Opportunities:**
• **Delegation** - Learning to trust others with important tasks
• **Active Listening** - Enhancing your ability to truly hear others
• **Patience** - Developing tolerance for different working styles

Your ${userProfile?.personalityType || 'Leader'} personality type means you thrive when you can guide others toward a common vision. Consider roles where you can mentor, organize, or inspire!`;
        
        suggestions = ['How can I improve delegation?', 'Find leadership opportunities', 'Develop my communication skills'];
      } else if (lowerMessage.includes('team') || lowerMessage.includes('collaborate')) {
        response = `Perfect! Team collaboration is one of your strengths. Here's how to find great teammates:

**Look for Complementary Skills:**
• **Analysts** - To balance your big-picture thinking with detail orientation
• **Implementers** - To help execute your creative ideas
• **Specialists** - To bring deep expertise in specific areas

**Based on Your Profile:**
As a ${userProfile?.personalityType || 'Leader'}, you work best with:
• People who appreciate clear direction
• Detail-oriented team members
• Those who value innovation and creativity

**Team Finder Tips:**
1. Use the Team Finder to search by complementary strengths
2. Look for projects that match your interests: ${userProfile?.interests?.slice(0, 3).join(', ') || 'Science, Technology, Leadership'}
3. Consider both leading and supporting roles

Would you like me to help you craft a team search strategy?`;
        
        suggestions = ['Find me analytical teammates', 'Search for creative collaborators', 'Help me lead a team project'];
      } else if (lowerMessage.includes('opportunity') || lowerMessage.includes('competition')) {
        response = `Excellent! Based on your strengths and interests, here are some opportunities that would be perfect for you:

**High-Match Opportunities:**
🏆 **Leadership Competitions**
• Youth Leadership Summit (95% match)
• Student Government Elections
• Model UN Conferences

🔬 **STEM Challenges** 
• Science Fair Competitions (90% match)
• Innovation Challenges
• Robotics Competitions

🎯 **Community Impact Projects**
• Social Entrepreneurship Contests
• Community Service Leadership
• Environmental Action Initiatives

**Why These Match You:**
Your combination of leadership skills, creativity, and ${userProfile?.interests?.includes('science') ? 'scientific interest' : 'diverse interests'} makes you ideal for challenges that require both vision and execution.

**Next Steps:**
1. Check the Opportunities section for application deadlines
2. Start building a team for group competitions
3. Begin preparing your application materials

Which type of opportunity interests you most?`;
        
        suggestions = ['Show me leadership competitions', 'Find STEM challenges', 'Explore community projects'];
      } else {
        response = `I'm here to help you with anything related to your personal development! I can assist with:

• **Goal Setting** - Creating actionable development plans
• **Strength Analysis** - Understanding your unique talents
• **Team Building** - Finding compatible collaborators  
• **Opportunity Discovery** - Matching you with relevant competitions
• **Career Guidance** - Exploring future pathways
• **Study Strategies** - Optimizing your learning approach

What specific area would you like to explore? I'm designed to provide personalized advice based on your unique profile and assessment results.`;
        
        suggestions = ['Help me set goals', 'Analyze my strengths', 'Find opportunities', 'Career advice'];
      }

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: response,
        timestamp: new Date(),
        suggestions
      }]);
      
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Simulate realistic response time
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    generateAIResponse(inputMessage);
    setInputMessage('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 lg:p-8 h-screen flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-gray-600">Your personal development coach powered by AI</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => handleQuickAction(action.prompt)}
              className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={16} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          );
        })}
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                      : 'bg-gradient-to-r from-green-500 to-blue-500'
                  }`}>
                    {message.type === 'user' ? (
                      <span className="text-white font-semibold text-sm">
                        {userProfile?.name ? userProfile.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </span>
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>
                  
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                    
                    <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    
                    {/* AI Suggestions */}
                    {message.type === 'ai' && message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500 font-medium">Suggested follow-ups:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm hover:bg-purple-200 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your development, goals, or opportunities..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <div className="absolute right-3 bottom-3 flex space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip size={16} />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Mic size={16} />
                </button>
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <div className="flex items-center space-x-1">
              <Sparkles size={12} />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;