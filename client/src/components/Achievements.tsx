import React from 'react';
import { Award, Trophy, Star, Medal, Target, TrendingUp, BookOpen, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';

const Achievements: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch user achievements
  const { data: achievementsData, isLoading: isAchievementsLoading } = useQuery({
    queryKey: [`/api/achievements/${user?.id}`],
    enabled: !!user?.id,
  });

  const getAchievementIcon = (achievementId: string) => {
    switch (achievementId) {
      case 'first_assessment': return Star;
      case 'goal_setter': return Target;
      case 'team_player': return Users;
      case 'goal_achiever': return Trophy;
      case 'assessment_master': return BookOpen;
      case 'goal_champion': return Medal;
      case 'team_leader': return Award;
      case 'consistent_achiever': return TrendingUp;
      default: return Star;
    }
  };

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

  if (isAchievementsLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">Loading your accomplishments...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const badges = achievementsData?.achievements || [];
  const stats = achievementsData?.stats || { totalBadges: 0, completedGoals: 0, teamsJoined: 0, totalAchievements: 0 };

  // Calculate milestones based on actual progress
  const milestones = [
    {
      title: 'Getting Started',
      description: 'Complete your first assessment and create a goal',
      progress: Math.min(100, ((stats.totalBadges >= 2 ? 1 : stats.totalBadges / 2) * 100)),
      completed: stats.totalBadges >= 2,
      completedDate: stats.totalBadges >= 2 ? badges.find(b => b.earned)?.earnedDate : null
    },
    {
      title: 'Active Learner',
      description: 'Complete 3 assessments and 2 goals',
      progress: Math.min(100, ((stats.completedGoals + Math.min(stats.totalBadges, 3)) / 5) * 100),
      completed: stats.completedGoals >= 2 && stats.totalBadges >= 3,
      completedDate: null
    },
    {
      title: 'Team Collaborator',
      description: 'Join teams and complete collaborative projects',
      progress: Math.min(100, (stats.teamsJoined / 3) * 100),
      completed: stats.teamsJoined >= 3,
      completedDate: null
    },
    {
      title: 'Achievement Master',
      description: 'Earn multiple rare and epic achievements',
      progress: Math.min(100, (stats.totalAchievements / 8) * 100),
      completed: stats.totalAchievements >= 8,
      completedDate: null
    }
  ];

  const achievementStats = [
    { label: 'Total Badges', value: stats.totalBadges, total: badges.length, icon: Award },
    { label: 'Goals Completed', value: stats.completedGoals, total: null, icon: Target },
    { label: 'Teams Joined', value: stats.teamsJoined, total: null, icon: Users },
    { label: 'Total Achievements', value: stats.totalAchievements, total: null, icon: TrendingUp }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p className="text-gray-600">Track your progress and celebrate your accomplishments.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {achievementStats.map((stat, index) => {
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
              const Icon = getAchievementIcon(badge.id);
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
                          <span className="text-xs font-semibold text-gray-700">{Math.round(milestone.progress)}%</span>
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
            const Icon = getAchievementIcon(badge.id);
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
          {badges.filter(b => b.earned).length === 0 && (
            <div className="text-center py-4">
              <p className="text-white opacity-75">No achievements yet. Start by completing assessments and creating goals!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievements;