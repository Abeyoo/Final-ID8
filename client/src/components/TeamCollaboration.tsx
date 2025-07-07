import React, { useState } from 'react';
import { Users, Plus, Calendar, MessageSquare, FileText, CheckCircle, X, Edit3, Target, MoreHorizontal } from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';

interface TeamCollaborationProps {
  onNavigateToProject: (projectId: string) => void;
  userProfile?: any;
}

const TeamCollaboration: React.FC<TeamCollaborationProps> = ({ onNavigateToProject, userProfile }) => {

  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedTeamForMembers, setSelectedTeamForMembers] = useState<any>(null);
  const [progressUpdate, setProgressUpdate] = useState({
    newProgress: 0,
    updateNote: '',
    milestone: ''
  });
  const [newTeamForm, setNewTeamForm] = useState({
    name: '',
    description: '',
    category: 'Academic',
    skills: [''],
    maxMembers: 5,
    isPrivate: false
  });

  // Fetch user teams from the database
  const { data: userTeams, isLoading: isTeamsLoading, error: teamsError } = useQuery({
    queryKey: [`/api/users/${userProfile?.id}/teams`],
    enabled: !!userProfile?.id,
  });

  // Debug logging
  console.log('Team Collaboration Debug:', {
    userProfile: userProfile?.id,
    userTeams,
    isTeamsLoading,
    teamsError,
    formattedTeams: formatTeamsForDisplay(userTeams || [])
  });

  // Demo data for John Doe only
  const demoTeams = [
    {
      id: 1,
      name: 'Science Fair Team',
      description: 'Working on renewable energy project for the annual science fair',
      members: 4,
      role: 'Team Leader',
      progress: 75,
      deadline: '2024-05-15',
      status: 'active',
      category: 'Academic',
      skills: ['Research', 'Engineering', 'Presentation'],
      project: {
        id: 'science-fair',
        name: 'Solar Panel Efficiency Study',
        tasksCompleted: 2,
        totalTasks: 5,
        priority: 'high'
      },
      memberDetails: [
        { id: 1, name: 'John Doe', role: 'Team Leader', avatar: 'JD', online: true },
        { id: 2, name: 'Sarah Chen', role: 'Researcher', avatar: 'SC', online: true },
        { id: 3, name: 'Mike Johnson', role: 'Data Analyst', avatar: 'MJ', online: false },
        { id: 4, name: 'Emily Rodriguez', role: 'Presenter', avatar: 'ER', online: true }
      ],
      joinRequests: [
        { id: 1, name: 'Alex Thompson', message: 'I have experience with solar energy research and would love to contribute to the project!', timestamp: '2 hours ago' },
        { id: 2, name: 'Lisa Park', message: 'I\'m great with data visualization and can help with presenting results.', timestamp: '1 day ago' }
      ]
    },
    {
      id: 2,
      name: 'Drama Club Production',
      description: 'Organizing and performing in the spring theater production',
      members: 12,
      role: 'Stage Manager',
      progress: 45,
      deadline: '2024-06-20',
      status: 'active',
      category: 'Creative',
      skills: ['Organization', 'Creative Arts', 'Leadership'],
      project: {
        id: 'drama-production',
        name: 'Romeo and Juliet Production',
        tasksCompleted: 2,
        totalTasks: 5,
        priority: 'medium'
      },
      memberDetails: [
        { id: 1, name: 'John Doe', role: 'Stage Manager', avatar: 'JD', online: true },
        { id: 2, name: 'Emma Watson', role: 'Juliet', avatar: 'EW', online: true },
        { id: 3, name: 'Ryan Davis', role: 'Romeo', avatar: 'RD', online: false },
        { id: 4, name: 'Sophie Turner', role: 'Nurse', avatar: 'ST', online: true },
        { id: 5, name: 'David Miller', role: 'Mercutio', avatar: 'DM', online: false },
        { id: 6, name: 'Grace Lee', role: 'Lady Capulet', avatar: 'GL', online: true },
        { id: 7, name: 'Tom Wilson', role: 'Friar Lawrence', avatar: 'TW', online: false },
        { id: 8, name: 'Mia Garcia', role: 'Costume Designer', avatar: 'MG', online: true },
        { id: 9, name: 'Jake Brown', role: 'Set Designer', avatar: 'JB', online: false },
        { id: 10, name: 'Olivia Jones', role: 'Props Manager', avatar: 'OJ', online: true },
        { id: 11, name: 'Noah Taylor', role: 'Lighting Tech', avatar: 'NT', online: false },
        { id: 12, name: 'Ava Martinez', role: 'Sound Tech', avatar: 'AM', online: true }
      ],
      joinRequests: [
        { id: 1, name: 'Chris Anderson', message: 'I have stage management experience and would love to help backstage.', timestamp: '3 hours ago' }
      ]
    },
    {
      id: 3,
      name: 'Math Olympiad Squad',
      description: 'Preparing for regional and national math competitions',
      members: 6,
      role: 'Member',
      progress: 60,
      deadline: '2024-04-30',
      status: 'active',
      category: 'Academic',
      skills: ['Mathematics', 'Problem Solving', 'Competition'],
      project: null, // This team doesn't have a specific project board
      memberDetails: [
        { id: 1, name: 'John Doe', role: 'Member', avatar: 'JD', online: true },
        { id: 2, name: 'Kevin Chang', role: 'Captain', avatar: 'KC', online: true },
        { id: 3, name: 'Maya Patel', role: 'Vice Captain', avatar: 'MP', online: false },
        { id: 4, name: 'Alex Kim', role: 'Member', avatar: 'AK', online: true },
        { id: 5, name: 'Sam Rivera', role: 'Member', avatar: 'SR', online: false },
        { id: 6, name: 'Zoe Clark', role: 'Member', avatar: 'ZC', online: true }
      ],
      joinRequests: [
        { id: 1, name: 'Daniel Wong', message: 'I placed 3rd in the regional math competition last year and would like to join the squad.', timestamp: '5 hours ago' }
      ]
    }
  ];

  // Format teams data for display
  const formatTeamsForDisplay = (teams: any[]) => {
    return teams.map(team => ({
      id: team.id,
      name: team.name,
      description: team.description,
      members: team.memberCount || 1,
      role: team.role,
      progress: team.progress || 0,
      deadline: team.deadline ? new Date(team.deadline).toISOString().split('T')[0] : null,
      status: team.status,
      category: team.category,
      skills: team.skills || [],
      project: null, // Projects will be connected separately
      memberDetails: [
        { id: 1, name: userProfile?.name || 'You', role: team.role, avatar: userProfile?.name?.split(' ').map(n => n[0]).join('') || 'U', online: true }
      ],
      joinRequests: []
    }));
  };

  // Always use real database data for all users
  const teams = formatTeamsForDisplay(userTeams || []);


  const handleSkillChange = (index: number, value: string) => {
    setNewTeamForm(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const addSkillField = () => {
    setNewTeamForm(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkillField = (index: number) => {
    if (newTeamForm.skills.length > 1) {
      setNewTeamForm(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }));
    }
  };

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: async (teamData: any) => {
      return await apiRequest('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...teamData,
          userId: userProfile?.id
        })
      });
    },
    onSuccess: () => {
      // Invalidate teams query to refresh the list
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userProfile?.id}/teams`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userProfile?.id}/stats`] });
      
      // Reset form and close modal
      setNewTeamForm({
        name: '',
        description: '',
        category: 'Academic',
        skills: [''],
        maxMembers: 5,
        isPrivate: false
      });
      setShowCreateTeamForm(false);
    },
    onError: (error) => {
      console.error('Failed to create team:', error);
    }
  });

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTeamForm.name.trim() || !newTeamForm.description.trim()) {
      return; // Basic validation
    }

    // Filter out empty skills
    const skills = newTeamForm.skills.filter(skill => skill.trim() !== '');

    const teamData = {
      name: newTeamForm.name,
      description: newTeamForm.description,
      category: newTeamForm.category,
      skills: skills.length > 0 ? skills : ['General'],
      maxMembers: newTeamForm.maxMembers,
      isPrivate: newTeamForm.isPrivate
    };

    createTeamMutation.mutate(teamData);
  };

  const handleProgressUpdate = (teamId: number) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setSelectedTeamId(teamId);
      setProgressUpdate({
        newProgress: team.progress,
        updateNote: '',
        milestone: ''
      });
      setShowProgressModal(true);
    }
  };

  const submitProgressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTeamId === null) return;

    const oldProgress = teams.find(t => t.id === selectedTeamId)?.progress || 0;

    setTeams(prev => prev.map(team => {
      if (team.id === selectedTeamId) {
        return {
          ...team,
          progress: progressUpdate.newProgress,
          lastUpdate: new Date().toISOString()
        };
      }
      return team;
    }));

    // Track progress update with AI personality analysis
    try {
      const response = await fetch(`/api/teams/${selectedTeamId}/interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // TODO: Get from user context
          actionType: 'updated_progress',
          actionData: {
            oldProgress,
            newProgress: progressUpdate.newProgress,
            milestone: progressUpdate.milestone,
            notes: progressUpdate.updateNote,
            isLeaderAction: true
          }
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Personality updated after progress update:', result.personalityUpdate);
      }
    } catch (error) {
      console.error('Failed to track progress update:', error);
    }

    // Reset form and close modal
    setProgressUpdate({
      newProgress: 0,
      updateNote: '',
      milestone: ''
    });
    setShowProgressModal(false);
    setSelectedTeamId(null);
  };

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
        <button
          onClick={() => setShowCreateTeamForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} className="mr-2" />
          Create Team
        </button>
      </div>


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
                    <button 
                      className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-300"
                      onClick={() => {
                        setSelectedTeamForMembers(team);
                        setShowMembersModal(true);
                      }}
                    >
                      <Users size={16} className="mr-1.5" />
                      <span className="text-sm font-medium">{team.members}</span>
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{team.description}</p>
                  
                  {/* Connected Project */}
                  {team.project && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-800">Current Project</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          team.project.priority === 'high' ? 'bg-red-100 text-red-600' :
                          team.project.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {team.project.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{team.project.name}</p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{team.project.tasksCompleted}/{team.project.totalTasks} tasks completed</span>
                        <button 
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => {
                            // Store the selected project ID for the Project Board to pick up
                            localStorage.setItem('selectedProjectId', team.project.id);
                            onNavigateToProject(team.project.id);
                          }}
                        >
                          View Project →
                        </button>
                      </div>
                    </div>
                  )}
                  
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
                      {team.role === 'Team Leader' && (
                        <button 
                          onClick={() => handleProgressUpdate(team.id)}
                          className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                          title="Update Progress"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
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


      {/* Create Team Form Modal */}
      {showCreateTeamForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Team</h2>
              <button
                onClick={() => setShowCreateTeamForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTeam} className="p-6 space-y-6">
              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={newTeamForm.name}
                  onChange={(e) => setNewTeamForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter team name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newTeamForm.description}
                  onChange={(e) => setNewTeamForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your team's purpose and goals"
                  rows={3}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newTeamForm.category}
                  onChange={(e) => setNewTeamForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Academic">Academic</option>
                  <option value="Creative">Creative</option>
                  <option value="Sports">Sports</option>
                  <option value="Technology">Technology</option>
                  <option value="Community Service">Community Service</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Required
                </label>
                <div className="space-y-2">
                  {newTeamForm.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter required skill"
                      />
                      {newTeamForm.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkillField(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSkillField}
                    className="flex items-center text-purple-600 text-sm font-medium hover:text-purple-700"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Another Skill
                  </button>
                </div>
              </div>

              {/* Max Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Members
                </label>
                <input
                  type="number"
                  value={newTeamForm.maxMembers}
                  onChange={(e) => setNewTeamForm(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 5 }))}
                  min="2"
                  max="20"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Privacy Setting */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newTeamForm.isPrivate}
                  onChange={(e) => setNewTeamForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isPrivate" className="text-sm text-gray-700">
                  Private team (invitation only)
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateTeamForm(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress Update Modal */}
      {showProgressModal && selectedTeamId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Target size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Update Team Progress</h2>
              </div>
              <button
                onClick={() => setShowProgressModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={submitProgressUpdate} className="p-6 space-y-6">
              {/* Current vs New Progress */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Current Progress</span>
                  <span className="text-lg font-bold text-gray-900">
                    {teams.find(t => t.id === selectedTeamId)?.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gray-400 transition-all duration-300"
                    style={{ width: `${teams.find(t => t.id === selectedTeamId)?.progress}%` }}
                  />
                </div>
              </div>

              {/* New Progress Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  New Progress: {progressUpdate.newProgress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressUpdate.newProgress}
                  onChange={(e) => setProgressUpdate(prev => ({ ...prev, newProgress: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Quick Progress Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Update
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setProgressUpdate(prev => ({ ...prev, newProgress: value }))}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        progressUpdate.newProgress === value
                          ? 'bg-purple-100 border-purple-300 text-purple-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Milestone Achievement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Milestone Achieved (Optional)
                </label>
                <input
                  type="text"
                  value={progressUpdate.milestone}
                  onChange={(e) => setProgressUpdate(prev => ({ ...prev, milestone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Completed research phase, First prototype ready"
                />
              </div>

              {/* Update Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress Notes (Optional)
                </label>
                <textarea
                  value={progressUpdate.updateNote}
                  onChange={(e) => setProgressUpdate(prev => ({ ...prev, updateNote: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="What was accomplished? What's next?"
                  rows={3}
                />
              </div>

              {/* Progress Preview */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-purple-700">New Progress</span>
                  <span className="text-lg font-bold text-purple-900">{progressUpdate.newProgress}%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${progressUpdate.newProgress}%` }}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Update Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {showMembersModal && selectedTeamForMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedTeamForMembers.name}</h3>
                  <p className="text-gray-600">{selectedTeamForMembers.memberDetails.length} members</p>
                </div>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Invite Button */}
              <div className="mb-6">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                  <Plus size={20} className="mr-2" />
                  Invite Members
                </button>
              </div>

              {/* Current Members */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Members</h4>
                <div className="space-y-3">
                  {selectedTeamForMembers.memberDetails.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                            {member.avatar}
                          </div>
                          {member.online && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          member.online 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {member.online ? 'Online' : 'Offline'}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Join Requests */}
              {selectedTeamForMembers.joinRequests && selectedTeamForMembers.joinRequests.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Join Requests ({selectedTeamForMembers.joinRequests.length})
                  </h4>
                  <div className="space-y-4">
                    {selectedTeamForMembers.joinRequests.map((request: any) => (
                      <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{request.name}</p>
                            <p className="text-sm text-gray-500">{request.timestamp}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{request.message}</p>
                        <div className="flex space-x-2">
                          <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                            <CheckCircle size={16} className="mr-1" />
                            Accept
                          </button>
                          <button className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                            <X size={16} className="mr-1" />
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCollaboration;