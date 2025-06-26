import React, { useState } from 'react';
import { MessageCircle, Users, Heart, MessageSquare, Share, UserPlus, Search } from 'lucide-react';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'mentors' | 'discussions'>('feed');

  const posts = [
    {
      id: 1,
      author: 'Sarah Chen',
      grade: 'Grade 11',
      avatar: 'SC',
      timeAgo: '2 hours ago',
      content: 'Just completed my first public speaking assessment! 🎤 The results showed I\'m strongest in storytelling but need work on voice projection. Already signed up for drama club to practice more. Thanks to everyone who encouraged me to take the leap!',
      likes: 12,
      comments: 5,
      tags: ['PublicSpeaking', 'PersonalGrowth'],
      liked: false
    },
    {
      id: 2,
      author: 'Marcus Rodriguez',
      grade: 'Grade 10',
      avatar: 'MR',
      timeAgo: '5 hours ago',
      content: 'Our robotics team just won the regional competition! 🤖🏆 Six months of hard work paid off. Special thanks to my mentor @DrJohnson for pushing us to think outside the box. Next stop: nationals!',
      likes: 28,
      comments: 15,
      tags: ['Robotics', 'TeamWork', 'Competition'],
      liked: true,
      image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      author: 'Emma Thompson',
      grade: 'Grade 12',
      avatar: 'ET',
      timeAgo: '1 day ago',
      content: 'Question for fellow aspiring leaders: How do you balance being assertive while still being collaborative? I\'m team captain for our science fair project and struggling to find the right approach when team members disagree.',
      likes: 8,
      comments: 12,
      tags: ['Leadership', 'TeamManagement', 'Question'],
      liked: false
    }
  ];

  const mentors = [
    {
      id: 1,
      name: 'Dr. Lisa Johnson',
      title: 'Robotics Engineer',
      company: 'Tech Innovations Inc.',
      expertise: ['Engineering', 'Problem Solving', 'STEM'],
      students: 12,
      rating: 4.9,
      avatar: 'LJ',
      available: true
    },
    {
      id: 2,
      name: 'Michael Park',
      title: 'Public Speaking Coach',
      company: 'Communication Masters',
      expertise: ['Communication', 'Leadership', 'Presentation'],
      students: 8,
      rating: 4.8,
      avatar: 'MP',
      available: true
    },
    {
      id: 3,
      name: 'Sofia Gonzalez',
      title: 'Creative Director',
      company: 'Design Studio',
      expertise: ['Creativity', 'Design Thinking', 'Arts'],
      students: 15,
      rating: 4.9,
      avatar: 'SG',
      available: false
    },
    {
      id: 4,
      name: 'James Wilson',
      title: 'Data Scientist',
      company: 'Analytics Co.',
      expertise: ['Analytics', 'Mathematics', 'Research'],
      students: 6,
      rating: 4.7,
      avatar: 'JW',
      available: true
    }
  ];

  const discussions = [
    {
      id: 1,
      title: 'Best strategies for overcoming presentation anxiety?',
      author: 'Alex Kim',
      replies: 23,
      lastActivity: '30 minutes ago',
      category: 'Public Speaking',
      pinned: true
    },
    {
      id: 2,
      title: 'How to find your passion when you have multiple interests?',
      author: 'Rachel Martinez',
      replies: 45,
      lastActivity: '2 hours ago',
      category: 'Self Discovery',
      pinned: false
    },
    {
      id: 3,
      title: 'Balancing academics with extracurricular leadership roles',
      author: 'David Chang',
      replies: 18,
      lastActivity: '4 hours ago',
      category: 'Time Management',
      pinned: false
    },
    {
      id: 4,
      title: 'Tips for effective team collaboration in group projects',
      author: 'Maya Patel',
      replies: 31,
      lastActivity: '1 day ago',
      category: 'Teamwork',
      pinned: false
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">Connect with peers, share your journey, and learn from mentors.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'feed'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Community Feed
        </button>
        <button
          onClick={() => setActiveTab('mentors')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'mentors'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Find Mentors
        </button>
        <button
          onClick={() => setActiveTab('discussions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'discussions'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Discussions
        </button>
      </div>

      {activeTab === 'feed' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* New Post */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">JD</span>
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Share your progress, ask questions, or celebrate achievements..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded cursor-pointer">#Progress</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded cursor-pointer">#Question</span>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded cursor-pointer">#Achievement</span>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                Share
              </button>
            </div>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{post.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{post.grade}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{post.timeAgo}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post image"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-6">
                      <button className={`flex items-center space-x-2 text-sm transition-colors ${
                        post.liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                      }`}>
                        <Heart size={16} className={post.liked ? 'fill-current' : ''} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        <MessageSquare size={16} />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                        <Share size={16} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mentors' && (
        <div>
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors by expertise..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{mentor.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                    <p className="text-sm text-gray-600">{mentor.title}</p>
                    <p className="text-xs text-gray-500">{mentor.company}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${mentor.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.map((skill, index) => (
                      <span key={index} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{mentor.students} students</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{mentor.rating}</span>
                  </div>
                </div>
                
                <button
                  disabled={!mentor.available}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                    mentor.available
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <UserPlus size={16} className="inline mr-2" />
                  {mentor.available ? 'Connect' : 'Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'discussions' && (
        <div className="max-w-4xl mx-auto">
          {/* New Discussion */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Start a New Discussion</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Discussion title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <div className="flex space-x-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>General</option>
                  <option>Public Speaking</option>
                  <option>Self Discovery</option>
                  <option>Time Management</option>
                  <option>Teamwork</option>
                  <option>Leadership</option>
                </select>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                  Start Discussion
                </button>
              </div>
            </div>
          </div>

          {/* Discussions List */}
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${
                discussion.pinned ? 'border-purple-200 bg-purple-50' : ''
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {discussion.pinned && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded font-medium">
                          Pinned
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {discussion.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{discussion.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Started by {discussion.author}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <MessageCircle size={14} className="mr-1" />
                        <span>{discussion.replies} replies</span>
                      </div>
                      <span>•</span>
                      <span>{discussion.lastActivity}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-purple-600 text-sm font-medium hover:bg-purple-50 rounded transition-colors">
                    Join Discussion
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;