import React, { useState, useEffect } from 'react';
import { Trophy, Search, Filter, MapPin, Calendar, Users, ExternalLink, Brain, Sparkles, X, Clock, Award, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';

const Opportunities: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);
  const [hidePastDeadlines, setHidePastDeadlines] = useState(false);
  const [showAllOpportunities, setShowAllOpportunities] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);

  // Fetch AI-powered opportunity recommendations
  const { data: aiRecommendations = [], isLoading: isLoadingAI } = useQuery({
    queryKey: ['/api/opportunities/recommendations', user?.id],
    enabled: showAIRecommendations && !!user?.id,
  });

  const trackOpportunityInteraction = async (
    opportunity: any, 
    actionType: 'viewed' | 'applied' | 'bookmarked' | 'shared'
  ) => {
    try {
      await fetch('/api/opportunities/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
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

  const handleApplyNow = async (opportunity: any) => {
    await trackOpportunityInteraction(opportunity, 'applied');
    
    // For AI recommendations, try to find matching opportunity with URL
    let opportunityWithUrl = opportunity;
    if (opportunity.aiGenerated) {
      const matchingOpp = opportunities.find(opp => 
        opp.title.toLowerCase().includes(opportunity.title.toLowerCase().split(' ').slice(0, 2).join(' ')) ||
        opportunity.title.toLowerCase().includes(opp.title.toLowerCase().split(' ').slice(0, 2).join(' '))
      );
      if (matchingOpp) {
        opportunityWithUrl = { ...opportunity, url: matchingOpp.url, applicationUrl: matchingOpp.applicationUrl };
      }
    }
    
    // Open application URL if available
    if (opportunityWithUrl.applicationUrl) {
      console.log(`Opening application page for ${opportunity.title}: ${opportunityWithUrl.applicationUrl}`);
      window.open(opportunityWithUrl.applicationUrl, '_blank', 'noopener,noreferrer');
    } else if (opportunityWithUrl.url) {
      console.log(`Opening info page for ${opportunity.title}: ${opportunityWithUrl.url}`);
      window.open(opportunityWithUrl.url, '_blank', 'noopener,noreferrer');
    } else {
      // For opportunities without URLs, provide more helpful guidance
      const searchQuery = encodeURIComponent(`${opportunity.title} application`);
      const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
      console.log(`No direct URL available, opening Google search for ${opportunity.title}`);
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleLearnMore = async (opportunity: any) => {
    await trackOpportunityInteraction(opportunity, 'viewed');
    
    // For AI recommendations, try to find matching opportunity with URL
    let opportunityWithUrl = opportunity;
    if (opportunity.aiGenerated) {
      const matchingOpp = opportunities.find(opp => 
        opp.title.toLowerCase().includes(opportunity.title.toLowerCase().split(' ').slice(0, 2).join(' ')) ||
        opportunity.title.toLowerCase().includes(opp.title.toLowerCase().split(' ').slice(0, 2).join(' '))
      );
      if (matchingOpp) {
        opportunityWithUrl = { ...opportunity, url: matchingOpp.url, applicationUrl: matchingOpp.applicationUrl };
      }
    }
    
    // Open info URL if available
    if (opportunityWithUrl.url) {
      window.open(opportunityWithUrl.url, '_blank');
    } else {
      // Show detailed modal for opportunities without URLs
      setSelectedOpportunity(opportunityWithUrl);
    }
  };

  const opportunities = [
    {
      id: 1,
      title: 'National Merit Scholarship Program',
      type: 'Scholarship',
      category: 'Academic',
      description: 'Prestigious scholarship program based on PSAT/NMSQT scores. Recognizes top academic achievers nationwide.',
      deadline: '2025-10-15',
      location: 'National',
      participants: '1.6 million students',
      prizes: '$2,500 - Full tuition',
      requirements: ['PSAT/NMSQT score', 'High school senior', 'US citizen'],
      match: 92,
      featured: true,
      url: 'https://www.nationalmerit.org/',
      applicationUrl: 'https://www.nationalmerit.org/s/1758/interior.aspx?sid=1758&gid=2&pgid=424'
    },
    {
      id: 2,
      title: 'Congressional Art Competition',
      type: 'Competition',
      category: 'Arts',
      description: 'Annual nationwide art competition for high school students with winners displayed in US Capitol.',
      deadline: '2025-04-30',
      location: 'Congressional districts',
      participants: '650+ districts',
      prizes: 'Capitol display + recognition',
      requirements: ['High school student', 'Original artwork', 'District entry'],
      match: 85,
      featured: true,
      url: 'https://www.house.gov/representatives/find-your-representative',
      applicationUrl: 'https://www.house.gov/representatives/find-your-representative'
    },
    {
      id: 3,
      title: 'National Honor Society',
      type: 'Program',
      category: 'Academic',
      description: 'Prestigious organization recognizing outstanding high school students in scholarship, service, leadership, and character.',
      deadline: 'School-based',
      location: 'Local schools',
      participants: '1 million+ members',
      prizes: 'Recognition + scholarships',
      requirements: ['3.0+ GPA', 'Service hours', 'Leadership activities'],
      match: 88,
      featured: false,
      url: 'https://www.nhs.us/',
      applicationUrl: 'https://www.nhs.us/students/how-to-join/'
    },
    {
      id: 4,
      title: 'DECA International Competition',
      type: 'Competition',
      category: 'Business',
      description: 'World-renowned business competition with role-plays, written events, and entrepreneurship challenges.',
      deadline: '2025-04-25',
      location: 'Anaheim, CA',
      participants: '20,000+ students',
      prizes: 'Scholarships + internships',
      requirements: ['DECA membership', 'Qualify through state', 'Business coursework'],
      match: 80,
      featured: false,
      url: 'https://www.deca.org/',
      applicationUrl: 'https://www.deca.org/high-school-division/start-chapter/'
    },
    {
      id: 5,
      title: 'FIRST Robotics Competition',
      type: 'Competition',
      category: 'Technology',
      description: 'International high school robotics competition combining sports excitement with science and technology.',
      deadline: '2025-01-08',
      location: 'Worldwide regionals',
      participants: '4,000+ teams globally',
      prizes: '$80,000+ in scholarships',
      requirements: ['High school team', '6-week build season', 'Mentor guidance'],
      match: 91,
      featured: true,
      url: 'https://www.firstinspires.org/robotics/frc',
      applicationUrl: 'https://www.firstinspires.org/robotics/frc/how-to-start-a-team'
    },
    {
      id: 6,
      title: 'AP Scholar Awards',
      type: 'Recognition',
      category: 'Academic',
      description: 'Recognition program for students who demonstrate excellence on AP Exams across multiple subjects.',
      deadline: 'Automatic (based on AP scores)',
      location: 'National',
      participants: '100,000+ annually',
      prizes: 'Certificate + college recognition',
      requirements: ['3+ on AP exams', 'Multiple AP subjects', 'High school student'],
      match: 86,
      featured: false
    },
    {
      id: 7,
      title: 'National Science Bowl',
      type: 'Competition',
      category: 'Science',
      description: 'Academic competition testing knowledge in biology, chemistry, earth science, physics, energy, and math.',
      deadline: '2025-01-31',
      location: 'Washington, DC',
      participants: '4,500+ students',
      prizes: '$5,000 scholarships',
      requirements: ['4-member team', 'Grades 9-12', 'Regional qualification'],
      match: 89,
      featured: false,
      url: 'https://science.osti.gov/wdts/nsb',
      applicationUrl: 'https://science.osti.gov/wdts/nsb/High-School-Science-Bowl/Resources/How-to-Start-a-Team'
    },
    {
      id: 8,
      title: 'Scholastic Art & Writing Awards',
      type: 'Competition',
      category: 'Arts',
      description: 'The longest-running recognition program for creative teens in visual art and writing.',
      deadline: '2025-01-15',
      location: 'Regional + national',
      participants: '300,000+ submissions',
      prizes: '$10,000 scholarships',
      requirements: ['Grades 7-12', 'Original creative work', 'Regional submission'],
      match: 83,
      featured: false,
      url: 'https://www.artandwriting.org/',
      applicationUrl: 'https://www.artandwriting.org/submit/'
    },
    {
      id: 9,
      title: 'Quiz Bowl National Championship',
      type: 'Competition',
      category: 'Academic',
      description: 'Fast-paced buzzer competition testing knowledge across academic subjects and popular culture.',
      deadline: '2025-05-30',
      location: 'Chicago, IL',
      participants: '2,500+ teams',
      prizes: 'National recognition + trophies',
      requirements: ['4-6 member team', 'Regional qualification', 'Broad knowledge base'],
      match: 78,
      featured: false
    },
    {
      id: 10,
      title: 'Model United Nations',
      type: 'Program',
      category: 'Leadership',
      description: 'Simulation of UN proceedings where students debate current world issues and draft resolutions.',
      deadline: 'Conference-specific',
      location: 'Multiple cities',
      participants: '400,000+ students',
      prizes: 'Leadership experience + awards',
      requirements: ['Research skills', 'Public speaking', 'Country/committee assignment'],
      match: 81,
      featured: false
    },
    {
      id: 11,
      title: 'Google Code-in Contest',
      type: 'Competition',
      category: 'Technology',
      description: 'Contest introducing pre-university students to open source software development.',
      deadline: '2024-12-01',
      location: 'Virtual',
      participants: '1,300+ students',
      prizes: 'T-shirts + grand prize trip',
      requirements: ['Ages 13-17', 'Programming skills', 'Open source contribution'],
      match: 94,
      featured: false
    },
    {
      id: 12,
      title: 'Regeneron Science Talent Search',
      type: 'Competition',
      category: 'Science',
      description: 'The nation\'s oldest and most prestigious science and math competition for high school seniors.',
      deadline: '2024-11-15',
      location: 'Washington, DC',
      participants: '1,800+ applicants',
      prizes: '$250,000 top prize',
      requirements: ['High school senior', 'Independent research project', '3.0+ GPA'],
      match: 87,
      featured: false
    },
    {
      id: 13,
      title: 'National History Day Competition',
      type: 'Competition',
      category: 'Academic',
      description: 'Students research historical topics related to an annual theme and present findings.',
      deadline: '2025-03-01',
      location: 'College Park, MD',
      participants: '500,000+ students',
      prizes: 'Scholarships + recognition',
      requirements: ['Grades 6-12', 'Historical research', 'Theme-based project'],
      match: 76,
      featured: false
    },
    {
      id: 14,
      title: 'Future Business Leaders of America',
      type: 'Competition',
      category: 'Business',
      description: 'Competitive events in business, finance, hospitality, and information technology.',
      deadline: '2025-04-20',
      location: 'Multiple locations',
      participants: '230,000+ members',
      prizes: 'Scholarships + internships',
      requirements: ['FBLA membership', 'Business coursework', 'Competition participation'],
      match: 83,
      featured: false
    },
    {
      id: 15,
      title: 'Intel International Science and Engineering Fair',
      type: 'Competition',
      category: 'Science',
      description: 'World\'s largest international pre-college science competition.',
      deadline: '2024-10-30',
      location: 'Phoenix, AZ',
      participants: '1,800+ students from 75+ countries',
      prizes: '$8 million in prizes',
      requirements: ['Regional qualification', 'Independent research', 'Science fair project'],
      match: 91,
      featured: false
    },
    {
      id: 16,
      title: 'SkillsUSA Championships',
      type: 'Competition',
      category: 'Technology',
      description: 'National competition showcasing career and technical education skills.',
      deadline: '2025-05-10',
      location: 'Atlanta, GA',
      participants: '6,000+ students',
      prizes: 'Scholarships + industry recognition',
      requirements: ['SkillsUSA membership', 'Technical skills', 'State qualification'],
      match: 79,
      featured: false
    },
    {
      id: 17,
      title: 'Poetry Out Loud National Recitation Contest',
      type: 'Competition',
      category: 'Arts',
      description: 'National poetry recitation competition encouraging students to learn about poetry.',
      deadline: '2024-12-15',
      location: 'Washington, DC',
      participants: '365,000+ students',
      prizes: '$20,000 scholarship',
      requirements: ['Grades 9-12', 'Poetry memorization', 'State qualification'],
      match: 72,
      featured: false
    },
    {
      id: 18,
      title: 'National Beta Club Convention',
      type: 'Program',
      category: 'Leadership',
      description: 'Leadership development and service organization for high achieving students.',
      deadline: '2025-06-25',
      location: 'Multiple cities',
      participants: '500,000+ members',
      prizes: 'Scholarships + leadership awards',
      requirements: ['3.0+ GPA', 'Character standards', 'Service hours'],
      match: 84,
      featured: false
    },
    {
      id: 19,
      title: 'Technology Student Association Competition',
      type: 'Competition',
      category: 'Technology',
      description: 'STEM competitions promoting technological literacy and innovation.',
      deadline: '2025-03-15',
      location: 'Multiple states',
      participants: '200,000+ members',
      prizes: 'Scholarships + recognition',
      requirements: ['TSA membership', 'STEM project', 'Regional qualification'],
      match: 88,
      featured: false
    },
    {
      id: 20,
      title: 'National FFA Convention',
      type: 'Competition',
      category: 'Agriculture',
      description: 'Agricultural education and leadership development through hands-on learning.',
      deadline: '2025-04-05',
      location: 'Indianapolis, IN',
      participants: '760,000+ members',
      prizes: 'Scholarships + career opportunities',
      requirements: ['FFA membership', 'Agricultural education', 'Leadership project'],
      match: 73,
      featured: false
    },
    {
      id: 21,
      title: 'National Latin Exam Competition',
      type: 'Competition',
      category: 'Academic',
      description: 'Annual Latin examination testing knowledge of Latin language and Roman culture.',
      deadline: '2024-11-01',
      location: 'Schools nationwide',
      participants: '134,000+ students',
      prizes: 'Recognition + scholarships',
      requirements: ['Latin coursework', 'School participation', 'Language proficiency'],
      match: 69,
      featured: false
    },
    {
      id: 22,
      title: 'National Geographic Bee',
      type: 'Competition',
      category: 'Academic',
      description: 'Geography competition testing knowledge of world geography and current events.',
      deadline: '2024-09-30',
      location: 'Washington, DC',
      participants: '2.6 million students',
      prizes: '$50,000 scholarship',
      requirements: ['Grades 4-8', 'School qualification', 'Geography knowledge'],
      match: 77,
      featured: false
    },
    {
      id: 23,
      title: 'MIT Research Science Institute (RSI)',
      type: 'Summer Program',
      category: 'Science',
      description: 'Prestigious 6-week summer research program in science, technology, engineering, and mathematics.',
      deadline: '2025-01-24',
      location: 'MIT, Cambridge, MA',
      participants: '80 students worldwide',
      prizes: 'Full scholarship + research mentorship',
      requirements: ['Rising high school seniors', 'Exceptional STEM aptitude', 'Research interest'],
      match: 95,
      featured: true,
      url: 'https://www.cee.org/research-science-institute',
      applicationUrl: 'https://www.cee.org/research-science-institute'
    },
    {
      id: 24,
      title: 'Harvard Summer School',
      type: 'Summer Program',
      category: 'Academic',
      description: 'College-level courses at Harvard University for high school students.',
      deadline: '2025-04-30',
      location: 'Harvard University, Cambridge, MA',
      participants: '3,000+ students',
      prizes: 'College credit + Harvard experience',
      requirements: ['High school students', 'Strong academic record', 'Application essay'],
      match: 85,
      featured: false,
      url: 'https://www.summer.harvard.edu/',
      applicationUrl: 'https://www.summer.harvard.edu/high-school-programs'
    },
    {
      id: 25,
      title: 'Stanford Summer Humanities Institute',
      type: 'Summer Program',
      category: 'Academic',
      description: 'Intensive 8-week program exploring humanities through seminars, research, and creative projects.',
      deadline: '2025-02-15',
      location: 'Stanford University, CA',
      participants: '30 students',
      prizes: 'Full scholarship + mentorship',
      requirements: ['Rising seniors', 'Interest in humanities', 'Academic excellence'],
      match: 82,
      featured: true,
      url: 'https://shsi.stanford.edu/',
      applicationUrl: 'https://shsi.stanford.edu/apply'
    },
    {
      id: 26,
      title: 'NASA USRP Internship Program',
      type: 'Summer Program',
      category: 'Science',
      description: 'Undergraduate Student Research Program offering hands-on NASA research experience.',
      deadline: '2025-03-01',
      location: 'NASA Centers nationwide',
      participants: '1,000+ interns',
      prizes: 'Paid internship + mentorship',
      requirements: ['College freshmen+', 'STEM major', 'US citizenship'],
      match: 93,
      featured: true,
      url: 'https://www.nasa.gov/learning/students/internships/',
      applicationUrl: 'https://intern.nasa.gov/'
    },
    {
      id: 27,
      title: 'Google Computer Science Summer Institute',
      type: 'Summer Program',
      category: 'Technology',
      description: 'Intensive computer science program for underrepresented students in tech.',
      deadline: '2025-04-15',
      location: 'Google offices nationwide',
      participants: '200+ students',
      prizes: 'Full scholarship + Google mentorship',
      requirements: ['Rising college seniors', 'CS major', 'Underrepresented background'],
      match: 88,
      featured: false,
      url: 'https://buildyourfuture.withgoogle.com/programs/computer-science-summer-institute',
      applicationUrl: 'https://buildyourfuture.withgoogle.com/programs/computer-science-summer-institute'
    },
    {
      id: 28,
      title: 'Yale Young Global Scholars',
      type: 'Summer Program',
      category: 'Leadership',
      description: 'Academic enrichment program for outstanding high school students worldwide.',
      deadline: '2025-01-10',
      location: 'Yale University, New Haven, CT',
      participants: '1,800+ students',
      prizes: 'Certificate + Yale experience',
      requirements: ['Rising juniors/seniors', 'Academic excellence', 'Global perspective'],
      match: 79,
      featured: false,
      url: 'https://globalscholars.yale.edu/',
      applicationUrl: 'https://globalscholars.yale.edu/apply'
    },
    {
      id: 29,
      title: 'Telluride Summer Programs',
      type: 'Summer Program',
      category: 'Academic',
      description: 'Free liberal arts seminars covering topics in humanities, social sciences, and critical thinking.',
      deadline: '2025-01-31',
      location: 'Multiple universities',
      participants: '200+ students',
      prizes: 'Full scholarship + intellectual community',
      requirements: ['Rising seniors', 'Critical thinking skills', 'Diverse perspectives'],
      match: 86,
      featured: true,
      url: 'https://www.tellurideassociation.org/programs/high-school-students/',
      applicationUrl: 'https://www.tellurideassociation.org/programs/high-school-students/'
    },
    {
      id: 30,
      title: 'Johns Hopkins CTY Summer Programs',
      type: 'Summer Program',
      category: 'Academic',
      description: 'Center for Talented Youth offering intensive academic courses for gifted students.',
      deadline: '2025-05-01',
      location: 'Multiple university campuses',
      participants: '10,000+ students',
      prizes: 'College credit + academic acceleration',
      requirements: ['High ability students', 'Qualifying test scores', 'Academic readiness'],
      match: 84,
      featured: false,
      url: 'https://cty.jhu.edu/programs/',
      applicationUrl: 'https://cty.jhu.edu/programs/'
    },
    {
      id: 31,
      title: 'Bank of America Student Leaders',
      type: 'Summer Program',
      category: 'Leadership',
      description: 'Paid summer internship program focused on leadership development and community service.',
      deadline: '2025-02-28',
      location: 'Major cities nationwide',
      participants: '300+ students',
      prizes: '$5,000 + leadership summit',
      requirements: ['Rising seniors', 'Community service', 'Leadership potential'],
      match: 76,
      featured: false,
      url: 'https://about.bankofamerica.com/en/making-an-impact/student-leaders',
      applicationUrl: 'https://about.bankofamerica.com/en/making-an-impact/student-leaders'
    },
    {
      id: 32,
      title: 'Carnegie Mellon SAMS Program',
      type: 'Summer Program',
      category: 'Technology',
      description: 'Summer Academy for Math and Science for underrepresented minorities in STEM.',
      deadline: '2025-04-01',
      location: 'Carnegie Mellon University, Pittsburgh, PA',
      participants: '120 students',
      prizes: 'Full scholarship + college prep',
      requirements: ['Rising seniors', 'Underrepresented minorities', 'STEM interest'],
      match: 91,
      featured: true,
      url: 'https://www.cmu.edu/pre-college/academic-programs/sams.html',
      applicationUrl: 'https://www.cmu.edu/pre-college/academic-programs/sams.html'
    },
    {
      id: 33,
      title: 'Minority Introduction to Engineering and Science (MITES)',
      type: 'Summer Program',
      category: 'Science',
      description: 'MIT rigorous six-week residential STEM program for underrepresented high school students.',
      deadline: '2025-02-01',
      location: 'MIT, Cambridge, MA',
      participants: '80 students',
      prizes: 'Full scholarship + MIT experience',
      requirements: ['Rising seniors', 'Underrepresented minorities', 'STEM excellence'],
      match: 94,
      featured: true,
      url: 'https://oeop.mit.edu/programs/mites',
      applicationUrl: 'https://oeop.mit.edu/programs/mites'
    }
  ];

  const categories = ['all', 'Academic', 'Science', 'Leadership', 'Arts', 'Technology', 'Business', 'Agriculture'];

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
    
    // Check if deadline has passed
    const deadlineDate = new Date(opp.deadline);
    const currentDate = new Date();
    const isExpired = deadlineDate < currentDate;
    const matchesDeadline = !hidePastDeadlines || !isExpired;
    
    return matchesSearch && matchesCategory && matchesDeadline;
  });

  // Show only first 6 opportunities initially, or all if showAllOpportunities is true
  const displayedOpportunities = showAllOpportunities ? filteredOpportunities : filteredOpportunities.slice(0, 6);

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
          <button
            onClick={() => setHidePastDeadlines(!hidePastDeadlines)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              hidePastDeadlines 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar size={16} />
            <span>Hide Past Deadlines</span>
          </button>
        </div>
      </div>

      {/* AI Recommendations */}
      {showAIRecommendations && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Brain size={24} className="text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">AI-Personalized For You</h2>
              <Sparkles size={16} className="text-purple-600" />
            </div>
            <button
              onClick={() => setShowAIRecommendations(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Hide Recommendations
            </button>
          </div>
          
          {isLoadingAI ? (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-purple-700">AI is analyzing your profile to find perfect opportunities...</span>
              </div>
            </div>
          ) : aiRecommendations && Array.isArray(aiRecommendations) && aiRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiRecommendations.slice(0, 6).map((opportunity: any) => (
                <div key={opportunity.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                        AI Match
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">{opportunity.match}%</div>
                      <div className="text-xs text-purple-500">Match</div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{opportunity.category}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{opportunity.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      <span>Due: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={12} className="mr-1" />
                      <span>{opportunity.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {(() => {
                      const deadlineDate = new Date(opportunity.deadline);
                      const currentDate = new Date();
                      const isExpired = deadlineDate < currentDate;
                      
                      return (
                        <button 
                          onClick={() => isExpired ? handleLearnMore(opportunity) : handleApplyNow(opportunity)}
                          className={`w-full px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                            isExpired 
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                          }`}
                          disabled={isExpired}
                        >
                          {isExpired ? 'Application Closed' : 'Apply Now'}
                        </button>
                      );
                    })()}
                    <button 
                      onClick={() => handleLearnMore(opportunity)}
                      className="w-full px-3 py-1.5 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-xs flex items-center justify-center"
                    >
                      <ExternalLink size={12} className="mr-1" />
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Brain size={48} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Building Your Profile</h3>
              <p className="text-gray-600">
                Complete assessments and set goals to get personalized AI recommendations.
              </p>
            </div>
          )}
        </div>
      )}

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
          {displayedOpportunities.map((opportunity) => {
            const deadlineDate = new Date(opportunity.deadline);
            const currentDate = new Date();
            const isExpired = deadlineDate < currentDate;
            
            return (
              <div key={opportunity.id} className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
                isExpired ? 'border-red-200 opacity-75' : 'border-gray-200'
              }`}>
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
                      {(() => {
                        const deadlineDate = new Date(opportunity.deadline);
                        const currentDate = new Date();
                        const isExpired = deadlineDate < currentDate;
                        return isExpired ? (
                          <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                            Expired
                          </span>
                        ) : null;
                      })()}
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
                    {(() => {
                      const deadlineDate = new Date(opportunity.deadline);
                      const currentDate = new Date();
                      const isExpired = deadlineDate < currentDate;
                      
                      return (
                        <button 
                          onClick={() => isExpired ? handleLearnMore(opportunity) : handleApplyNow(opportunity)}
                          className={`w-full px-4 py-2 rounded-lg transition-all text-sm ${
                            isExpired 
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                          }`}
                          disabled={isExpired}
                        >
                          {isExpired ? 'Application Closed' : 'Apply Now'}
                        </button>
                      );
                    })()}
                    <button 
                      onClick={() => handleLearnMore(opportunity)}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
              </div>
            );
          })}
        </div>
        
        {/* Show More Button */}
        {filteredOpportunities.length > 6 && (
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
              <div className="mb-4">
                <p className="text-gray-700 text-sm">
                  {showAllOpportunities 
                    ? `Showing all ${filteredOpportunities.length} opportunities` 
                    : `Showing 6 of ${filteredOpportunities.length} opportunities`}
                </p>
              </div>
              <button
                onClick={() => setShowAllOpportunities(!showAllOpportunities)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium inline-flex items-center space-x-2"
              >
                {showAllOpportunities ? (
                  <>
                    <span>Show Less</span>
                    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Show {filteredOpportunities.length - 6} More Opportunities</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Detailed Opportunity Modal */}
        {selectedOpportunity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedOpportunity.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{selectedOpportunity.type}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{selectedOpportunity.category}</span>
                      <span className="text-green-600 font-medium">{selectedOpportunity.match}% Match</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedOpportunity(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedOpportunity.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">Deadline:</span>
                        <span className="font-medium">{selectedOpportunity.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="font-medium">{selectedOpportunity.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">Participants:</span>
                        <span className="font-medium">{selectedOpportunity.participants}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Award size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">Prizes:</span>
                        <span className="font-medium">{selectedOpportunity.prizes}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
                    <ul className="space-y-1">
                      {selectedOpportunity.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    {(() => {
                      const deadlineDate = new Date(selectedOpportunity.deadline);
                      const currentDate = new Date();
                      const isExpired = deadlineDate < currentDate;
                      
                      return (
                        <>
                          <button 
                            onClick={() => {
                              setSelectedOpportunity(null);
                              handleApplyNow(selectedOpportunity);
                            }}
                            className={`flex-1 px-4 py-2 rounded-lg transition-all text-sm ${
                              isExpired 
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                            }`}
                            disabled={isExpired}
                          >
                            {isExpired ? 'Application Closed' : 'Apply Now'}
                          </button>
                          {selectedOpportunity.url && (
                            <button 
                              onClick={() => {
                                setSelectedOpportunity(null);
                                window.open(selectedOpportunity.url, '_blank');
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
                            >
                              <ExternalLink size={14} className="mr-1" />
                              Visit Website
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;