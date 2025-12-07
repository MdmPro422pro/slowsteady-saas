import { useState } from 'react';
import { Link } from 'react-router-dom';

export function DashboardPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📝', label: 'My Contracts', path: '/contracts' },
    { icon: '💳', label: 'Payments', path: '/payments' },
    { icon: '📈', label: 'Analytics', path: '/analytics' },
    { icon: '💧', label: 'Faucets', path: '/faucets' },
    { icon: '🛒', label: 'Marketplace', path: '/marketplace' },
    { icon: '👥', label: 'Team', path: '/team' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
    { icon: '📚', label: 'Documentation', path: '/docs' },
    { icon: '💬', label: 'Support', path: '/support' },
    { icon: '🔔', label: 'Notifications', path: '/notifications' },
    { icon: '🔐', label: 'Security', path: '/security' },
  ];

  return (
    <div
      className="fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out"
      style={{
        transform: isOpen ? 'translateX(0)' : 'translateX(-240px)',
      }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Hover trigger area */}
      <div className="absolute left-0 top-0 w-2 h-full" />
      
      {/* Panel */}
      <div className="w-64 h-full bg-midnight-violet border-r-2 border-gold shadow-2xl overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gold mb-6">Dashboard</h2>
          
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-frosted-mint hover:bg-clay-soil transition-all duration-200 group"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium group-hover:text-gold transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-shadow-grey rounded-lg border border-faded-copper">
            <p className="text-xs text-frosted-mint mb-2">Quick Stats</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-frosted-mint">Active Contracts</span>
                <span className="text-gold font-semibold">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-frosted-mint">Total Spent</span>
                <span className="text-gold font-semibold">$48,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
