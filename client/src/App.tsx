import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SelfAssessment from './components/SelfAssessment';
import DevelopmentPlans from './components/DevelopmentPlans';
import TeamCollaboration from './components/TeamCollaboration';
import Opportunities from './components/Opportunities';
import Achievements from './components/Achievements';
import Schedule from './components/Schedule';
import Community from './components/Community';
import TeamFinder from './components/TeamFinder';
import ProjectBoard from './components/ProjectBoard';
import AIChat from './components/AIChat';
import Portfolio from './components/Portfolio';
import Onboarding from './components/Onboarding';
import AuthChoice from './components/AuthChoice';
import SignUp from './components/SignUp';

type ActiveSection = 'dashboard' | 'assessment' | 'development' | 'team' | 'opportunities' | 'achievements' | 'schedule' | 'community' | 'team-finder' | 'project-board' | 'ai-chat' | 'portfolio';

// Landing page component for logged-out users
function Landing({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Your Potential with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Thinkle</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered student development platform that helps you assess your personality, 
            set meaningful goals, collaborate with teams, and discover amazing opportunities.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button 
              onClick={onGetStarted}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started
            </button>
          </div>
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-purple-600 text-xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Personality Analysis</h3>
              <p className="text-gray-600">Discover your strengths and personality type with our advanced AI assessment system.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-600 text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Goal Tracking</h3>
              <p className="text-gray-600">Set, track, and achieve your academic and personal development goals.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-indigo-600 text-xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-600">Connect with peers and work together on meaningful projects and competitions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Home page component for logged-in users
function Home({ userProfile, activeSection, setActiveSection }: {
  userProfile: any;
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
}) {
  const handleSignOut = () => {
    window.location.href = '/api/logout';
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard userProfile={userProfile} />;
      case 'assessment':
        return <SelfAssessment userProfile={userProfile} />;
      case 'development':
        return <DevelopmentPlans userProfile={userProfile} />;
      case 'team':
        return <TeamCollaboration onNavigateToProject={(projectId) => setActiveSection('project-board')} userProfile={userProfile} />;
      case 'team-finder':
        return <TeamFinder />;
      case 'project-board':
        return <ProjectBoard userProfile={userProfile} />;
      case 'opportunities':
        return <Opportunities />;
      case 'achievements':
        return <Achievements />;
      case 'schedule':
        return <Schedule />;
      case 'community':
        return <Community />;
      case 'ai-chat':
        return <AIChat userProfile={userProfile} />;
      case 'portfolio':
        return <Portfolio userProfile={userProfile} />;
      default:
        return <Dashboard userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userProfile={userProfile}
        onSignOut={handleSignOut}
      />
      <main className="ml-64 p-8">
        {renderActiveSection()}
      </main>
    </div>
  );
}

function App() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'auth-choice' | 'signup'>('landing');
  const [isNewUser, setIsNewUser] = useState(false);

  // Check if new user needs onboarding (no completed assessments and no personality type)
  React.useEffect(() => {
    if (user && user.completedAssessments === 0 && !user.personalityType) {
      if (isNewUser) {
        setShowOnboarding(true);
      }
    }
  }, [user, isNewUser]);

  const handleGetStarted = () => {
    setCurrentView('auth-choice');
  };

  const handleSignIn = () => {
    setIsNewUser(false);
    window.location.href = '/api/login';
  };

  const handleCreateAccount = () => {
    setCurrentView('signup');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleSignUpSuccess = (profile: any) => {
    setIsNewUser(true);
    setShowOnboarding(true);
  };

  const handleBackToAuthChoice = () => {
    setCurrentView('auth-choice');
  };

  const handleSignOut = () => {
    window.location.href = '/api/logout';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-xl">⚡</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (currentView === 'signup') {
      return (
        <SignUp
          onSignUp={handleSignUpSuccess}
          onBackToSignIn={handleBackToAuthChoice}
        />
      );
    }
    if (currentView === 'auth-choice') {
      return (
        <AuthChoice
          onSignIn={handleSignIn}
          onCreateAccount={handleCreateAccount}
          onBack={handleBackToLanding}
        />
      );
    }
    return <Landing onGetStarted={handleGetStarted} />;
  }

  // Show onboarding for new users
  if (showOnboarding) {
    return (
      <Onboarding 
        onComplete={(profile) => {
          setShowOnboarding(false);
          setIsNewUser(false);
          // User profile will be updated through the API
        }}
        onBackToSignIn={() => {
          window.location.href = '/api/logout';
        }}
      />
    );
  }

  return <Home userProfile={user} activeSection={activeSection} setActiveSection={setActiveSection} />;
}

export default App;