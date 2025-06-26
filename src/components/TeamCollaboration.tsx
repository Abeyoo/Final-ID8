import React, { useState } from 'react';
import { Users, Plus, Calendar, MessageSquare, FileText, CheckCircle } from 'lucide-react';

const TeamCollaboration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teams' | 'projects'>('teams');

  const teams = [
    {
      id: 1,
      name: 'Science Fair Team',
      description: 'Working on renewable energy project for the annual science fair',
      members: 4,
      role: 'Team Leader',
      progress: 75,
      deadline: '2024-05-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Drama Club Production',
      description: 'Organizing and performing in the spring theater production',
      members: 12,
      role: 'Stage Manager',
      progress: 45,
      deadline: '2024-06-20',
      status: 'active'
    },
    {
      id: 3,
      name: 'Math Olympiad Squad',
      description: 'Preparing for regional and national math competitions',
      members: 6,
      role: 'Member',
      progress: 60,
      deadline: '2024-04-30',
      status: 'active'
    }
  ];

  const projects = [
    {
      id: 1,
      title: 'Solar Panel Efficiency Study',
      team: 'Science Fair Team',
      tasks: [
        { title: 'Research current technologies', completed: true, assignee: 'John' },
        { title: 'Build test apparatus', completed: true, assignee: 'Sarah' },
        { title: 'Collect data samples', completed: false, assignee: 'Mike' },
        { title: 'Analyze results', completed: false, assignee: 'Lisa' },
        { title: 'Prepare presentation', completed: false, assignee: 'John' },
      ],
      deadline: '2024-05-15',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Romeo and Juliet Production',
      team: 'Drama Club Production',
      tasks: [
        { title: 'Cast selection', completed: true, assignee: 'Director' },
        { title: 'Set design', completed: true, assignee: 'Art Team' },
        { title: 'Rehearsal scheduling', completed: false, assignee: 'John' },
        { title: 'Costume preparation', completed: false, assignee: 'Costume Team' },
        { title: 'Lighting setup', completed: false, assignee: 'Tech Team' },
      ],
      deadline: '2024-06-20',
      priority: 'medium'
    }
  ];

  const availableTeams = [
    {
      name: 'Robotics Club',
      description: 'Building autonomous robots for competition',
      members: 8,
      skills: ['Programming', 'Engineering', 'Problem Solving']
    },
    {
      name: 'Debate Team',
      description: 'Competitive debate and public speaking',
      members: 10,
      skills: ['Communication', 'Research', 'Critical Thinking']
    },
    {
      name: 'Environmental Club',
      description: 'Sustainability projects and environmental awareness',
      members: 15,
      skills: ['Project Management', 'Research', 'Community Outreach']
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Collaboration</h1>
          <p className="text-gray-600">Connect with teammates and manage group projects effectively.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
          <Plus size={20} className="mr-2" />
          Create Team
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'teams'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Teams
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'projects'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Projects
        </button>
      </div>

      {activeTab === 'teams' ? (
        <div className="space-y-8">
          {/* My Teams */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Teams</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teams.map((team) => (
                <div key={team.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Users size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{team.name}</h3>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {team.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users size={16} className="mr-1" />
                      <span className="text-sm">{team.members}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{team.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-semibold text-gray-900">{team.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${team.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500">
                      <Calendar size={16} className="mr-1" />
                      <span className="text-sm">Due {new Date(team.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <MessageSquare size={16} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <FileText size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Teams */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Join New Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTeams.map((team, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{team.name}</h3>
                      <div className="flex items-center text-gray-500">
                        <Users size={14} className="mr-1" />
                        <span className="text-sm">{team.members} members</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{team.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Needed</h4>
                    <div className="flex flex-wrap gap-1">
                      {team.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                    Request to Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Projects */}
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{project.team}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.priority === 'high' ? 'bg-red-100 text-red-600' :
                      project.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {project.priority} priority
                    </span>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Tasks</h4>
                {project.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle
                      size={16}
                      className={task.completed ? 'text-green-500' : 'text-gray-300'}
                    />
                    <span className={`flex-1 text-sm ${task.completed ? 'text-gray-900 line-through' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                    <span className="text-xs text-gray-500">{task.assignee}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {project.tasks.filter(t => t.completed).length} of {project.tasks.length} tasks completed
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-blue-600 text-sm font-medium hover:bg-blue-50 rounded">
                    View Details
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamCollaboration;