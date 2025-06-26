import React, { useState } from 'react';
import { Target, Plus, CheckCircle, Clock, TrendingUp, BookOpen, X } from 'lucide-react';

const DevelopmentPlans: React.FC = () => {
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoalForm, setNewGoalForm] = useState({
    title: '',
    description: '',
    category: 'Communication',
    deadline: '',
    milestones: ['', '', '', '']
  });

  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Improve Public Speaking',
      description: 'Build confidence and skills in public speaking and presentations',
      category: 'Communication',
      progress: 75,
      deadline: '2024-06-15',
      status: 'active',
      milestones: [
        { title: 'Join Toastmasters Club', completed: true },
        { title: 'Give first prepared speech', completed: true },
        { title: 'Practice impromptu speaking', completed: true },
        { title: 'Present at school assembly', completed: false },
      ]
    },
    {
      id: 2,
      title: 'Develop Leadership Skills',
      description: 'Take on leadership roles and learn team management',
      category: 'Leadership',
      progress: 50,
      deadline: '2024-08-30',
      status: 'active',
      milestones: [
        { title: 'Complete leadership assessment', completed: true },
        { title: 'Lead a student project', completed: true },
        { title: 'Attend leadership workshop', completed: false },
        { title: 'Mentor younger students', completed: false },
      ]
    },
    {
      id: 3,
      title: 'Learn Data Analysis',
      description: 'Master Excel, basic statistics, and data visualization',
      category: 'Technical',
      progress: 30,
      deadline: '2024-12-01',
      status: 'active',
      milestones: [
        { title: 'Complete Excel basics course', completed: true },
        { title: 'Learn pivot tables and charts', completed: false },
        { title: 'Study basic statistics', completed: false },
        { title: 'Create data visualization project', completed: false },
      ]
    }
  ]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGoalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMilestoneChange = (index: number, value: string) => {
    setNewGoalForm(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => i === index ? value : milestone)
    }));
  };

  const toggleMilestone = (goalId: number, milestoneIndex: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map((milestone, index) => 
          index === milestoneIndex 
            ? { ...milestone, completed: !milestone.completed }
            : milestone
        );
        
        // Calculate new progress based on completed milestones
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        
        return {
          ...goal,
          milestones: updatedMilestones,
          progress: progress
        };
      }
      return goal;
    }));
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGoalForm.title.trim() || !newGoalForm.description.trim() || !newGoalForm.deadline) {
      return; // Basic validation
    }

    // Filter out empty milestones and create milestone objects
    const milestones = newGoalForm.milestones
      .filter(milestone => milestone.trim() !== '')
      .map(milestone => ({ title: milestone.trim(), completed: false }));

    // If no custom milestones, add default ones
    if (milestones.length === 0) {
      milestones.push(
        { title: 'Get started', completed: false },
        { title: 'Mid-way checkpoint', completed: false },
        { title: 'Final review', completed: false },
        { title: 'Complete goal', completed: false }
      );
    }

    const newGoal = {
      id: goals.length + 1,
      title: newGoalForm.title,
      description: newGoalForm.description,
      category: newGoalForm.category,
      progress: 0,
      deadline: newGoalForm.deadline,
      status: 'active' as const,
      milestones: milestones
    };

    setGoals(prev => [...prev, newGoal]);
    setNewGoalForm({
      title: '',
      description: '',
      category: 'Communication',
      deadline: '',
      milestones: ['', '', '', '']
    });
    setShowNewGoalForm(false);
  };

  const resources = [
    {
      title: 'Public Speaking Masterclass',
      type: 'Course',
      duration: '4 weeks',
      provider: 'SkillShare',
      rating: 4.8
    },
    {
      title: 'The Leader in Me',
      type: 'Book',
      duration: '8 hours',
      provider: 'Stephen Covey',
      rating: 4.7
    },
    {
      title: 'Data Analysis with Excel',
      type: 'Tutorial',
      duration: '12 hours',
      provider: 'Khan Academy',
      rating: 4.9
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Development Plans</h1>
          <p className="text-gray-600">Track your personal growth goals and milestones.</p>
        </div>
        <button
          onClick={() => setShowNewGoalForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} className="mr-2" />
          New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Target size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    {goal.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-gray-500">
                <Clock size={16} className="mr-1" />
                <span className="text-sm">{new Date(goal.deadline).toLocaleDateString()}</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-semibold text-gray-900">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
            
            {/* Milestones */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones</h4>
              <div className="space-y-2">
                {goal.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleMilestone(goal.id, index)}
                      className="hover:scale-110 transition-transform"
                    >
                      <CheckCircle
                        size={16}
                        className={milestone.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}
                      />
                    </button>
                    <span className={`text-sm ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Resources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <BookOpen size={20} className="text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recommended Resources</h2>
          </div>
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{resource.title}</h3>
                    <p className="text-sm text-gray-600">{resource.provider}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">{resource.type}</span>
                      <span>{resource.duration}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{resource.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <TrendingUp size={20} className="text-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Progress Analytics</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Goals by Category</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Communication</span>
                  <span className="text-sm font-semibold">1 goal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Leadership</span>
                  <span className="text-sm font-semibold">1 goal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Technical</span>
                  <span className="text-sm font-semibold">1 goal</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Completion Rate</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-semibold">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '67%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Goal Form Modal */}
      {showNewGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 z-50">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create New Goal</h2>
              <button
                onClick={() => setShowNewGoalForm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                <input
                  type="text"
                  name="title"
                  value={newGoalForm.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your goal"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newGoalForm.description}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                  placeholder="Describe your goal"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  name="category"
                  value={newGoalForm.category}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Communication">Communication</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Technical">Technical</option>
                  <option value="Creative">Creative</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={newGoalForm.deadline}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Milestones (Optional)</label>
                <div className="space-y-2">
                  {newGoalForm.milestones.map((milestone, index) => (
                    <input
                      key={index}
                      type="text"
                      value={milestone}
                      onChange={(e) => handleMilestoneChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder={`Milestone ${index + 1}`}
                    />
                  ))}
                  <p className="text-xs text-gray-500">Leave empty for default milestones. Only filled milestones will be added.</p>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewGoalForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevelopmentPlans;