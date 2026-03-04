import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { session, loading, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email: loginEmail });
    if (!error) {
      setSent(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 w-full max-w-md shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6">Editor Access</h1>
          {sent ? (
            <div className="text-center">
              <p className="text-slate-300 mb-4">
                Check your email for the magic link to sign in.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-blue-400 hover:underline text-sm"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="your@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleLogin}
                disabled={!loginEmail}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded text-white font-medium transition"
              >
                Send Magic Link
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="sticky top-0 bg-slate-900 border-b border-slate-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Editor</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">{session.user?.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
