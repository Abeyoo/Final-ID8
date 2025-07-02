import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Zap, Clock, Target, Users } from 'lucide-react';

interface PersonalityInsightsProps {
  userId: number;
}

interface PersonalityData {
  personalityType: string;
  personalityScores: Record<string, number>;
  lastUpdated: string;
  confidence?: number;
  reasoning?: string;
}

interface PercentileData {
  [personalityType: string]: {
    percentile: number;
    scoreHistory: Array<{
      score: number;
      percentile: number;
      timestamp: string;
    }>;
    lastCalculated: string;
  };
}

const PersonalityInsights: React.FC<PersonalityInsightsProps> = ({ userId }) => {
  const [personalityData, setPersonalityData] = useState<PersonalityData | null>(null);
  const [percentileData, setPercentileData] = useState<PercentileData>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchPersonalityData();
    fetchPercentileData();
  }, [userId]);

  const fetchPersonalityData = async () => {
    try {
      const response = await fetch(`/api/personality/${userId}`);
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
      const response = await fetch(`/api/personality/${userId}/percentiles`);
      if (response.ok) {
        const data = await response.json();
        setPercentileData(data);
      }
    } catch (error) {
      console.error('Failed to fetch percentile data:', error);
    }
  };

  const triggerAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`/api/personality/analyze/${userId}`, {
        method: 'POST'
      });
      if (response.ok) {
        const analysisResult = await response.json();
        console.log('Manual analysis completed:', analysisResult);
        await fetchPersonalityData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to trigger analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const personalityDescriptions = {
    Leader: {
      description: 'Natural born leader who takes initiative and inspires others to achieve common goals',
      color: 'from-red-500 to-orange-500',
      icon: Target
    },
    Innovator: {
      description: 'Creative visionary who brings fresh perspectives and generates original solutions',
      color: 'from-purple-500 to-pink-500',
      icon: Zap
    },
    Collaborator: {
      description: 'Team-oriented individual who builds bridges and fosters positive relationships',
      color: 'from-blue-500 to-cyan-500',
      icon: Users
    },
    Perfectionist: {
      description: 'Detail-oriented achiever who maintains high standards and ensures quality results',
      color: 'from-green-500 to-emerald-500',
      icon: Target
    },
    Explorer: {
      description: 'Curious learner who seeks new experiences and knowledge across diverse domains',
      color: 'from-yellow-500 to-orange-500',
      icon: TrendingUp
    },
    Mediator: {
      description: 'Diplomatic peacemaker who helps others find common ground and resolve differences',
      color: 'from-indigo-500 to-purple-500',
      icon: Users
    }
  };

  if (!personalityData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const currentPersonality = personalityDescriptions[personalityData.personalityType as keyof typeof personalityDescriptions];
  const Icon = currentPersonality?.icon || Brain;

  return (
    <div className="space-y-6">
      {/* Main Personality Card */}
      <div className={`bg-gradient-to-r ${currentPersonality?.color || 'from-gray-500 to-gray-600'} rounded-xl p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon size={28} className="mr-3" />
            <h2 className="text-2xl font-bold">Your Personality Profile</h2>
          </div>
          <button
            onClick={triggerAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Update Analysis'}
          </button>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <h3 className="font-bold text-xl mb-2">{personalityData.personalityType}</h3>
          <p className="text-sm opacity-90 mb-4">{currentPersonality?.description}</p>
          
          <div className="flex items-center text-sm opacity-75">
            <Clock size={16} className="mr-2" />
            <span>Last updated: {new Date(personalityData.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Personality Scores Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Brain size={20} className="text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Personality Breakdown</h3>
        </div>
        
        <div className="space-y-4">
          {personalityData.personalityScores && Object.entries(personalityData.personalityScores).map(([type, score]) => {
            const typeInfo = personalityDescriptions[type as keyof typeof personalityDescriptions];
            const percentage = Math.round((score as number) * 100);
            const percentileInfo = percentileData[type];
            
            return (
              <div key={type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{type}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                    {percentileInfo && (
                      <div className="text-xs text-gray-500">
                        {percentileInfo.percentile}th percentile
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${typeInfo?.color || 'from-gray-400 to-gray-500'} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {percentileInfo && (
                  <div className="text-xs text-gray-500">
                    You score higher than {percentileInfo.percentile}% of students
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Analysis Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <TrendingUp size={20} className="text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI Analysis Insights</h3>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">How Your Personality is Determined</h4>
          <p className="text-blue-800 text-sm mb-3">
            Your personality profile is continuously updated based on:
          </p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Assessment responses and patterns</li>
            <li>• Goal creation and completion behavior</li>
            <li>• Team collaboration and leadership actions</li>
            <li>• Achievement patterns and types</li>
            <li>• Learning preferences and choices</li>
          </ul>
        </div>
        
        {personalityData.confidence && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Analysis Confidence</span>
              <span className="text-sm font-bold text-green-900">
                {Math.round(personalityData.confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${personalityData.confidence * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalityInsights;