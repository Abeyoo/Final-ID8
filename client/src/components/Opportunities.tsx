import React, { useState } from 'react';
import { Trophy, Search, Filter, MapPin, Calendar, Users, ExternalLink } from 'lucide-react';

const Opportunities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const trackOpportunityInteraction = async (
    opportunity: any, 
    actionType: 'viewed' | 'applied' | 'bookmarked' | 'shared'
  ) => {
    try {
      await fetch('/api/opportunities/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // TODO: Get from user context
          opportunityType: opportunity.type.toLowerCase(),
          category: opportunity.category,
          title: opportunity.title,
          actionType,
          interactionData: {
            description: opportunity.description,
            deadline: opportunity.deadline,
            match: opportunity.match,
            requirements: opportunity.requirements
          }
        })
      });
    } catch (error) {
      console.error('Failed to track opportunity interaction:', error);
    }
  };

  const opportunities = [
    {
      id: 1,
      title: 'National Science Fair Competition',
      type: 'Competition',
      category: 'Science',
      description: 'Showcase your scientific research and innovation in a national competition with cash prizes and college scholarships.',
      deadline: '2024-03-15',
      location: 'Virtual/Regional',
      participants: '500+',
      prizes: '$50,000 in scholarships',
      requirements: ['Grade 9-12', 'Original research project', 'Faculty sponsor'],
      match: 95,
      featured: true
    },
    {
      id: 2,
      title: 'Youth Leadership Summit',
      type: 'Program',
      category: 'Leadership',
      description: 'Develop leadership skills through workshops, networking, and mentorship with industry leaders.',
      deadline: '2024-04-01',
      location: 'Washington, DC',
      participants: '200',
      prizes: 'Certificate & Networking',
      requirements: ['Grade 10-12', 'Leadership experience', 'Essay submission'],
      match: 88,
      featured: true
    },
    {
      id: 3,
      title: 'Creative Writing Contest',
      type: 'Competition',
      category: 'Arts',
      description: 'Submit your original poetry, short stories, or essays for a chance to be published and win cash prizes.',
      deadline: '2024-05-20',
      location: 'Online',
      participants: '1000+',
      prizes: '$5,000 + Publication',
      requirements: ['Age 13-18', 'Original work', 'Under 2000 words'],
      match: 76,
      featured: false
    },
    {
      id: 4,
      title: 'Math Olympiad Training Camp',
      type: 'Program',
      category: 'Mathematics',
      description: 'Intensive training program for students preparing for international math competitions.',
      deadline: '2024-06-10',
      location: 'Boston, MA',
      participants: '50',
      prizes: 'Training & Mentorship',
      requirements: ['Grade 9-12', 'Math competition experience', 'Qualifying score'],
      match: 82,
      featured: false
    },
    {
      id: 5,
      title: 'Robotics Championship',
      type: 'Competition',
      category: 'Technology',
      description: 'Design and build autonomous robots to compete in challenging tasks and scenarios.',
      deadline: '2024-07-15',
      location: 'Multiple Cities',
      participants: '300+ teams',
      prizes: '$25,000 + Equipment',
      requirements: ['Team of 3-6', 'Grade 9-12', 'Robot specifications'],
      match: 91,
      featured: true
    },
    {
      id: 6,
      title: 'Environmental Innovation Challenge',
      type: 'Competition',
      category: 'Environment',
      description: 'Develop innovative solutions to environmental challenges facing your community.',
      deadline: '2024-08-30',
      location: 'San Francisco, CA',
      participants: '150',
      prizes: '$15,000 + Internships',
      requirements: ['Grade 9-12', 'Team project', 'Sustainability focus'],
      match: 79,
      featured: false
    }
  ];

  const categories = ['all', 'Science', 'Leadership', 'Arts', 'Mathematics', 'Technology', 'Environment'];

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredOpportunities = opportunities.filter(opp => opp.featured);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Opportunities</h1>
        <p className="text-gray-600">Discover competitions, programs, and events that match your interests and skills.</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured Opportunities */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Opportunities</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredOpportunities.slice(0, 2).map((opportunity) => (
            <div key={opportunity.id} className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy size={20} />
                    <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                      {opportunity.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
                  <p className="text-sm opacity-90">{opportunity.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{opportunity.match}%</div>
                  <div className="text-xs opacity-75">Match</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>Due {new Date(opportunity.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-2" />
                  <span>{opportunity.participants}</span>
                </div>
                <div className="flex items-center">
                  <Trophy size={16} className="mr-2" />
                  <span>{opportunity.prizes}</span>
                </div>
              </div>
              
              <button 
                onClick={() => trackOpportunityInteraction(opportunity, 'applied')}
                className="w-full mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* All Opportunities */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Opportunities</h2>
        <div className="space-y-4">
          {filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      opportunity.type === 'Competition' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Trophy size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{opportunity.category}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{opportunity.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{opportunity.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      <span>Due {new Date(opportunity.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={14} className="mr-2" />
                      <span>{opportunity.participants}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy size={14} className="mr-2" />
                      <span>{opportunity.prizes}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.requirements.map((req, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 text-right">
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-600">{opportunity.match}%</div>
                    <div className="text-xs text-gray-500">Match Score</div>
                  </div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => trackOpportunityInteraction(opportunity, 'applied')}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                    >
                      Apply Now
                    </button>
                    <button 
                      onClick={() => trackOpportunityInteraction(opportunity, 'viewed')}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Opportunities;