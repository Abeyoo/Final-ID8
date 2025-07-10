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

  const generateAIResponse = async (userMessage: string) => {
    // Set typing indicator
    setIsTyping(true);
    
    try {
      // Call the AI chat API to get a personalized response
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userProfile: userProfile
        })
      });

      if (!response.ok) {
        throw new Error('AI response failed');
      }

      const data = await response.json();
      
      // Add AI response to messages
      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions || []
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
    } catch (error) {
      console.error('AI response error:', error);
      
      // Fallback response
      const fallbackResponse = {
        id: Date.now(),
        type: 'ai',
        content: `I apologize, but I'm having trouble processing your request right now. Here are some things I can help you with:

• **Goal Setting**: Help you create SMART goals based on your personality and interests
• **Strength Analysis**: Analyze your assessment results and personality insights
• **Team Matching**: Find compatible teammates and collaboration opportunities
• **Opportunity Discovery**: Suggest competitions and programs that match your profile

What would you like to explore?`,
        timestamp: new Date(),
        suggestions: ['Help me set goals', 'Analyze my strengths', 'Find opportunities', 'Team recommendations']
      };

      setMessages(prev => [...prev, fallbackResponse]);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    await generateAIResponse(inputMessage);
    setInputMessage('');
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setInputMessage(suggestion);
    await handleSendMessage();
  };

  const handleQuickAction = async (prompt: string) => {
    setInputMessage(prompt);
    setTimeout(async () => await handleSendMessage(), 100);
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