import { useState } from 'react';
import type { User, Project } from '../types';
import { Terminal, PlusCircle, Users, ArrowRight } from 'lucide-react';

export default function ProjectHub({ user, onJoin }: { user: User, onJoin: (p: Project) => void }) {
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleCreate = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectName: teamName, userId: user.id }),
    });
    onJoin(await res.json());
  };

  const handleJoin = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode: inviteCode, userId: user.id }),
    });
    const data = await res.json();
    if (res.ok) onJoin(data); else alert("Invalid Invite Code!");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="z-10 text-center mb-16 animate-fade-slide-in-1">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 ring-1 ring-white/10 text-blue-400 text-sm font-bold mb-8 backdrop-blur shadow-lg">
          <Terminal className="w-4 h-4" /> HackLogger Workspaces
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Welcome back, {user.name}
        </h2>
        <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
          Create a new hackathon workspace or join your team's existing environment to start logging your progress.
        </p>
      </div>

      {/* Cards Container */}
      <div className="z-10 grid md:grid-cols-2 gap-8 max-w-5xl w-full animate-fade-slide-in-2">

        {/* Create Team Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
          
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-7 h-7" />
          </div>
          
          <h3 className="text-3xl font-bold mb-3 text-white tracking-tight">Create Workspace</h3>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">Start a fresh project environment and generate a secure invite code for your teammates.</p>

          <div className="space-y-4">
            <input 
              placeholder="Enter Project Name..." 
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
              onChange={e => setTeamName(e.target.value)} 
            />
            <button 
              onClick={handleCreate} 
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              Generate Workspace <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Join Team Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
          
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7" />
          </div>
          
          <h3 className="text-3xl font-bold mb-3 text-white tracking-tight">Join Workspace</h3>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">Got an invite code from your team leader? Enter it below to instantly access the shared logs.</p>

          <div className="space-y-4">
            <input 
              placeholder="ENTER INVITE CODE..." 
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase transition-all font-medium tracking-widest" 
              onChange={e => setInviteCode(e.target.value)} 
            />
            <button 
              onClick={handleJoin} 
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
            >
              Access Team Logs <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}