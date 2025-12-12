import { DashboardPanel } from '../components/DashboardPanel';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gold mb-8">Support</h1>
        
        <div className="max-w-4xl space-y-6">
          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-gold font-bold mb-2">Live Chat</h3>
              <p className="text-frosted-mint text-sm mb-4">Get instant help</p>
              <button className="px-4 py-2 bg-gold text-midnight-violet rounded-lg font-semibold hover:bg-faded-copper transition">
                Start Chat
              </button>
            </div>
            <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper text-center">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="text-gold font-bold mb-2">Email</h3>
              <p className="text-frosted-mint text-sm mb-4">support@mdmpro.com</p>
              <button className="px-4 py-2 bg-clay-soil text-frosted-mint rounded-lg font-semibold hover:bg-faded-copper transition">
                Send Email
              </button>
            </div>
            <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-gold font-bold mb-2">Documentation</h3>
              <p className="text-frosted-mint text-sm mb-4">Browse guides</p>
              <button className="px-4 py-2 bg-clay-soil text-frosted-mint rounded-lg font-semibold hover:bg-faded-copper transition">
                View Docs
              </button>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'How do I upgrade my membership?', a: 'Visit the Memberships section and select your desired tier.' },
                { q: 'How long does contract deployment take?', a: 'Most contracts deploy within 5-10 minutes.' },
                { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime from Settings.' },
                { q: 'What payment methods do you accept?', a: 'We accept all major credit cards and crypto.' },
              ].map((faq, i) => (
                <details key={i} className="group">
                  <summary className="cursor-pointer text-gold font-semibold p-3 bg-midnight-violet rounded-lg hover:bg-clay-soil transition">
                    {faq.q}
                  </summary>
                  <p className="text-frosted-mint p-3 pl-6">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
