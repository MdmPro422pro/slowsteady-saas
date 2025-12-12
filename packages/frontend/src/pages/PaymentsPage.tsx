import { DashboardPanel } from '../components/DashboardPanel';

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gold mb-8">Payments</h1>
        
        <div className="max-w-6xl space-y-6">
          {/* Payment Methods */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">Payment Methods</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-midnight-violet rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">💳</span>
                  <div>
                    <div className="text-frosted-mint font-semibold">Visa ending in 4242</div>
                    <div className="text-faded-copper text-sm">Expires 12/2025</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-clay-soil text-frosted-mint rounded-lg hover:bg-faded-copper transition">
                  Remove
                </button>
              </div>
              <button className="w-full p-4 border-2 border-dashed border-faded-copper rounded-lg text-gold hover:bg-clay-soil transition">
                + Add Payment Method
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">Transaction History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-faded-copper">
                    <th className="text-left text-frosted-mint p-3">Date</th>
                    <th className="text-left text-frosted-mint p-3">Description</th>
                    <th className="text-left text-frosted-mint p-3">Amount</th>
                    <th className="text-left text-frosted-mint p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-faded-copper/30">
                    <td className="p-3 text-frosted-mint">Dec 12, 2025</td>
                    <td className="p-3 text-frosted-mint">Membership - Tier 2</td>
                    <td className="p-3 text-gold font-semibold">$299.00</td>
                    <td className="p-3"><span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Paid</span></td>
                  </tr>
                  <tr className="border-b border-faded-copper/30">
                    <td className="p-3 text-frosted-mint">Nov 12, 2025</td>
                    <td className="p-3 text-frosted-mint">Membership - Tier 2</td>
                    <td className="p-3 text-gold font-semibold">$299.00</td>
                    <td className="p-3"><span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Paid</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
