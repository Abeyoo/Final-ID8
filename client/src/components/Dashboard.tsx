import React from 'react';
import { TrendingUp, Target, Users, Trophy, Calendar, BookOpen, Star, Zap, Brain } from 'lucide-react';

interface DashboardProps {
  userProfile?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const stats = [
    { label: 'Completed Assessments', value: '5', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
    { label: 'Active Goals', value: '8', icon: Target, color: 'from-blue-500 to-blue-600' },
    { label: 'Team Projects', value: '3', icon: Users, color: 'from-green-500 to-green-600' },
    { label: 'Achievements', value: '12', icon: Trophy, color: 'from-orange-500 to-orange-600' },
  ];

  const recentActivities = [
    { action: 'Completed Personality Assessment', time: '2 hours ago', type: 'assessment' },
    { action: 'Joined Robotics Team', time: '1 day ago', type: 'team' },
    { action: 'Earned Leadership Badge', time: '3 days ago', type: 'achievement' },
    { action: 'Set new goal: Public Speaking', time: '1 week ago', type: 'goal' },
    { action: 'Connected with mentor Sarah Chen', time: '1 week ago', type: 'community' },
  ];

  const strengthsProgress = [
    { name: 'Leadership', progress: 95, color: 'bg-purple-500' },
    { name: 'Communication', progress: 92, color: 'bg-blue-500' },
    { name: 'Problem Solving', progress: 90, color: 'bg-green-500' },
    { name: 'Creativity', progress: 88, color: 'bg-orange-500' },
    { name: 'Empathy', progress: 85, color: 'bg-pink-500' },
  ];

  const upcomingDeadlines = [
    { title: 'Science Fair Project', date: '2024-03-15', type: 'project', priority: 'high' },
    { title: 'Leadership Workshop Application', date: '2024-04-01', type: 'opportunity', priority: 'medium' },
    { title: 'Team Meeting - Drama Club', date: '2024-02-25', type: 'meeting', priority: 'low' },
  ];

  const personalityInsight = {
    type: userProfile?.personalityType || 'Leader',
    description: 'Natural born leader who takes initiative and inspires others',
    strengths: ['Takes charge', 'Motivates others', 'Strategic thinking'],
    growthAreas: ['Delegation', 'Patience', 'Active listening']
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {userProfile?.name || 'John'}! 👋
        </h1>
        <p className="text-gray-600">Here's your progress overview and personalized insights.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Personality Insight */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center mb-4">
            <Brain size={24} className="mr-3" />
            <h2 className="text-xl font-semibold">Your Personality</h2>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">{personalityInsight.type}</h3>
            <p className="text-sm opacity-90 mb-3">{personalityInsight.description}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <h4 className="font-semibold mb-1">Strengths:</h4>
                <ul className="space-y-1 opacity-80">
                  {personalityInsight.strengths.map((strength, i) => (
                    <li key={i}>• {strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Growth Areas:</h4>
                <ul className="space-y-1 opacity-80">
                  {personalityInsight.growthAreas.map((area, i) => (
                    <li key={i}>• {area}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Top Strengths */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Top Strengths</h2>
            <Zap size={20} className="text-yellow-500" />
          </div>
          <div className="space-y-4">
            {strengthsProgress.slice(0, 3).map((strength, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{strength.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{strength.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${strength.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Deadlines</h2>
            <Calendar size={20} className="text-blue-500" />
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{deadline.title}</h3>
                  <p className="text-xs text-gray-500">{new Date(deadline.date).toLocaleDateString()}</p>
                </div>
                <span className={`w-3 h-3 rounded-full ${
                  deadline.priority === 'high' ? 'bg-red-500' :
                  deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'assessment' ? 'bg-purple-500' :
                  activity.type === 'team' ? 'bg-blue-500' :
                  activity.type === 'achievement' ? 'bg-green-500' :
                  activity.type === 'goal' ? 'bg-orange-500' : 'bg-pink-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
            <Star size={20} className="text-yellow-500" />
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Complete Values Assessment</h3>
              <p className="text-sm text-purple-700 mb-3">Discover what matters most to you and align your goals accordingly.</p>
              <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                Start Assessment →
              </button>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Join Math Olympiad Team</h3>
              <p className="text-sm text-blue-700 mb-3">Based on your analytical thinking strength, this team is a perfect match.</p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                View Team →
              </button>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Leadership Workshop</h3>
              <p className="text-sm text-green-700 mb-3">Enhance your natural leadership abilities with advanced techniques.</p>
              <button className="text-green-600 text-sm font-medium hover:text-green-700">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-white bg-opacity-20 rounded-lg p-4 text-left hover:bg-opacity-30 transition-all">
            <Brain size={24} className="mb-2" />
            <h3 className="font-semibold mb-2">Take Assessment</h3>
            <p className="text-sm opacity-90">Discover new insights</p>
          </button>
          <button className="bg-white bg-opacity-20 rounded-lg p-4 text-left hover:bg-opacity-30 transition-all">
            <Users size={24} className="mb-2" />
            <h3 className="font-semibold mb-2">Find Teammates</h3>
            <p className="text-sm opacity-90">Connect with peers</p>
          </button>
          <button className="bg-white bg-opacity-20 rounded-lg p-4 text-left hover:bg-opacity-30 transition-all">
            <Target size={24} className="mb-2" />
            <h3 className="font-semibold mb-2">Set New Goal</h3>
            <p className="text-sm opacity-90">Plan your development</p>
          </button>
          <button className="bg-white bg-opacity-20 rounded-lg p-4 text-left hover:bg-opacity-30 transition-all">
            <Trophy size={24} className="mb-2" />
            <h3 className="font-semibold mb-2">Browse Opportunities</h3>
            <p className="text-sm opacity-90">Find competitions</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;