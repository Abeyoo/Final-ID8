import React from 'react';
import { Award, Trophy, Star, Medal, Target, TrendingUp } from 'lucide-react';

const Achievements: React.FC = () => {
  const badges = [
    {
      id: 1,
      name: 'First Assessment',
      description: 'Completed your first self-assessment',
      icon: Star,
      earned: true,
      earnedDate: '2024-01-15',
      category: 'Getting Started',
      rarity: 'common'
    },
    {
      id: 2,
      name: 'Goal Setter',
      description: 'Created your first development goal',
      icon: Target,
      earned: true,
      earnedDate: '2024-01-20',
      category: 'Planning',
      rarity: 'common'
    },
    {
      id: 3,
      name: 'Team Player',
      description: 'Joined your first team collaboration',
      icon: Award,
      earned: true,
      earnedDate: '2024-02-01',
      category: 'Collaboration',
      rarity: 'common'
    },
    {
      id: 4,
      name: 'Communication Master',
      description: 'Achieved 90% progress in communication skills',
      icon: Medal,
      earned: true,
      earnedDate: '2024-02-15',
      category: 'Skills',
      rarity: 'rare'
    },
    {
      id: 5,
      name: 'Leadership Champion',
      description: 'Led a team project to successful completion',
      icon: Trophy,
      earned: false,
      earnedDate: null,
      category: 'Leadership',
      rarity: 'epic'
    },
    {
      id: 6,
      name: 'Strength Explorer',
      description: 'Completed all available self-assessments',
      icon: Star,
      earned: false,
      earnedDate: null,
      category: 'Discovery',
      rarity: 'rare'
    },
    {
      id: 7,
      name: 'Mentor',
      description: 'Helped 5 peers with their development goals',
      icon: Award,
      earned: false,
      earnedDate: null,
      category: 'Community',
      rarity: 'epic'
    },
    {
      id: 8,
      name: 'Consistent Achiever',
      description: 'Completed goals for 3 consecutive months',
      icon: TrendingUp,
      earned: false,
      earnedDate: null,
      category: 'Consistency',
      rarity: 'legendary'
    }
  ];

  const milestones = [
    {
      title: 'First Month Complete',
      description: 'Successfully completed your first month of development',
      progress: 100,
      completed: true,
      completedDate: '2024-02-15'
    },
    {
      title: 'Team Leader',
      description: 'Lead a team project from start to finish',
      progress: 75,
      completed: false,
      completedDate: null
    },
    {
      title: 'Skill Master',
      description: 'Reach 90% proficiency in 5 different skills',
      progress: 60,
      completed: false,
      completedDate: null
    },
    {
      title: 'Community Champion',
      description: 'Actively participate in community for 6 months',
      progress: 33,
      completed: false,
      completedDate: null
    }
  ];

  const stats = [
    { label: 'Total Badges', value: badges.filter(b => b.earned).length, total: badges.length, icon: Award },
    { label: 'Goals Completed', value: 12, total: 15, icon: Target },
    { label: 'Teams Joined', value: 3, total: null, icon: Trophy },
    { label: 'Days Active', value: 45, total: null, icon: TrendingUp }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-yellow-400 to-yellow-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p className="text-gray-600">Track your progress and celebrate your accomplishments.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Icon size={24} className="text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}{stat.total && `/${stat.total}`}
                  </div>
                </div>
              </div>
              <h3 className="font-medium text-gray-900">{stat.label}</h3>
              {stat.total && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${(stat.value / stat.total) * 100}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Badges */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Badges</h2>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    badge.earned
                      ? `${getRarityBorder(badge.rarity)} bg-gradient-to-br ${getRarityColor(badge.rarity)} bg-opacity-10`
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                    badge.earned
                      ? `bg-gradient-to-r ${getRarityColor(badge.rarity)}`
                      : 'bg-gray-300'
                  }`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                    {badge.name}
                  </h3>
                  <p className={`text-xs ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                    {badge.description}
                  </p>
                  {badge.earned && badge.earnedDate && (
                    <p className="text-xs text-gray-500 mt-2">
                      Earned {new Date(badge.earnedDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded ${
                    badge.rarity === 'common' ? 'bg-gray-100 text-gray-600' :
                    badge.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                    badge.rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {badge.rarity}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Milestones</h2>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {milestone.completed ? (
                      <Trophy size={20} className="text-white" />
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${milestone.completed ? 'text-gray-900' : 'text-gray-700'}`}>
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                    
                    {!milestone.completed && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs font-semibold text-gray-700">{milestone.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: `${milestone.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {milestone.completed && milestone.completedDate && (
                      <p className="text-xs text-green-600 font-medium">
                        Completed {new Date(milestone.completedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                {index < milestones.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-8 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
        <div className="space-y-3">
          {badges.filter(b => b.earned).slice(-3).map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.id} className="flex items-center space-x-3 bg-white bg-opacity-20 rounded-lg p-3">
                <div className="w-10 h-10 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                  <Icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{badge.name}</h3>
                  <p className="text-sm opacity-90">{badge.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">
                    {badge.earnedDate && new Date(badge.earnedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;