import { DashboardPanel } from '../components/DashboardPanel';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gold mb-8">Security</h1>
        
        <div className="max-w-4xl space-y-6">
          {/* Security Status */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-green-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">🔐</span>
              <div>
                <h2 className="text-2xl font-bold text-gold">Security Status: Strong</h2>
                <p className="text-green-400">Your account is well protected</p>
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">Two-Factor Authentication</h2>
            <p className="text-frosted-mint mb-4">Add an extra layer of security to your account</p>
            <button className="px-6 py-3 bg-gold text-midnight-violet rounded-lg font-semibold hover:bg-faded-copper transition">
              Enable 2FA
            </button>
          </div>

          {/* Active Sessions */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">Active Sessions</h2>
            <div className="space-y-3">
              {[
                { device: 'Chrome on Windows', location: 'New York, US', time: 'Active now', current: true },
                { device: 'Safari on iPhone', location: 'New York, US', time: '2 hours ago', current: false },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                  <div>
                    <div className="text-frosted-mint font-semibold">{session.device}</div>
                    <div className="text-faded-copper text-sm">{session.location} • {session.time}</div>
                  </div>
                  {!session.current && (
                    <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition">
                      Revoke
                    </button>
                  )}
                  {session.current && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-frosted-mint mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-frosted-mint mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                />
              </div>
              <button className="px-6 py-3 bg-gold text-midnight-violet rounded-lg font-semibold hover:bg-faded-copper transition">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
