import React, { useState } from 'react';
import { Search, Filter, Users, Star, MessageCircle, UserPlus, MapPin, Clock, Target } from 'lucide-react';

const TeamFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('teammates');
  const [selectedFilters, setSelectedFilters] = useState({
    strengths: [],
    interests: [],
    availability: 'any',
    projectType: 'any'
  });

  const users = [
    {
      id: 1,
      name: 'Sarah Chen',
      grade: '11th Grade',
      school: 'Lincoln High School',
      avatar: 'SC',
      personalityType: 'Innovator',
      strengths: ['Creative Thinking', 'Problem Solving', 'Communication'],
      interests: ['Science', 'Technology', 'Arts'],
      currentProjects: ['Solar Panel Research', 'Art Installation'],
      availability: 'Weekends',
      location: 'San Francisco, CA',
      rating: 4.8,
      projectsCompleted: 12,
      bio: 'Passionate about sustainable technology and creative problem solving. Looking for teammates who share my enthusiasm for making a positive impact.',
      lookingFor: 'Science Fair Team',
      matchScore: 95
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      grade: '10th Grade',
      school: 'Tech Academy',
      avatar: 'MR',
      personalityType: 'Leader',
      strengths: ['Leadership', 'Organization', 'Technical Skills'],
      interests: ['Technology', 'Science', 'Leadership'],
      currentProjects: ['Robotics Competition', 'Coding Bootcamp'],
      availability: 'Afternoons',
      location: 'Austin, TX',
      rating: 4.9,
      projectsCompleted: 8,
      bio: 'Experienced team leader with a passion for robotics and engineering. Love mentoring others and building innovative solutions.',
      lookingFor: 'Robotics Team',
      matchScore: 87
    },
    {
      id: 3,
      name: 'Emma Thompson',
      grade: '12th Grade',
      school: 'Central High',
      avatar: 'ET',
      personalityType: 'Collaborator',
      strengths: ['Teamwork', 'Research', 'Writing'],
      interests: ['Arts', 'Community', 'Social Sciences'],
      currentProjects: ['Debate Team', 'Community Service'],
      availability: 'Evenings',
      location: 'Boston, MA',
      rating: 4.7,
      projectsCompleted: 15,
      bio: 'Strong researcher and writer who loves collaborative projects. Interested in social impact and community engagement.',
      lookingFor: 'Debate Partner',
      matchScore: 78
    },
    {
      id: 4,
      name: 'Alex Kim',
      grade: '9th Grade',
      school: 'Innovation Academy',
      avatar: 'AK',
      personalityType: 'Analyst',
      strengths: ['Data Analysis', 'Mathematics', 'Critical Thinking'],
      interests: ['Science', 'Technology', 'Business'],
      currentProjects: ['Math Olympiad', 'Data Science Project'],
      availability: 'Flexible',
      location: 'Seattle, WA',
      rating: 4.6,
      projectsCompleted: 6,
      bio: 'Math enthusiast with strong analytical skills. Looking to apply mathematical concepts to real-world problems.',
      lookingFor: 'Math Competition Team',
      matchScore: 82
    }
  ];

  const clubs = [
    {
      id: 1,
      name: 'National Honor Society',
      type: 'Academic Honor Society',
      school: 'Lincoln High School',
      avatar: 'NHS',
      description: 'Dedicated to scholarship, leadership, service, and character development.',
      members: 45,
      activities: ['Community Service', 'Tutoring', 'Leadership Development'],
      meetingTime: 'First Monday of each month',
      requirements: 'Minimum 3.5 GPA, Teacher recommendations',
      interests: ['Leadership', 'Community', 'Social Sciences'],
      location: 'San Francisco, CA',
      status: 'Open for applications',
      matchScore: 92
    },
    {
      id: 2,
      name: 'Robotics Club',
      type: 'STEM Club',
      school: 'Tech Academy',
      avatar: 'RC',
      description: 'Building robots and competing in FIRST Robotics competitions.',
      members: 28,
      activities: ['Robot Building', 'Programming', 'Competitions'],
      meetingTime: 'Tuesdays & Thursdays 3-5pm',
      requirements: 'Interest in engineering/programming',
      interests: ['Technology', 'Science', 'Leadership'],
      location: 'Austin, TX',
      status: 'Recruiting new members',
      matchScore: 89
    },
    {
      id: 3,
      name: 'Environmental Club',
      type: 'Service Club',
      school: 'Central High',
      avatar: 'EC',
      description: 'Promoting environmental awareness and sustainability on campus.',
      members: 32,
      activities: ['Campus Cleanup', 'Recycling Programs', 'Environmental Advocacy'],
      meetingTime: 'Wednesdays 2:30-4:00pm',
      requirements: 'Passion for environmental issues',
      interests: ['Environment', 'Community', 'Science'],
      location: 'Boston, MA',
      status: 'Open membership',
      matchScore: 85
    },
    {
      id: 4,
      name: 'Drama Club',
      type: 'Arts Club',
      school: 'Innovation Academy',
      avatar: 'DC',
      description: 'Performing arts club producing school plays and musicals.',
      members: 24,
      activities: ['Acting', 'Set Design', 'Costume Design', 'Production'],
      meetingTime: 'Monday-Friday 3-6pm (production season)',
      requirements: 'Audition or volunteer commitment',
      interests: ['Arts', 'Leadership', 'Community'],
      location: 'Seattle, WA',
      status: 'Auditions open',
      matchScore: 78
    },
    {
      id: 5,
      name: 'Debate Team',
      type: 'Academic Club',
      school: 'Lincoln High School',
      avatar: 'DT',
      description: 'Competitive debate team participating in local and national tournaments.',
      members: 16,
      activities: ['Research', 'Argumentation', 'Public Speaking', 'Tournaments'],
      meetingTime: 'Tuesdays & Thursdays 3-5pm',
      requirements: 'Strong communication skills, commitment to practice',
      interests: ['Leadership', 'Social Sciences', 'Business'],
      location: 'San Francisco, CA',
      status: 'Tryouts required',
      matchScore: 81
    },
    {
      id: 6,
      name: 'Key Club',
      type: 'Service Club',
      school: 'Tech Academy',
      avatar: 'KC',
      description: 'Student-led organization focused on community service and leadership.',
      members: 38,
      activities: ['Community Service', 'Fundraising', 'Leadership Development'],
      meetingTime: 'Second & Fourth Fridays 2:30-3:30pm',
      requirements: 'Minimum 25 service hours per semester',
      interests: ['Community', 'Leadership', 'Business'],
      location: 'Austin, TX',
      status: 'Open membership',
      matchScore: 87
    }
  ];

  const strengthOptions = ['Leadership', 'Creative Thinking', 'Problem Solving', 'Communication', 'Teamwork', 'Research', 'Technical Skills', 'Organization'];
  const interestOptions = ['Science', 'Technology', 'Arts', 'Leadership', 'Sports', 'Community', 'Business', 'Environment', 'Social Sciences'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lookingFor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStrengths = selectedFilters.strengths.length === 0 ||
                            selectedFilters.strengths.some(strength => user.strengths.includes(strength));
    
    const matchesInterests = selectedFilters.interests.length === 0 ||
                            selectedFilters.interests.some(interest => user.interests.includes(interest));
    
    return matchesSearch && matchesStrengths && matchesInterests;
  });

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesInterests = selectedFilters.interests.length === 0 ||
                            selectedFilters.interests.some(interest => club.interests.includes(interest));
    
    return matchesSearch && matchesInterests;
  });

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Finder</h1>
        <p className="text-gray-600">Connect with like-minded peers and find your perfect project partners or join clubs and organizations.</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('teammates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'teammates'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Find Teammates
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'clubs'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Clubs & Organizations
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, interests, or project type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={20} className="mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {strengthOptions.map(strength => (
                <button
                  key={strength}
                  onClick={() => toggleFilter('strengths', strength)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedFilters.strengths.includes(strength)
                      ? 'bg-purple-100 text-purple-600 border border-purple-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {strength}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleFilter('interests', interest)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedFilters.interests.includes(interest)
                      ? 'bg-blue-100 text-blue-600 border border-blue-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'teammates' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{user.avatar}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.grade} • {user.school}</p>
                  <div className="flex items-center mt-1">
                    <MapPin size={14} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{user.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{user.matchScore}%</div>
                <div className="text-xs text-gray-500">Match</div>
              </div>
            </div>

            {/* Personality & Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                  {user.personalityType}
                </span>
                <div className="flex items-center text-sm text-gray-600">
                  <Star size={14} className="text-yellow-500 mr-1" />
                  <span>{user.rating}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Target size={14} className="mr-1" />
                  <span>{user.projectsCompleted} projects</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-700 text-sm mb-4">{user.bio}</p>

            {/* Looking For */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Users size={16} className="text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Looking for:</span>
              </div>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                {user.lookingFor}
              </span>
            </div>

            {/* Strengths */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Top Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {user.strengths.slice(0, 3).map(strength => (
                  <span key={strength} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {user.interests.slice(0, 3).map(interest => (
                  <span key={interest} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Current Projects */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Projects</h4>
              <div className="space-y-1">
                {user.currentProjects.map(project => (
                  <div key={project} className="text-sm text-gray-600">• {project}</div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center mb-6 text-sm text-gray-600">
              <Clock size={14} className="mr-2" />
              <span>Available: {user.availability}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                <UserPlus size={16} className="mr-2" />
                Connect
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                <MessageCircle size={16} className="mr-2" />
                Message
              </button>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Clubs & Organizations Tab */}
      {activeTab === 'clubs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClubs.map(club => (
            <div key={club.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{club.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{club.name}</h3>
                    <p className="text-sm text-gray-600">{club.type} • {club.school}</p>
                    <div className="flex items-center mt-1">
                      <MapPin size={14} className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">{club.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{club.matchScore}% Match</div>
                  <div className="flex items-center mt-1">
                    <Users size={14} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{club.members} members</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{club.description}</p>

              {/* Activities */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Activities</h4>
                <div className="flex flex-wrap gap-2">
                  {club.activities.map((activity, index) => (
                    <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meeting Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Clock size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Meeting Time</span>
                  </div>
                  <p className="text-sm text-gray-600">{club.meetingTime}</p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Target size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Requirements</span>
                  </div>
                  <p className="text-sm text-gray-600">{club.requirements}</p>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    club.status === 'Open membership' ? 'bg-green-500' :
                    club.status === 'Recruiting new members' ? 'bg-blue-500' :
                    club.status === 'Open for applications' ? 'bg-yellow-500' :
                    'bg-orange-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">{club.status}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <MessageCircle size={16} className="mr-1" />
                    Learn More
                  </button>
                  <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <UserPlus size={16} className="mr-1" />
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results messages */}
      {activeTab === 'teammates' && filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No teammates found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {activeTab === 'clubs' && filteredClubs.length === 0 && (
        <div className="text-center py-12">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No clubs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default TeamFinder;