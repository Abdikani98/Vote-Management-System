import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, UserCheck } from 'lucide-react';
import { Candidate } from '../types';

interface VotePanelProps {
  candidates: Candidate[];
  onVote: (candidateId: string) => void;
}

export const VotePanel: React.FC<VotePanelProps> = ({ candidates, onVote }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleVoteClick = () => {
    if (selectedId) {
      onVote(selectedId);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black tracking-widest uppercase mb-6">
          <UserCheck size={14} />
          Waa Waqtigii Go'aanka
        </div>
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Dooro Murashaxaaga</h2>
        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">Codkaaga ayaa muhiim ah. Fadlan si taxadar leh u dooro qofka aad u aragto inuu u qalmo hoggaanka.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {candidates.map((candidate) => (
          <motion.button
            key={candidate.id}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedId(candidate.id)}
            className={`relative p-2 rounded-[2.5rem] transition-all duration-500 ${
              selectedId === candidate.id 
                ? 'bg-indigo-600 shadow-2xl shadow-indigo-300' 
                : 'bg-white hover:shadow-xl hover:shadow-slate-200'
            }`}
          >
            <div className={`rounded-[2.2rem] p-6 h-full flex flex-col items-center text-center ${
              selectedId === candidate.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-800'
            }`}>
              <div className="relative mb-6">
                <div className={`w-32 h-32 rounded-3xl overflow-hidden border-4 ${
                  selectedId === candidate.id ? 'border-indigo-400' : 'border-white'
                } shadow-xl`}>
                  <img
                    src={candidate.imageUrl || `https://picsum.photos/seed/${candidate.id}/300`}
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {selectedId === candidate.id && (
                  <div className="absolute -top-3 -right-3 bg-white text-indigo-600 p-2 rounded-full shadow-lg border-2 border-indigo-200">
                    <Check size={20} strokeWidth={4} />
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-black mb-2">{candidate.name}</h3>
              <p className={`text-sm font-bold tracking-wide uppercase px-4 py-2 rounded-2xl ${
                selectedId === candidate.id ? 'bg-indigo-500 text-white' : 'bg-white text-slate-400'
              }`}>
                {candidate.teamName}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button
          disabled={!selectedId}
          onClick={() => setIsConfirming(true)}
          whileHover={selectedId ? { scale: 1.05 } : {}}
          className={`px-12 py-5 rounded-2xl font-black text-xl transition-all duration-300 shadow-xl ${
            selectedId 
              ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-200 cursor-pointer' 
              : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
          }`}
        >
          Xaqiiji Codkaaga
        </motion.button>
      </div>

      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Check size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Ma hubtaa codkaaga?</h3>
            <p className="text-slate-500 font-medium mb-8">Markaad codeyso dib uma bedeli kartid. Ma xaqiijineysaa codkaaga?</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsConfirming(false)}
                className="py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
              >
                Maya
              </button>
              <button
                onClick={handleVoteClick}
                className="py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
              >
                Haa, Coddee
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
