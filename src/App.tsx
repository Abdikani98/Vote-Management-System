import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Candidate, Student, AppState } from './types';
import { Registration } from './components/Registration';
import { VotePanel } from './components/VotePanel';
import { Dashboard } from './components/Dashboard';
import { Vote, LayoutDashboard, Loader2, AlertCircle, ShieldCheck, CheckCircle2, LogOut } from 'lucide-react';
import { AdminLogin } from './components/AdminLogin';

export default function App() {
  const [student, setStudent] = useState<Student | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [appState, setAppState] = useState<AppState>('registering');

  // Load candidates on start
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Poll only if admin is logged in
  useEffect(() => {
    if (appState === 'admin-dashboard') {
      fetchAdminData();
      const interval = setInterval(fetchAdminData, 3000);
      return () => clearInterval(interval);
    }
  }, [appState]);

  const fetchAdminData = async () => {
    fetchCandidates();
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      setStudentsList(data);
    } catch (e) {
      console.error('Failed to fetch students');
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch('/api/candidates');
      const data = await res.json();
      setCandidates(data);
    } catch (e) {
      console.error('Failed to fetch candidates');
    }
  };

  const handleRegister = async (data: { fullName: string; email: string; semester: string }) => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (result.error) throw new Error(result.error);

      setStudent(result.student);
      if (result.student.hasVoted) {
        setAppState('success');
      } else {
        setAppState('voting');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error registering');
      setAppState('registering');
    }
  };

  const handleVote = async (candidateId: string) => {
    if (!student) return;

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: student.email, candidateId })
      });
      const result = await res.json();
      
      if (result.error) throw new Error(result.error);

      setCandidates(result.candidates);
      setStudent({ ...student, hasVoted: true, votedFor: candidateId });
      setAppState('success');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error voting');
      setAppState('voting');
    }
  };

  const handleDeleteStudent = async (email: string) => {
    try {
      const res = await fetch(`/api/admin/students/${encodeURIComponent(email)}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      
      setStudentsList(result.students);
      setCandidates(result.candidates);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error deleting student');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-indigo-200">
              <Vote className="text-white" size={20} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">UniVote</span>
              <div className="flex items-center gap-1.5 -mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">System Codeyn</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {appState === 'admin-dashboard' && (
              <button 
                onClick={() => setAppState('registering')}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors"
              >
                <LogOut size={14} />
                Ka bax Admin
              </button>
            )}
            {appState !== 'admin-login' && appState !== 'admin-dashboard' && (
              <button 
                onClick={() => setAppState('admin-login')}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs transition-colors"
              >
                <ShieldCheck size={16} />
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <AnimatePresence mode="wait">
          {appState === 'loading' ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="text-indigo-600 animate-spin mb-4" size={48} />
              <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Fadlan sug...</p>
            </motion.div>
          ) : appState === 'registering' ? (
            <Registration key="reg" onRegister={handleRegister} email="" />
          ) : appState === 'voting' ? (
            <VotePanel key="vote" candidates={candidates} onVote={handleVote} />
          ) : appState === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto bg-white rounded-[2.5rem] p-12 text-center shadow-2xl shadow-slate-200 border border-slate-50"
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Mahadsanid!</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
                Codeyntaadu si guul ah ayey u dhacday. Codkaaga ayaa muhiim u ah jamacada.
              </p>
              <button 
                onClick={() => {
                  setStudent(null);
                  setAppState('registering');
                }}
                className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-indigo-600 transition-all duration-300"
              >
                Arday cusub diwaangeli
              </button>
            </motion.div>
          ) : appState === 'admin-login' ? (
            <AdminLogin 
              key="admin-login" 
              onLogin={() => setAppState('admin-dashboard')} 
              onBack={() => setAppState('registering')} 
            />
          ) : appState === 'admin-dashboard' ? (
            <div key="admin-results" className="space-y-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black tracking-widest uppercase mb-4">
                  <LayoutDashboard size={14} />
                  Dashboard-ka Maamulka
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-2">Natiijada Codeynta</h2>
                <p className="text-slate-500 font-medium">Halkan kala soco codadka ay heleen murashaxiinta si toos ah.</p>
              </div>
              <Dashboard candidates={candidates} students={studentsList} onDeleteStudent={handleDeleteStudent} />
            </div>
          ) : null}
        </AnimatePresence>
      </main>

      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-indigo-100/30 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-slate-200/40 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />
      </div>
    </div>
  );
}
