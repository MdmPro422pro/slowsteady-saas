import { DashboardPanel } from '../components/DashboardPanel';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gold mb-8">Settings</h1>
        
        <div className="max-w-4xl space-y-6">
          {/* Account Settings */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-frosted-mint mb-2">Display Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-frosted-mint mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-frosted-mint">Email Notifications</span>
                <button className="px-4 py-2 bg-gold text-midnight-violet rounded-lg font-semibold hover:bg-faded-copper transition">
                  Enabled
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-frosted-mint">Two-Factor Authentication</span>
                <button className="px-4 py-2 bg-clay-soil text-frosted-mint rounded-lg font-semibold hover:bg-faded-copper transition">
                  Disabled
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
