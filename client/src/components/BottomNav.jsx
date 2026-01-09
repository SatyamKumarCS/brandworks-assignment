import { Home, Ticket, History, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'ticket', label: 'Ticket', icon: Ticket, path: '/ticket', disabled: true },
    { id: 'history', label: 'History', icon: History, path: '/history' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const tab = tabs.find(t => t.path === currentPath);
    return tab?.id || 'home';
  };

  const activeTab = getActiveTab();

  return (
    <nav className="bg-white border-t border-gray-200 px-2 py-1.5 flex-shrink-0">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && navigate(tab.path)}
              disabled={tab.disabled}
              className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${
                tab.disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : isActive
                    ? 'text-indigo-600'
                    : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-medium' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
