import React, { useState } from 'react';
import { Briefcase, Plus, Award, Calendar, ExternalLink, Download, Share, Filter, Search, Star, Trophy, Medal, Target, Users, BookOpen } from 'lucide-react';

interface PortfolioProps {
  userProfile?: any;
}

const Portfolio: React.FC<PortfolioProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'achievements' | 'skills' | 'timeline'>('overview');
  const [showAddForm, setShowAddForm] = useState(false);

  const portfolioData = {
    projects: [
      {
        id: 1,
        title: 'Solar Panel Efficiency Research',
        description: 'Comprehensive study comparing different solar panel configurations and their energy output efficiency under various conditions.',
        category: 'Science Research',
        status: 'Completed',
        startDate: '2024-01-15',
        endDate: '2024-05-15',
        role: 'Team Leader',
        team: ['Sarah Chen', 'Mike Johnson', 'Lisa Wang'],
        skills: ['Research', 'Data Analysis', 'Leadership', 'Presentation'],
        outcomes: [
          'Achieved 15% improvement in energy efficiency',
          'Presented findings at Regional Science Fair',
          'Won 2nd place in Environmental Innovation category',
          'Published research summary in school journal'
        ],
        media: [
          { type: 'image', url: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=400', caption: 'Solar panel testing setup' },
          { type: 'document', name: 'Research Report.pdf', size: '2.4 MB' },
          { type: 'presentation', name: 'Science Fair Presentation.pptx', size: '15.2 MB' }
        ],
        impact: 'High',
        featured: true
      },
      {
        id: 2,
        title: 'Romeo and Juliet Production',
        description: 'Stage management for the school\'s spring theater production, coordinating all technical and logistical aspects.',
        category: 'Arts & Theater',
        status: 'Completed',
        startDate: '2024-02-01',
        endDate: '2024-06-20',
        role: 'Stage Manager',
        team: ['Drama Club Cast & Crew'],
        skills: ['Project Management', 'Communication', 'Problem Solving', 'Teamwork'],
        outcomes: [
          'Successfully managed 3-night production run',
          'Coordinated 25+ cast and crew members',
          'Implemented new digital scheduling system',
          'Received Outstanding Service Award'
        ],
        media: [
          { type: 'image', url: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=400', caption: 'Opening night performance' },
          { type: 'video', name: 'Production Highlights.mp4', size: '45.6 MB' }
        ],
        impact: 'Medium',
        featured: false
      },
      {
        id: 3,
        title: 'Math Olympiad Training Program',
        description: 'Developed and led a peer tutoring program to help younger students prepare for math competitions.',
        category: 'Education & Mentoring',
        status: 'Ongoing',
        startDate: '2024-03-01',
        endDate: null,
        role: 'Program Coordinator',
        team: ['Math Club Members'],
        skills: ['Teaching', 'Mentoring', 'Curriculum Development', 'Leadership'],
        outcomes: [
          'Mentored 15 students across grades 9-10',
          '80% of participants improved competition scores',
          'Created comprehensive study materials',
          'Established sustainable program structure'
        ],
        media: [
          { type: 'document', name: 'Training Curriculum.pdf', size: '1.8 MB' },
          { type: 'spreadsheet', name: 'Student Progress Tracker.xlsx', size: '245 KB' }
        ],
        impact: 'High',
        featured: true
      }
    ],
    achievements: [
      {
        id: 1,
        title: 'Regional Science Fair - 2nd Place',
        category: 'Competition',
        date: '2024-05-20',
        description: 'Environmental Innovation category for solar panel efficiency research',
        issuer: 'Regional Science Education Foundation',
        level: 'Regional',
        skills: ['Research', 'Innovation', 'Presentation'],
        verification: 'Certificate #RSF-2024-ENV-002'
      },
      {
        id: 2,
        title: 'Outstanding Student Leader Award',
        category: 'Recognition',
        date: '2024-04-15',
        description: 'Recognized for exceptional leadership in multiple school activities',
        issuer: 'Lincoln High School',
        level: 'School',
        skills: ['Leadership', 'Service', 'Character'],
        verification: 'Award #LHS-2024-LEAD-001'
      },
      {
        id: 3,
        title: 'Drama Club Service Award',
        category: 'Service',
        date: '2024-06-25',
        description: 'Exceptional dedication and service as stage manager',
        issuer: 'Lincoln High Drama Department',
        level: 'School',
        skills: ['Service', 'Dedication', 'Teamwork'],
        verification: 'Certificate #LHS-DRAMA-2024-003'
      },
      {
        id: 4,
        title: 'Math Competition - Top 10%',
        category: 'Competition',
        date: '2024-03-10',
        description: 'Placed in top 10% of regional mathematics competition',
        issuer: 'State Mathematics Association',
        level: 'State',
        skills: ['Mathematics', 'Problem Solving', 'Critical Thinking'],
        verification: 'Result #SMA-2024-REG-089'
      }
    ],
    skills: [
      { name: 'Leadership', level: 95, category: 'Soft Skills', projects: 3, verified: true },
      { name: 'Research & Analysis', level: 90, category: 'Academic', projects: 2, verified: true },
      { name: 'Public Speaking', level: 88, category: 'Communication', projects: 2, verified: false },
      { name: 'Project Management', level: 85, category: 'Professional', projects: 3, verified: true },
      { name: 'Creative Problem Solving', level: 92, category: 'Soft Skills', projects: 3, verified: true },
      { name: 'Data Analysis', level: 87, category: 'Technical', projects: 1, verified: true },
      { name: 'Mentoring & Teaching', level: 83, category: 'Soft Skills', projects: 1, verified: false },
      { name: 'Event Coordination', level: 80, category: 'Professional', projects: 2, verified: true }
    ]
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-green-100 text-green-600 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'Low': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Science')) return BookOpen;
    if (category.includes('Arts')) return Star;
    if (category.includes('Education')) return Users;
    return Target;
  };

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'Competition': return Trophy;
      case 'Recognition': return Award;
      case 'Service': return Medal;
      default: return Star;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
          <p className="text-gray-600">Showcase your achievements, projects, and skills to the world.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
            <Share size={20} className="mr-2" />
            Share Portfolio
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
            <Download size={20} className="mr-2" />
            Export PDF
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={20} className="mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{portfolioData.projects.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Achievements</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{portfolioData.achievements.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Trophy size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Skills Developed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{portfolioData.skills.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Star size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Portfolio Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">92</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Award size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'projects', label: 'Projects' },
          { id: 'achievements', label: 'Achievements' },
          { id: 'skills', label: 'Skills' },
          { id: 'timeline', label: 'Timeline' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Featured Projects */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Projects</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {portfolioData.projects.filter(p => p.featured).map(project => {
                const CategoryIcon = getCategoryIcon(project.category);
                return (
                  <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <CategoryIcon size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.title}</h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {project.category}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded border ${getImpactColor(project.impact)}`}>
                        {project.impact} Impact
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-gray-600">
                        <strong>Role:</strong> {project.role}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Duration:</strong> {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolioData.achievements.slice(0, 4).map(achievement => {
                const AchievementIcon = getAchievementIcon(achievement.category);
                return (
                  <div key={achievement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <AchievementIcon size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.issuer}</p>
                        <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills Overview */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Skills</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolioData.skills.slice(0, 6).map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <div className="flex items-center space-x-2">
                        {skill.verified && <Star size={12} className="text-yellow-500" />}
                        <span className="text-sm font-semibold text-gray-900">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{skill.projects} projects</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          {portfolioData.projects.map(project => {
            const CategoryIcon = getCategoryIcon(project.category);
            return (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <CategoryIcon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {project.category}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          project.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {project.status}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded border ${getImpactColor(project.impact)}`}>
                          {project.impact} Impact
                        </span>
                      </div>
                    </div>
                  </div>
                  {project.featured && (
                    <div className="flex items-center text-yellow-500">
                      <Star size={16} className="mr-1" />
                      <span className="text-sm font-medium">Featured</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-4">{project.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Role & Team</h4>
                    <p className="text-sm text-gray-600 mb-1"><strong>Role:</strong> {project.role}</p>
                    <p className="text-sm text-gray-600"><strong>Team:</strong> {project.team.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline</h4>
                    <p className="text-sm text-gray-600 mb-1"><strong>Start:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600"><strong>End:</strong> {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Used</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map(skill => (
                        <span key={skill} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Outcomes</h4>
                  <ul className="space-y-1">
                    {project.outcomes.map((outcome, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                {project.media && project.media.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Media & Documents</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.media.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <ExternalLink size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {item.name || item.caption}
                          </span>
                          {item.size && (
                            <span className="text-xs text-gray-500">({item.size})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioData.achievements.map(achievement => {
            const AchievementIcon = getAchievementIcon(achievement.category);
            return (
              <div key={achievement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <AchievementIcon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {achievement.category}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        {achievement.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <p className="text-sm text-gray-700 font-medium">{achievement.issuer}</p>
                    <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Demonstrated</h4>
                  <div className="flex flex-wrap gap-1">
                    {achievement.skills.map(skill => (
                      <span key={skill} className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {achievement.verification && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Verification:</strong> {achievement.verification}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData.skills.map(skill => (
              <div key={skill.name} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{skill.name}</h3>
                    <p className="text-sm text-gray-600">{skill.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {skill.verified && <Star size={16} className="text-yellow-500" />}
                    <span className="text-lg font-bold text-gray-900">{skill.level}%</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{skill.projects} projects</span>
                  <span>{skill.verified ? 'Verified' : 'Self-assessed'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {[...portfolioData.projects, ...portfolioData.achievements]
              .sort((a, b) => new Date(b.startDate || b.date).getTime() - new Date(a.startDate || a.date).getTime())
              .map((item, index) => (
                <div key={`${item.id}-${item.title}`} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    {item.category ? <Trophy size={16} className="text-white" /> : <Briefcase size={16} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.startDate || item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Portfolio Item</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>Project</option>
                  <option>Achievement</option>
                  <option>Skill</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                  placeholder="Describe your project or achievement"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option>Science Research</option>
                    <option>Arts & Theater</option>
                    <option>Education & Mentoring</option>
                    <option>Technology</option>
                    <option>Leadership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;