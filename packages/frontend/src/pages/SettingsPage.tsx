import { useState } from 'react';
import { DashboardPanel } from '../components/DashboardPanel';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../lib/toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  // Account Settings State
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Privacy Settings State
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showEmail, setShowEmail] = useState(false);
  const [showActivity, setShowActivity] = useState(true);

  // Display Settings State
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [theme, setTheme] = useState('dark');

  const handleSaveAccount = () => {
    toast.success('Account settings saved successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated');
  };

  const handleSavePrivacy = () => {
    toast.success('Privacy settings updated');
  };

  const handleSaveDisplay = () => {
    toast.success('Display settings updated');
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'display', label: 'Display', icon: '🎨' },
    { id: 'advanced', label: 'Advanced', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gold mb-8">Settings</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gold text-midnight-violet'
                  : 'bg-shadow-grey text-frosted-mint hover:bg-clay-soil'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="max-w-4xl">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
                <h2 className="text-2xl font-bold text-gold mb-6">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-frosted-mint mb-2 font-semibold">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                      placeholder="Your display name"
                    />
                  </div>
                  <div>
                    <label className="block text-frosted-mint mb-2 font-semibold">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-frosted-mint mb-2 font-semibold">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <button
                    onClick={handleSaveAccount}
                    className="px-6 py-3 bg-gold text-midnight-violet rounded-lg font-semibold hover:bg-faded-copper transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
                <h2 className="text-2xl font-bold text-gold mb-4">Connected Accounts</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔗</span>
                      <div>
                        <div className="text-frosted-mint font-semibold">Wallet Address</div>
                        <div className="text-faded-copper text-sm">{(user as any)?.walletAddress || 'Not connected'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🐙</span>
                      <div>
                        <div className="text-frosted-mint font-semibold">GitHub</div>
                        <div className="text-faded-copper text-sm">Not connected</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-clay-soil text-frosted-mint rounded-lg hover:bg-faded-copper transition">
                      Connect
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔵</span>
                      <div>
                        <div className="text-frosted-mint font-semibold">Google</div>
                        <div className="text-faded-copper text-sm">Not connected</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-clay-soil text-frosted-mint rounded-lg hover:bg-faded-copper transition">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
                <h2 className="text-2xl font-bold text-gold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                    <div>
                      <div className="text-frosted-mint font-semibold">Email Notifications</div>
                      <div className="text-faded-copper text-sm">Receive updates via email</div>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        emailNotifications
                          ? 'bg-gold text-midnight-violet'
                          : 'bg-clay-soil text-frosted-mint'
                      }`}
                    >
                      {emailNotifications ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                    <div>
                      <div className="text-frosted-mint font-semibold">SMS Notifications</div>
                      <div className="text-faded-copper text-sm">Get text message alerts</div>
                    </div>
                    <button
                      onClick={() => setSmsNotifications(!smsNotifications)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        smsNotifications
                          ? 'bg-gold text-midnight-violet'
                          : 'bg-clay-soil text-frosted-mint'
                      }`}
                    >
                      {smsNotifications ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                    <div>
                      <div className="text-frosted-mint font-semibold">Push Notifications</div>
                      <div className="text-faded-copper text-sm">Browser notifications</div>
                    </div>
                    <button
                      onClick={() => setPushNotifications(!pushNotifications)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        pushNotifications
                          ? 'bg-gold text-midnight-violet'
                          : 'bg-clay-soil text-frosted-mint'
                      }`}
                    >
                      {pushNotifications ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                    <div>
                      <div className="text-frosted-mint font-semibold">Weekly Digest</div>
                      <div className="text-faded-copper text-sm">Summary of your activity</div>
                    </div>
                    <button
                      onClick={() => setWeeklyDigest(!weeklyDigest)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        weeklyDigest
                          ? 'bg-gold text-midnight-violet'
                          : 'bg-clay-soil text-frosted-mint'
                      }`}
                    >
                      {weeklyDigest ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                    <div>
                      <div className="text-frosted-mint font-semibold">Marketing Emails</div>
                      <div className="text-faded-copper text-sm">Product updates and offers</div>
                    </div>
                    <button
                      onClick={() => setMarketingEmails(!marketingEmails)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        marketingEmails
                          ? 'bg-gold text-midnight-violet'
                          : 'bg-clay-soil text-frosted-mint'
                      }`}
                    >
                      {marketingEmails ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  <button
                    onClick={handleSaveNotifications}
                    className="px-6 py-3 bg-gold text-midnight-violet rounded-lg font-semibold hover:bg-faded-copper transition"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
                <h2 className="text-2xl font-bold text-gold mb-6">Privacy Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-frosted-mint mb-2 font-semibold">Profile Visibility</label>
                    <select
                      value={profileVisibility}
                      onChange={(e) => setProfileVisibility(e.target.value)}
                      className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                    <div>
                      <div className="text-frosted-mint font-semibold">Show Email Address</div>
                      <div className="text-faded-copper text-sm">Display email on your profile</div>
                    </div>
                    <button
                      onClick={() => setShowEmail(!showEmail)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        showEmail
                          ? 'bg-gold text-midnight-violet'
                          : 'bg-clay-soil text-frosted-mint'
                      }`}
                    >
                      {showEmail ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                    <div>
                      <div className="text-frosted-mint font-semibold">Show Activity Status</div>
                      <div className="text-faded-copper text-sm">Let others see when you're online</div>
                    </div>
                    <button
                      onClick={() => setShowActivity(!showActivity)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        showActivity
                          ? 'bg-gold text-midnight-violet'
                          : 'bg-clay-soil text-frosted-mint'
                      }`}
                    >
                      {showActivity ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  <button
                    onClick={handleSavePrivacy}
                    className="px-6 py-3 bg-gold text-midnight-violet rounded-lg font-semibold hover:bg-faded-copper transition"
                  >
                    Save Privacy Settings
                  </button>
                </div>
              </div>

              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-red-500/50">
                <h2 className="text-2xl font-bold text-red-400 mb-4">Data Management</h2>
                <div className="space-y-3">
                  <button className="w-full px-6 py-3 bg-clay-soil text-frosted-mint rounded-lg font-semibold hover:bg-faded-copper transition text-left">
                    📥 Download My Data
                  </button>
                  <button className="w-full px-6 py-3 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition text-left">
                    🗑️ Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
                <h2 className="text-2xl font-bold text-gold mb-6">Display Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-frosted-mint mb-2 font-semibold">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-frosted-mint mb-2 font-semibold">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                      <option value="Asia/Shanghai">Shanghai (CST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-frosted-mint mb-2 font-semibold">Date Format</label>
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-frosted-mint mb-2 font-semibold">Theme</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-4 rounded-lg border-2 transition ${
                          theme === 'dark'
                            ? 'border-gold bg-gold/10'
                            : 'border-faded-copper hover:border-gold'
                        }`}
                      >
                        <div className="text-frosted-mint font-semibold mb-1">🌙 Dark Mode</div>
                        <div className="text-faded-copper text-sm">Current theme</div>
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-4 rounded-lg border-2 transition ${
                          theme === 'light'
                            ? 'border-gold bg-gold/10'
                            : 'border-faded-copper hover:border-gold'
                        }`}
                      >
                        <div className="text-frosted-mint font-semibold mb-1">☀️ Light Mode</div>
                        <div className="text-faded-copper text-sm">Coming soon</div>
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveDisplay}
                    className="px-6 py-3 bg-gold text-midnight-violet rounded-lg font-semibold hover:bg-faded-copper transition"
                  >
                    Save Display Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
                <h2 className="text-2xl font-bold text-gold mb-6">Advanced Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-midnight-violet rounded-lg">
                    <div className="text-frosted-mint font-semibold mb-2">API Keys</div>
                    <div className="text-faded-copper text-sm mb-3">Manage your API access tokens</div>
                    <button className="px-4 py-2 bg-clay-soil text-frosted-mint rounded-lg hover:bg-faded-copper transition">
                      Manage API Keys
                    </button>
                  </div>
                  <div className="p-4 bg-midnight-violet rounded-lg">
                    <div className="text-frosted-mint font-semibold mb-2">Webhooks</div>
                    <div className="text-faded-copper text-sm mb-3">Configure webhook endpoints</div>
                    <button className="px-4 py-2 bg-clay-soil text-frosted-mint rounded-lg hover:bg-faded-copper transition">
                      Configure Webhooks
                    </button>
                  </div>
                  <div className="p-4 bg-midnight-violet rounded-lg">
                    <div className="text-frosted-mint font-semibold mb-2">Developer Mode</div>
                    <div className="text-faded-copper text-sm mb-3">Enable advanced debugging features</div>
                    <button className="px-4 py-2 bg-clay-soil text-frosted-mint rounded-lg hover:bg-faded-copper transition">
                      Enable
                    </button>
                  </div>
                  <div className="p-4 bg-midnight-violet rounded-lg">
                    <div className="text-frosted-mint font-semibold mb-2">Export Settings</div>
                    <div className="text-faded-copper text-sm mb-3">Download all your preferences as JSON</div>
                    <button className="px-4 py-2 bg-clay-soil text-frosted-mint rounded-lg hover:bg-faded-copper transition">
                      Export Settings
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
                <h2 className="text-2xl font-bold text-gold mb-4">Session Management</h2>
                <div className="space-y-3">
                  <div className="p-4 bg-midnight-violet rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-frosted-mint font-semibold">Active Sessions</div>
                        <div className="text-faded-copper text-sm">2 devices currently logged in</div>
                      </div>
                      <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition">
                        Sign Out All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
