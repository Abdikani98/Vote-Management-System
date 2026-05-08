import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, LogIn, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        onLogin(true);
      } else {
        setError(data.error || 'Khalad ayaa dhacay');
      }
    } catch (err) {
      setError('Xiriirka server-ka waa goanyahay');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100"
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Dib u noqo
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Admin Login</h2>
          <p className="text-slate-500 font-medium">Kaliya maamulka ayaa geli kara halkan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-0 rounded-2xl text-slate-700 font-semibold focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                placeholder="Gali username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-0 rounded-2xl text-slate-700 font-semibold focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all duration-300 group"
          >
            {loading ? 'Fadlan sug...' : 'Gali Dashboard'}
            {!loading && <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
