import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Calendar, Users, MessageSquare, Paperclip, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ProjectBoardProps {
  userProfile?: any;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ userProfile }) => {
  const [selectedProject, setSelectedProject] = useState('science-fair');

  // Check for selected project from Team Collaboration navigation
  useEffect(() => {
    const storedProjectId = localStorage.getItem('selectedProjectId');
    if (storedProjectId) {
      setSelectedProject(storedProjectId);
      // Clear the stored ID after using it
      localStorage.removeItem('selectedProjectId');
    }
  }, []);

  // Fetch user projects from the database
  const { data: userProjects, isLoading: isProjectsLoading } = useQuery({
    queryKey: [`/api/users/${userProfile?.id}/projects`],
    enabled: !!userProfile?.id,
  });

  // Demo data for John Doe only
  const demoProjects = [
    {
      id: 'science-fair',
      name: 'Solar Panel Efficiency Study',
      description: 'Research and test different solar panel configurations',
      team: ['John Doe', 'Sarah Chen', 'Mike Johnson', 'Lisa Wang'],
      deadline: '2024-05-15',
      progress: 65,
      status: 'active',
      tasks: [
        { title: 'Research current technologies', completed: true, assignee: 'John Doe' },
        { title: 'Build test apparatus', completed: true, assignee: 'Sarah Chen' },
        { title: 'Collect data samples', completed: false, assignee: 'Mike Johnson' },
        { title: 'Analyze results', completed: false, assignee: 'Lisa Wang' },
        { title: 'Prepare presentation', completed: false, assignee: 'John Doe' },
      ],
      priority: 'high'
    },
    {
      id: 'drama-production',
      name: 'Romeo and Juliet Production',
      description: 'Spring theater production planning and execution',
      team: ['John Doe', 'Emma Thompson', 'Alex Rivera'],
      deadline: '2024-06-20',
      progress: 40,
      status: 'active',
      tasks: [
        { title: 'Cast selection', completed: true, assignee: 'Director' },
        { title: 'Set design', completed: true, assignee: 'Art Team' },
        { title: 'Rehearsal scheduling', completed: false, assignee: 'John Doe' },
        { title: 'Costume preparation', completed: false, assignee: 'Costume Team' },
        { title: 'Lighting setup', completed: false, assignee: 'Tech Team' },
      ],
      priority: 'medium'
    }
  ];

  // Use demo data for John Doe, real data for other users
  const projects = userProfile?.email === 'john.doe@lincolnhs.org' ? demoProjects : (userProjects || []);

  const kanbanColumns = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-gray-100',
      tasks: [
        {
          id: 1,
          title: 'Research latest solar panel technologies',
          description: 'Find and analyze recent developments in solar panel efficiency',
          assignee: 'Sarah Chen',
          priority: 'high',
          dueDate: '2024-02-25',
          comments: 3,
          attachments: 1
        },
        {
          id: 2,
          title: 'Design test apparatus',
          description: 'Create blueprints for testing different panel configurations',
          assignee: 'Mike Johnson',
          priority: 'medium',
          dueDate: '2024-03-01',
          comments: 1,
          attachments: 0
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-blue-100',
      tasks: [
        {
          id: 3,
          title: 'Build testing framework',
          description: 'Construct the physical apparatus for testing',
          assignee: 'John Doe',
          priority: 'high',
          dueDate: '2024-02-28',
          comments: 5,
          attachments: 2
        },
        {
          id: 4,
          title: 'Collect baseline data',
          description: 'Gather initial measurements from standard panels',
          assignee: 'Lisa Wang',
          priority: 'medium',
          dueDate: '2024-03-05',
          comments: 2,
          attachments: 1
        }
      ]
    },
    {
      id: 'review',
      title: 'Review',
      color: 'bg-yellow-100',
      tasks: [
        {
          id: 5,
          title: 'Literature review document',
          description: 'Comprehensive review of existing research',
          assignee: 'Sarah Chen',
          priority: 'low',
          dueDate: '2024-02-20',
          comments: 8,
          attachments: 3
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      color: 'bg-green-100',
      tasks: [
        {
          id: 6,
          title: 'Project proposal',
          description: 'Initial project proposal and timeline',
          assignee: 'John Doe',
          priority: 'high',
          dueDate: '2024-02-15',
          comments: 12,
          attachments: 2
        },
        {
          id: 7,
          title: 'Team formation',
          description: 'Recruit and organize project team',
          assignee: 'John Doe',
          priority: 'high',
          dueDate: '2024-02-10',
          comments: 4,
          attachments: 0
        }
      ]
    }
  ];

  const currentProject = projects.find(p => p.id === selectedProject);
  
  // Calculate dynamic progress based on completed tasks
  const getProjectProgress = (project: any) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter((task: any) => task.completed).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Board</h1>
          <p className="text-gray-600">Manage tasks and track progress with your team.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
          <Plus size={20} className="mr-2" />
          New Project
        </button>
      </div>

      {/* Project Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedProject === project.id
                  ? 'bg-purple-100 text-purple-600 border border-purple-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {project.name}
            </button>
          ))}
        </div>
      </div>

      {/* Project Info */}
      {currentProject && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentProject.name}</h2>
              <p className="text-gray-600">{currentProject.description}</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Users size={20} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Team Members</p>
                <p className="text-sm text-gray-600">{currentProject.team.length} members</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Deadline</p>
                <p className="text-sm text-gray-600">{new Date(currentProject.deadline).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CheckCircle size={20} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Progress</p>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ width: `${getProjectProgress(currentProject)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{getProjectProgress(currentProject)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Tasks Section */}
      {currentProject && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentProject.priority === 'high' ? 'bg-red-100 text-red-600' :
              currentProject.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-green-100 text-green-600'
            }`}>
              {currentProject.priority} priority
            </span>
          </div>
          
          <div className="space-y-3">
            {currentProject.tasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <button 
                  className="hover:scale-110 transition-transform"
                  onClick={() => {
                    // Toggle task completion
                    setProjects(prevProjects => 
                      prevProjects.map(p => 
                        p.id === currentProject.id 
                          ? {
                              ...p,
                              tasks: p.tasks.map((t, i) => 
                                i === index ? { ...t, completed: !t.completed } : t
                              )
                            }
                          : p
                      )
                    );
                  }}
                >
                  <CheckCircle
                    size={20}
                    className={task.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}
                  />
                </button>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">{task.assignee}</span>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {task.assignee.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Progress: {currentProject.tasks.filter(t => t.completed).length}/{currentProject.tasks.length} tasks completed
              </span>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  Add Task
                </button>
                <button className="px-4 py-2 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board - Only show for demo users or users with projects */}
      {(userProfile?.email === 'john.doe@lincolnhs.org' || (projects && projects.length > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {kanbanColumns.map(column => (
          <div key={column.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className={`${column.color} px-4 py-3 rounded-t-xl border-b border-gray-200`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="bg-white bg-opacity-70 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {column.tasks.map(task => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  <p className="text-xs text-gray-600 mb-3">{task.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      {isOverdue(task.dueDate) ? (
                        <AlertCircle size={12} className="text-red-500 mr-1" />
                      ) : (
                        <Clock size={12} className="mr-1" />
                      )}
                      <span className={isOverdue(task.dueDate) ? 'text-red-500' : ''}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {task.comments > 0 && (
                        <div className="flex items-center">
                          <MessageSquare size={12} className="mr-1" />
                          <span>{task.comments}</span>
                        </div>
                      )}
                      {task.attachments > 0 && (
                        <div className="flex items-center">
                          <Paperclip size={12} className="mr-1" />
                          <span>{task.attachments}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-all">
                <Plus size={16} className="mx-auto" />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Team Chat Section - Only show for demo users or users with projects */}
      {(userProfile?.email === 'john.doe@lincolnhs.org' || (projects && projects.length > 0)) && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Discussion</h3>
        
        <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">SC</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-900">Just finished the literature review! Found some great papers on perovskite solar cells.</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Sarah Chen • 2 hours ago</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">MJ</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-900">Great work! I'm making good progress on the test apparatus. Should have the frame ready by tomorrow.</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Mike Johnson • 1 hour ago</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">JD</span>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
            Send
          </button>
        </div>
        </div>
      )}

      {/* Empty state for new users */}
      {userProfile?.email !== 'john.doe@lincolnhs.org' && (!projects || projects.length === 0) && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-500 mb-4">Join a team to start collaborating on projects!</p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
            Find Teams
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;