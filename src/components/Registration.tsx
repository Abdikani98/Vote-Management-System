import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Mail, GraduationCap, ArrowRight } from 'lucide-react';

interface RegistrationProps {
  onRegister: (data: { fullName: string; semester: string }) => void;
  email: string;
}

export const Registration: React.FC<RegistrationProps> = ({ onRegister }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [semester, setSemester] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && email && semester) {
      onRegister({ fullName, email, semester });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-200/40 border border-indigo-50"
    >
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg shadow-indigo-200">
          <UserPlus className="text-white" size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Diiwaangalin</h2>
        <p className="text-slate-500 font-medium tracking-tight">Buuxi xogtaada si aad u codeyso</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Magacaaga oo buuxa</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <UserPlus size={18} />
            </div>
            <input
              type="text"
              required
              className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-0 rounded-2xl text-slate-700 font-semibold placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
              placeholder="Saddexan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email-kaaga</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Mail size={18} />
            </div>
            <input
              type="email"
              required
              className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-0 rounded-2xl text-slate-700 font-semibold placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
              placeholder="Tusaale: example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Semesterka</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <GraduationCap size={18} />
            </div>
            <select
              required
              className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-0 rounded-2xl text-slate-700 font-semibold focus:ring-2 focus:ring-indigo-600 transition-all outline-none appearance-none"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="" disabled>Dooro Semester</option>
              {[ 2,  4,  6,  8].map(s => (
                <option key={s} value={`Semester ${s}`}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:shadow-indigo-200 transition-all duration-300 group mt-4"
        >
          Is Diiwaan Geli
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </motion.div>
  );
};
