import { useState } from 'react';

interface ChatProfileSetupProps {
  onComplete: (profile: {
    username: string;
    avatar: string;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    age?: number;
    location?: string;
  }) => void;
  onClose: () => void;
}

export function ChatProfileSetup({ onComplete, onClose }: ChatProfileSetupProps) {
  const [username, setUsername] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer-not-to-say'>('prefer-not-to-say');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Username is required');
      return;
    }

    onComplete({
      username: username.trim(),
      avatar: avatarPreview || '👤',
      gender: gender,
      age: age ? parseInt(age) : undefined,
      location: location.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-shadow-grey border-4 border-gold rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-gold font-bold text-3xl mb-2">Create Your Chat Profile</h2>
        <p className="text-frosted-mint mb-6">
          Set up your identity in the MDMPro community
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gold font-bold mb-2">
              Username <span className="text-clay-soil">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your chat username"
              maxLength={20}
              required
              className="w-full bg-midnight-violet border-2 border-faded-copper rounded-lg px-4 py-3 text-frosted-mint placeholder-faded-copper focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-gold font-bold mb-2">Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-midnight-violet border-2 border-faded-copper flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="text-frosted-mint text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-clay-soil file:text-frosted-mint hover:file:bg-faded-copper file:cursor-pointer"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gold font-bold mb-2">Gender (Optional)</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full bg-midnight-violet border-2 border-faded-copper rounded-lg px-4 py-3 text-frosted-mint focus:outline-none focus:border-gold transition-colors"
            >
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="block text-gold font-bold mb-2">Age (Optional)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              min="13"
              max="120"
              className="w-full bg-midnight-violet border-2 border-faded-copper rounded-lg px-4 py-3 text-frosted-mint placeholder-faded-copper focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gold font-bold mb-2">Location (Optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, USA"
              maxLength={50}
              className="w-full bg-midnight-violet border-2 border-faded-copper rounded-lg px-4 py-3 text-frosted-mint placeholder-faded-copper focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-midnight-violet border-2 border-faded-copper text-frosted-mint font-bold py-3 rounded-lg hover:bg-shadow-grey transition-colors"
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="flex-1 bg-clay-soil hover:bg-faded-copper text-frosted-mint font-bold py-3 rounded-lg transition-colors"
            >
              Create Profile
            </button>
          </div>
        </form>

        <p className="text-faded-copper text-xs text-center mt-4">
          Your profile is linked to your wallet address
        </p>
      </div>
    </div>
  );
}
