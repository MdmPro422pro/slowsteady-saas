import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { WalletButton } from '../components/WalletButton';
import { DashboardPanel } from '../components/DashboardPanel';
import { ChatProfileSetup } from '../components/ChatProfileSetup';
import { useChat } from '../hooks/useChat';
import { useMembership } from '../hooks/useMembership';

interface ChatProfile {
  username: string;
  avatar: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  age?: number;
  location?: string;
  walletAddress: string;
}

const CHAT_ROOMS = [
  { id: 'General', name: 'Community (General)', icon: '💬' },
  { id: 'Trading', name: 'Trading', icon: '📈' },
  { id: 'Tech Support', name: 'Tech Support', icon: '🛠️' },
  { id: 'NFT Hub', name: 'NFT Hub', icon: '🖼️' },
  { id: 'DeFi Discussion', name: 'DeFi Discussion', icon: '₿' },
  { id: 'Community', name: 'Off-Topic', icon: '💬' },
];

export default function CommunityPage() {
  const { address, isConnected } = useAccount();
  const { membership } = useMembership();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [chatProfile, setChatProfile] = useState<ChatProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('General');
  
  // Initialize chat with username from profile
  const { 
    messages, 
    onlineUsers, 
    typingUsers,
    isConnected: isChatConnected, 
    isAuthenticated,
    joinRoom,
    sendMessage,
    emitTyping,
    error: chatError,
  } = useChat(chatProfile?.username || 'Guest');

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if user has paid membership
  const hasPaid = membership && (membership as any).paymentStatus === 'paid';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Check if wallet is connected
    if (!isConnected) {
      alert('Please connect your wallet to send messages');
      return;
    }

    // Check if user has paid
    if (!hasPaid) {
      setShowPaymentModal(true);
      return;
    }

    // Check if user has a profile - prompt to create one
    if (!chatProfile) {
      setShowProfileSetup(true);
      return;
    }

    // Send message via WebSocket
    sendMessage(messageInput);
    setMessageInput('');
    emitTyping(false);
  };

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (e.target.value.trim()) {
      emitTyping(true);
    } else {
      emitTyping(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Call your backend API to create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          amount: 500, // $5.00 in cents
        }),
      });

      const data = await response.json();
      
      // Redirect directly to Stripe Checkout URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Payment session creation failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load chat profile on mount
  useEffect(() => {
    if (isConnected && address) {
      // Check for existing chat profile
      const savedProfile = localStorage.getItem(`chat_profile_${address}`);
      if (savedProfile) {
        setChatProfile(JSON.parse(savedProfile));
      }
    }
  }, [isConnected, address]);

  // Join room when authenticated and room selected
  useEffect(() => {
    if (isAuthenticated && selectedRoom) {
      joinRoom(selectedRoom);
    }
  }, [isAuthenticated, selectedRoom, joinRoom]);

  // Filter messages for current room (frontend filter as backup)
  const filteredMessages = messages.filter(msg => msg.room === selectedRoom);

  const handleProfileComplete = (profile: Omit<ChatProfile, 'walletAddress'>) => {
    if (!address) return;
    
    const fullProfile: ChatProfile = {
      ...profile,
      walletAddress: address,
    };
    
    // Save to localStorage
    localStorage.setItem(`chat_profile_${address}`, JSON.stringify(fullProfile));
    setChatProfile(fullProfile);
    setShowProfileSetup(false);
  };

  const formatTimestamp = (date: Date | string) => {
    const msgDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - msgDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return msgDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      
      {/* Header */}
      <header className="bg-shadow-grey border-b-2 border-faded-copper">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gold">
            MDMPro <span className="text-frosted-mint">Community</span>
          </Link>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          
          {/* Room Selector Sidebar */}
          <div className="lg:col-span-1 bg-shadow-grey border-2 border-clay-soil rounded-lg p-4 overflow-y-auto">
            <h2 className="text-gold font-bold text-lg mb-4">Chat Rooms</h2>
            <div className="space-y-2">
              {CHAT_ROOMS.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedRoom === room.id
                      ? 'bg-clay-soil text-frosted-mint'
                      : 'bg-midnight-violet text-frosted-mint hover:bg-clay-soil hover:bg-opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{room.icon}</span>
                    <span className="text-sm font-medium">{room.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* User Profile Section */}
            {chatProfile && (
              <div className="mt-6 pt-6 border-t-2 border-clay-soil">
                <h3 className="text-gold font-bold text-sm mb-3">Your Profile</h3>
                <div className="flex items-center gap-3 p-2 bg-midnight-violet rounded-lg">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-clay-soil flex items-center justify-center">
                    {chatProfile.avatar.startsWith('data:') ? (
                      <img src={chatProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{chatProfile.avatar}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-frosted-mint font-medium text-sm truncate">
                      {chatProfile.username}
                    </p>
                    {chatProfile.location && (
                      <p className="text-faded-copper text-xs">{chatProfile.location}</p>
                    )}
                  </div>
                </div>
                
                {/* Online Users */}
                {onlineUsers.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-gold font-bold text-xs mb-2">
                      🟢 Online ({onlineUsers.length})
                    </h3>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {onlineUsers.map(user => (
                        <div key={user.walletAddress} className="text-frosted-mint text-xs px-2 py-1 bg-midnight-violet rounded">
                          {user.username}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 bg-shadow-grey border-2 border-clay-soil rounded-lg flex flex-col">
            
            {/* Chat Header */}
            <div className="border-b-2 border-clay-soil p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{CHAT_ROOMS.find(r => r.id === selectedRoom)?.icon}</span>
                  <div>
                    <h2 className="text-gold font-bold text-xl">
                      {CHAT_ROOMS.find(r => r.id === selectedRoom)?.name}
                    </h2>
                    <p className="text-faded-copper text-sm">
                      {filteredMessages.length} messages
                      {isChatConnected && isAuthenticated && (
                        <span className="ml-2">• 🟢 Connected</span>
                      )}
                      {!isChatConnected && (
                        <span className="ml-2">• 🔴 Disconnected</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="text-faded-copper text-xs mt-2">
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!isConnected ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8 bg-midnight-violet border-2 border-faded-copper rounded-lg">
                    <p className="text-gold font-bold text-xl mb-2">🔒 Connect Wallet</p>
                    <p className="text-frosted-mint">
                      Connect your wallet to view messages
                    </p>
                  </div>
                </div>
              ) : !hasPaid ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8 bg-midnight-violet border-2 border-faded-copper rounded-lg max-w-md">
                    <p className="text-gold font-bold text-2xl mb-4">💬 Premium Chat Access</p>
                    <p className="text-frosted-mint mb-6">
                      Messages are blurred. Pay <span className="text-gold font-bold">$5.00</span> to unlock full chat access and start communicating with the community!
                    </p>
                    <div className="space-y-4 mb-6">
                      <div className="bg-shadow-grey border-2 border-clay-soil rounded-lg p-3 filter blur-sm">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-gold text-sm">CryptoWhale</span>
                          <span className="text-faded-copper text-xs">5m ago</span>
                        </div>
                        <p className="text-sm text-frosted-mint">Just launched my token! Check it out 🚀</p>
                      </div>
                      <div className="bg-shadow-grey border-2 border-clay-soil rounded-lg p-3 filter blur-sm">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-gold text-sm">DiamondHands</span>
                          <span className="text-faded-copper text-xs">8m ago</span>
                        </div>
                        <p className="text-sm text-frosted-mint">Anyone staking their tokens yet?</p>
                      </div>
                      <div className="bg-shadow-grey border-2 border-clay-soil rounded-lg p-3 filter blur-sm">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-gold text-sm">MoonBoy</span>
                          <span className="text-faded-copper text-xs">12m ago</span>
                        </div>
                        <p className="text-sm text-frosted-mint">When are we adding more games?</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="bg-clay-soil hover:bg-faded-copper text-frosted-mint font-bold px-8 py-3 rounded-lg transition-colors"
                    >
                      Unlock Chat for $5
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {filteredMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-faded-copper">
                        <p className="text-xl mb-2">💬</p>
                        <p>No messages yet. Be the first to say hello!</p>
                      </div>
                    </div>
                  ) : (
                    filteredMessages.map((message) => {
                      const isOwn = message.walletAddress === address;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isOwn
                                ? 'bg-clay-soil text-frosted-mint'
                                : 'bg-midnight-violet text-frosted-mint border-2 border-faded-copper'
                            }`}
                          >
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-bold text-gold text-sm">
                                {message.username}
                              </span>
                              <span className="text-faded-copper text-xs">
                                {formatTimestamp(message.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm break-words">{message.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t-2 border-clay-soil p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={handleInputChange}
                  placeholder={
                    !isConnected
                      ? 'Connect wallet to chat...'
                      : !hasPaid
                      ? 'Pay $5 to unlock chat...'
                      : !chatProfile
                      ? 'Create profile to send messages...'
                      : 'Type your message...'
                  }
                  disabled={!isConnected || !hasPaid}
                  className="flex-1 bg-midnight-violet border-2 border-faded-copper rounded-lg px-4 py-3 text-frosted-mint placeholder-faded-copper focus:outline-none focus:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!isConnected || !hasPaid || !isChatConnected}
                  className="bg-clay-soil hover:bg-faded-copper text-frosted-mint font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
              <p className="text-faded-copper text-xs mt-2">
                {!isConnected
                  ? '🔒 Connect your wallet to unlock chat features'
                  : !hasPaid
                  ? '💰 Get a membership to send messages and see full chat history'
                  : !chatProfile
                  ? '📝 Create your profile to start sending messages'
                  : isChatConnected && isAuthenticated
                  ? '✅ Connected to chat - enjoy real-time messaging!'
                  : '🔄 Connecting to chat server...'}
              </p>
              {chatError && (
                <p className="text-clay-soil text-xs mt-1">⚠️ {chatError}</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-shadow-grey border-t-2 border-faded-copper py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" className="text-gold hover:text-frosted-mint transition-colors">
            ← Back to Home
          </Link>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-shadow-grey border-4 border-gold rounded-lg p-8 max-w-md w-full">
            <h2 className="text-gold font-bold text-2xl mb-4">Unlock Premium Chat</h2>
            <div className="space-y-4 mb-6">
              <div className="bg-midnight-violet border-2 border-clay-soil rounded-lg p-4">
                <p className="text-frosted-mint font-bold mb-2">What you get:</p>
                <ul className="text-frosted-mint text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span> Send unlimited messages
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span> View full chat history
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span> Connect with community
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span> Lifetime access
                  </li>
                </ul>
              </div>
              
              <div className="bg-clay-soil rounded-lg p-4 text-center">
                <p className="text-frosted-mint text-sm mb-1">One-time payment</p>
                <p className="text-gold font-bold text-3xl">$5.00 USD</p>
              </div>

              {address && (
                <div className="text-xs text-faded-copper text-center">
                  Payment linked to: {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-midnight-violet border-2 border-faded-copper text-frosted-mint font-bold py-3 rounded-lg hover:bg-shadow-grey transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-clay-soil hover:bg-faded-copper text-frosted-mint font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Pay with Stripe'}
              </button>
            </div>
            
            <p className="text-faded-copper text-xs text-center mt-4">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      )}

      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <ChatProfileSetup
          onComplete={handleProfileComplete}
          onClose={() => setShowProfileSetup(false)}
        />
      )}
    </div>
  );
}
