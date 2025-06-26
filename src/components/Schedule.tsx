import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle, AlertCircle, Users } from 'lucide-react';

const Schedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  const events = [
    {
      id: 1,
      title: 'Science Fair Team Meeting',
      type: 'team',
      time: '3:30 PM - 4:30 PM',
      date: '2024-02-20',
      description: 'Weekly progress review and task assignment',
      priority: 'high',
      completed: false
    },
    {
      id: 2,
      title: 'Public Speaking Practice',
      type: 'personal',
      time: '7:00 PM - 8:00 PM',
      date: '2024-02-20',
      description: 'Practice presentation for Toastmasters',
      priority: 'medium',
      completed: false
    },
    {
      id: 3,
      title: 'Math Olympiad Training',
      type: 'study',
      time: '2:00 PM - 4:00 PM',
      date: '2024-02-21',
      description: 'Advanced problem solving session',
      priority: 'high',
      completed: false
    },
    {
      id: 4,
      title: 'Leadership Assessment Review',
      type: 'assessment',
      time: '6:00 PM - 6:30 PM',
      date: '2024-02-21',
      description: 'Review results and plan next steps',
      priority: 'medium',
      completed: true
    },
    {
      id: 5,
      title: 'Drama Club Rehearsal',
      type: 'team',
      time: '4:00 PM - 6:00 PM',
      date: '2024-02-22',
      description: 'Act 2 scene rehearsal',
      priority: 'high',
      completed: false
    }
  ];

  const tasks = [
    {
      id: 1,
      title: 'Complete Excel Tutorial Module 3',
      dueDate: '2024-02-20',
      priority: 'high',
      category: 'Learning',
      completed: false,
      estimatedTime: '2 hours'
    },
    {
      id: 2,
      title: 'Write reflection essay for leadership goal',
      dueDate: '2024-02-21',
      priority: 'medium',
      category: 'Development',
      completed: false,
      estimatedTime: '1 hour'
    },
    {
      id: 3,
      title: 'Research solar panel efficiency data',
      dueDate: '2024-02-22',
      priority: 'high',
      category: 'Team Project',
      completed: false,
      estimatedTime: '3 hours'
    },
    {
      id: 4,
      title: 'Schedule mentorship meeting',
      dueDate: '2024-02-20',
      priority: 'low',
      category: 'Personal',
      completed: true,
      estimatedTime: '15 minutes'
    }
  ];

  const upcomingDeadlines = [
    {
      title: 'Science Fair Project Proposal',
      date: '2024-03-15',
      daysLeft: 24,
      type: 'project'
    },
    {
      title: 'Leadership Workshop Application',
      date: '2024-04-01',
      daysLeft: 41,
      type: 'opportunity'
    },
    {
      title: 'Public Speaking Goal Review',
      date: '2024-06-15',
      daysLeft: 116,
      type: 'goal'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'team': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'personal': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'study': return 'bg-green-100 text-green-600 border-green-200';
      case 'assessment': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const todaysEvents = events.filter(event => 
    new Date(event.date).toDateString() === selectedDate.toDateString()
  );

  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule</h1>
          <p className="text-gray-600">Manage your time and stay on top of your commitments.</p>
        </div>
        <button
          onClick={() => setShowNewTaskForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} className="mr-2" />
          Add Task
        </button>
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ←
            </button>
            <span className="font-medium text-gray-900">{formatDate(selectedDate)}</span>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {todaysEvents.length > 0 ? (
          <div className="space-y-3">
            {todaysEvents.map((event) => (
              <div key={event.id} className={`p-4 rounded-lg border ${getEventTypeColor(event.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      <span className={`text-xs font-medium ${getPriorityColor(event.priority)}`}>
                        {event.priority} priority
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{event.time}</span>
                      </div>
                      {event.type === 'team' && (
                        <div className="flex items-center">
                          <Users size={14} className="mr-1" />
                          <span>Team Event</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm mt-2">{event.description}</p>
                  </div>
                  <button className={`p-2 rounded ${event.completed ? 'text-green-600' : 'text-gray-400'} hover:bg-white hover:bg-opacity-50 transition-colors`}>
                    <CheckCircle size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>No events scheduled for this day</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Tasks</h2>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <button className="mt-1 text-gray-400 hover:text-green-600 transition-colors">
                      <CheckCircle size={16} />
                    </button>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{task.category}</span>
                        <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                        <span>{task.estimatedTime}</span>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Deadlines</h2>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{deadline.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(deadline.date).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-2 inline-block">
                      {deadline.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      deadline.daysLeft <= 7 ? 'text-red-600' :
                      deadline.daysLeft <= 30 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {deadline.daysLeft} days
                    </div>
                    {deadline.daysLeft <= 7 && (
                      <AlertCircle size={16} className="text-red-500 mt-1" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Task Form Modal */}
      {showNewTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Task</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>Learning</option>
                  <option>Development</option>
                  <option>Team Project</option>
                  <option>Personal</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., 2 hours"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTaskForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => setShowNewTaskForm(false)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;