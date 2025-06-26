import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SelfAssessment from './components/SelfAssessment';
import DevelopmentPlans from './components/DevelopmentPlans';
import TeamCollaboration from './components/TeamCollaboration';
import Opportunities from './components/Opportunities';
import Achievements from './components/Achievements';
import Schedule from './components/Schedule';
import Community from './components/Community';
import Onboarding from './components/Onboarding';
import SignIn from './components/SignIn';
import TeamFinder from './components/TeamFinder';
import ProjectBoard from './components/ProjectBoard';
import AIChat from './components/AIChat';
import Portfolio from './components/Portfolio';

type ActiveSection = 'dashboard' | 'assessment' | 'development' | 'team' | 'opportunities' | 'achievements' | 'schedule' | 'community' | 'team-finder' | 'project-board' | 'ai-chat' | 'portfolio';

function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check localStorage for previous onboarding completion
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('id8_onboarding_completed');
    const savedProfile = localStorage.getItem('id8_user_profile');
    
    if (onboardingCompleted === 'true') {
      setIsOnboarded(true);
    }
    
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
  }, []);

  // Save onboarding status to localStorage
  useEffect(() => {
    if (isOnboarded) {
      localStorage.setItem('id8_onboarding_completed', 'true');
    }
  }, [isOnboarded]);

  // Save user profile to localStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('id8_user_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const handleOnboardingComplete = (profile: any) => {
    setUserProfile(profile);
    setIsOnboarded(true);
    setIsAuthenticated(true);
    setShowOnboarding(false);
  };

  const handleSignIn = (profile: any) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
  };

  const handleGoToOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleBackToSignIn = () => {
    setShowOnboarding(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    // Note: We keep isOnboarded as true so they go to sign-in, not onboarding
  };

  // Show onboarding for new users who clicked "Create account"
  if (showOnboarding) {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete} 
        onBackToSignIn={handleBackToSignIn}
      />
    );
  }

  // Show sign-in by default for unauthenticated users
  if (!isAuthenticated) {
    return (
      <SignIn 
        onSignIn={handleSignIn} 
        onGoToOnboarding={handleGoToOnboarding}
      />
    );
  }

  // Show main application for authenticated users
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard userProfile={userProfile} />;
      case 'assessment':
        return <SelfAssessment />;
      case 'development':
        return <DevelopmentPlans />;
      case 'team':
        return <TeamCollaboration />;
      case 'team-finder':
        return <TeamFinder />;
      case 'project-board':
        return <ProjectBoard />;
      case 'opportunities':
        return <Opportunities />;
      case 'achievements':
        return <Achievements />;
      case 'portfolio':
        return <Portfolio userProfile={userProfile} />;
      case 'schedule':
        return <Schedule />;
      case 'community':
        return <Community />;
      case 'ai-chat':
        return <AIChat userProfile={userProfile} />;
      default:
        return <Dashboard userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        userProfile={userProfile}
        onSignOut={handleSignOut}
      />
      <main className="ml-0 lg:ml-64 min-h-screen">
        {renderSection()}
      </main>
    </div>
  );
}

export default App;