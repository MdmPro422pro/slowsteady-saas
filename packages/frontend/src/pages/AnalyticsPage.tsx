import { DashboardPanel } from '../components/DashboardPanel';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gold mb-8">Analytics</h1>
        
        <div className="max-w-6xl space-y-6">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
              <div className="text-faded-copper mb-2">Total Revenue</div>
              <div className="text-3xl font-bold text-gold">$12,450</div>
              <div className="text-green-400 text-sm mt-2">+15% from last month</div>
            </div>
            <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
              <div className="text-faded-copper mb-2">Active Contracts</div>
              <div className="text-3xl font-bold text-gold">23</div>
              <div className="text-green-400 text-sm mt-2">+3 new</div>
            </div>
            <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
              <div className="text-faded-copper mb-2">Transactions</div>
              <div className="text-3xl font-bold text-gold">847</div>
              <div className="text-frosted-mint text-sm mt-2">All time</div>
            </div>
            <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
              <div className="text-faded-copper mb-2">Success Rate</div>
              <div className="text-3xl font-bold text-gold">98.2%</div>
              <div className="text-green-400 text-sm mt-2">Excellent</div>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">Revenue Over Time</h2>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-faded-copper rounded-lg">
              <span className="text-frosted-mint">Chart visualization coming soon...</span>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {['Contract deployed', 'Payment received', 'New user signup', 'Security scan completed'].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-midnight-violet rounded-lg">
                  <span className="text-2xl">✓</span>
                  <span className="text-frosted-mint">{activity}</span>
                  <span className="text-faded-copper text-sm ml-auto">{i + 1}h ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
