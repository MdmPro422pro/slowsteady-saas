import { DashboardPanel } from '../components/DashboardPanel';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gold mb-8">Notifications</h1>
        
        <div className="max-w-4xl space-y-4">
          {[
            { type: 'success', icon: '✅', title: 'Payment Successful', message: 'Your membership has been renewed', time: '5 min ago' },
            { type: 'info', icon: '📝', title: 'Contract Update', message: 'New smart contract deployed successfully', time: '1 hour ago' },
            { type: 'warning', icon: '⚠️', title: 'Security Alert', message: 'New login from unknown device', time: '2 hours ago' },
            { type: 'info', icon: '💬', title: 'New Message', message: 'You have 3 unread messages in chat', time: '3 hours ago' },
          ].map((notif, i) => (
            <div key={i} className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper hover:border-gold transition-all">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{notif.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gold">{notif.title}</h3>
                    <span className="text-faded-copper text-sm">{notif.time}</span>
                  </div>
                  <p className="text-frosted-mint">{notif.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
