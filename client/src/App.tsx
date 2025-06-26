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
import SignUp from './components/SignUp';
import TeamFinder from './components/TeamFinder';
import ProjectBoard from './components/ProjectBoard';
import AIChat from './components/AIChat';
import Portfolio from './components/Portfolio';

type ActiveSection = 'dashboard' | 'assessment' | 'development' | 'team' | 'opportunities' | 'achievements' | 'schedule' | 'community' | 'team-finder' | 'project-board' | 'ai-chat' | 'portfolio';

function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

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
  };

  const handleSignIn = (profile: any) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
  };

  const handleGoToSignUp = () => {
    setShowSignUp(true);
  };

  const handleBackToSignIn = () => {
    setShowSignUp(false);
  };

  const handleSignUp = (profile: any) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
    setIsOnboarded(false); // Show onboarding after sign up
    setShowSignUp(false);
  };

  const handleBackToOnboarding = () => {
    // Clear localStorage and reset states for new user
    localStorage.removeItem('id8_onboarding_completed');
    localStorage.removeItem('id8_user_profile');
    setIsOnboarded(false);
    setIsAuthenticated(false);
    setUserProfile(null);
    setShowSignUp(false);
  };

  const handleBackToSignIn = () => {
    // Keep onboarding status but go back to sign in
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    // Note: We keep isOnboarded as true so they go to sign-in, not onboarding
  };

  // Show sign-in as the landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <SignIn 
        onSignIn={handleSignIn} 
        onGoToOnboarding={handleBackToOnboarding}
      />
    );
  }

  // Show onboarding for authenticated users who haven't completed onboarding
  if (!isOnboarded) {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete} 
        onBackToSignIn={handleBackToSignIn}
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