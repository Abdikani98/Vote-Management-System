import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, TrendingUp, Users, Trash2, AlertTriangle } from 'lucide-react';
import { Candidate, Student } from '../types';

interface DashboardProps {
  candidates: Candidate[];
  students?: Student[];
  onDeleteStudent?: (email: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ candidates, students = [], onDeleteStudent }) => {
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const confirmDelete = () => {
    if (studentToDelete && onDeleteStudent) {
      onDeleteStudent(studentToDelete.email);
      setStudentToDelete(null);
    }
  };

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const totalStudents = students.length;
  const votedStudents = students.filter(s => s.hasVoted).length;
  const notVotedStudents = totalStudents - votedStudents;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-12">
      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {candidates.map((candidate, index) => {
            const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;
            
            return (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center text-center"
              >
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors duration-500" />
                
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                    <img
                      src={candidate.imageUrl || `https://picsum.photos/seed/${candidate.id}/200`}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {index === 0 && candidate.voteCount > 0 && (
                    <div className="absolute -top-3 -right-3 bg-yellow-400 text-white p-1.5 rounded-full shadow-md animate-bounce">
                      <Award size={16} />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1">{candidate.name}</h3>
                <p className="text-sm font-medium text-indigo-600 mb-6 px-3 py-1 bg-indigo-50 rounded-full inline-block">
                  {candidate.teamName}
                </p>

                <div className="w-full mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-4xl font-black text-slate-900">{candidate.voteCount}</span>
                    <span className="text-sm font-bold text-slate-400">VOTES</span>
                  </div>
                  
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    <span>Progress</span>
                    <span>{Math.round(percentage)}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-xs mt-auto bg-slate-50 px-4 py-2 rounded-xl">
                  <TrendingUp size={14} className="text-green-500" />
                  <span>Live Update Active</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Student Statistics & Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">Xogta Ardayda</h3>
            <p className="text-slate-500 font-medium">Lasoco xaalada codeynta ardayda isdiiwaangelisay.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <p className="text-slate-500 font-bold mb-2">Tirada Guud</p>
            <p className="text-4xl font-black text-slate-900">{totalStudents}</p>
          </div>
          <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
            <p className="text-green-600 font-bold mb-2">Inta Codeysay</p>
            <p className="text-4xl font-black text-green-700">{votedStudents}</p>
          </div>
          <div className="bg-red-50 rounded-3xl p-6 border border-red-100">
            <p className="text-red-600 font-bold mb-2">Intaan Codeynin</p>
            <p className="text-4xl font-black text-red-700">{notVotedStudents}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-widest">Magaca</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-widest">Email-ka</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-widest">Semester-ka</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-widest">Xaaladda</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Tallaabo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.length > 0 ? (
                students.map((student, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800">{student.fullName}</td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-500">{student.email}</td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-600">{student.semester}</td>
                    <td className="py-4 px-6">
                      {student.hasVoted ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-green-100 text-green-700">
                          Wuu Codeeyay
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700">
                          Ma Codeynin
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {onDeleteStudent && (
                        <button
                          onClick={() => setStudentToDelete(student)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors inline-flex items-center justify-center"
                          title="Tirtir ardaygan"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    Wali wax arday ah isma diiwaangelin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {studentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Ma hubtaa?</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Ma doonaysaa inaad tirtirto ardaygan: <span className="font-bold text-slate-700">{studentToDelete.fullName}</span>? Falkan dib loogama noqon karo.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setStudentToDelete(null)}
                  className="py-3.5 rounded-xl font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  Jooji
                </button>
                <button
                  onClick={confirmDelete}
                  className="py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
                >
                  Haa, Tirtir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
