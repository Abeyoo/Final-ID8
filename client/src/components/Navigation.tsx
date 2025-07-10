import React from 'react';
import { 
  LayoutDashboard, 
  Brain, 
  Target, 
  Users, 
  Trophy, 
  Award, 
  MessageCircle,
  Menu,
  X,
  Search,
  Kanban,
  Bot,
  LogOut
} from 'lucide-react';

type ActiveSection = 'dashboard' | 'assessment' | 'development' | 'team' | 'opportunities' | 'achievements' | 'community' | 'team-finder' | 'project-board' | 'ai-chat';

interface NavigationProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  userProfile?: any;
  onSignOut?: () => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assessment', label: 'Know Yourself', icon: Brain },
  { id: 'development', label: 'Goals', icon: Target },
  { id: 'team-finder', label: 'Team Finder', icon: Search },
  { id: 'team', label: 'Team Collaboration', icon: Users },
  { id: 'project-board', label: 'Project Board', icon: Kanban },
  { id: 'opportunities', label: 'Opportunities', icon: Trophy },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'community', label: 'Community', icon: MessageCircle },
  { id: 'ai-chat', label: 'AI Assistant', icon: Bot },
];

const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection, userProfile, onSignOut }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex-shrink-0 p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Thinkle
            </h1>
            <p className="text-sm text-gray-600 mt-1">Discover Your Potential</p>
          </div>

          {/* Navigation Items - Scrollable */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as ActiveSection);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {userProfile?.name ? userProfile.name.split(' ').map((n: string) => n[0]).join('') : 'JD'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{userProfile?.name || 'John Doe'}</p>
                <p className="text-sm text-gray-600">
                  {userProfile?.grade ? `Grade ${userProfile.grade}` : 'Grade 11'}
                </p>
              </div>
            </div>
            
            {/* Sign Out Button */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="w-full flex items-center px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
        />
      )}
    </>
  );
};

export default Navigation;