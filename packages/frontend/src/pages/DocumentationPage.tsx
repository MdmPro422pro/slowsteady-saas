import { DashboardPanel } from '../components/DashboardPanel';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gold mb-8">Documentation</h1>
        
        <div className="max-w-6xl space-y-6">
          {/* Quick Start */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">🚀 Quick Start Guide</h2>
            <ol className="space-y-3 text-frosted-mint list-decimal list-inside">
              <li>Connect your wallet using the button in the navigation</li>
              <li>Choose a membership tier that fits your needs</li>
              <li>Browse smart contract templates or request a custom solution</li>
              <li>Deploy your contract to the blockchain</li>
              <li>Monitor and manage your contracts from the dashboard</li>
            </ol>
          </div>

          {/* Documentation Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '📝', title: 'Smart Contracts', desc: 'Learn about ERC standards and custom contracts' },
              { icon: '🔗', title: 'Blockchain Integration', desc: 'Connect to 50+ supported networks' },
              { icon: '💰', title: 'Payment Processing', desc: 'Handle subscriptions and transactions' },
              { icon: '🔐', title: 'Security Best Practices', desc: 'Keep your assets safe' },
              { icon: '⚙️', title: 'API Reference', desc: 'Integrate our services programmatically' },
              { icon: '🛠️', title: 'Troubleshooting', desc: 'Common issues and solutions' },
            ].map((doc, i) => (
              <div key={i} className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper hover:border-gold transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{doc.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gold mb-2">{doc.title}</h3>
                    <p className="text-frosted-mint">{doc.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Code Example */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">Code Example: Deploy ERC-20</h2>
            <pre className="bg-midnight-violet p-4 rounded-lg overflow-x-auto border border-faded-copper">
              <code className="text-frosted-mint text-sm">
{`// Example: Deploy an ERC-20 token
import { deployContract } from '@mdmpro/sdk';

const token = await deployContract({
  type: 'ERC20',
  name: 'MyToken',
  symbol: 'MTK',
  totalSupply: '1000000',
  network: 'ethereum'
});

console.log('Token deployed:', token.address);`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
