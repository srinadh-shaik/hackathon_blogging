import { useState, useEffect } from 'react';
import type { User, Project, Post } from '../types';
import { io } from 'socket.io-client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Dashboard({ user, project, onLogout }: { user: User, project: Project, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('hackathon_tab') || 'TEAM_GENERAL';
  }); 
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [researchLink, setResearchLink] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [postType, setPostType] = useState('GENERAL'); 

  useEffect(() => {
    localStorage.setItem('hackathon_tab', activeTab);
  }, [activeTab]);

  const fetchData = async () => {
    let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts/team/${project.id}`;
    if (activeTab === 'GLOBAL') url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts/global`;
    if (activeTab === 'HISTORY') url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts/history/${user.id}`;
    
    try {
      const res = await fetch(url);
      if (res.ok) setPosts(await res.json());
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => { 
    if (activeTab !== 'CREATE' && activeTab !== 'INVITE' && activeTab !== 'ABOUT') {
      fetchData(); 
    }
  }, [activeTab, project.id]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    socket.on('new_post', (newPost: Post) => {
      setPosts((prevPosts) => {
        if (prevPosts.some(p => p.id === newPost.id)) return prevPosts;
        if (activeTab === 'GLOBAL' && !newPost.isPublic) return prevPosts;
        if (activeTab === 'TEAM_GENERAL' && newPost.projectId !== project.id) return prevPosts;
        if (activeTab === 'TEAM_WORK' && newPost.projectId !== project.id) return prevPosts;
        return [newPost, ...prevPosts];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [activeTab, project.id]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, researchLink, isPublic, postType, authorId: user.id, projectId: project.id }),
    });
    setTitle(''); setContent(''); setResearchLink(''); setIsPublic(false);
    setActiveTab(postType === 'WORK_DONE' ? 'TEAM_WORK' : 'TEAM_GENERAL');
  };

  const researchLinks = posts.filter(p => p.researchLink && p.projectId === project.id);

  const markdownComponents = {
    h1: ({node, ...props}: any) => <h1 className="text-2xl font-bold mt-6 mb-4 text-white" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-xl font-bold mt-5 mb-3 text-slate-200" {...props} />,
    p: ({node, ...props}: any) => <p className="mb-4 text-slate-300 leading-relaxed" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc pl-5 mb-4 text-slate-300 marker:text-[#00FF66]" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal pl-5 mb-4 text-slate-300 marker:text-[#00FF66]" {...props} />,
    li: ({node, ...props}: any) => <li className="mb-2" {...props} />,
    a: ({node, ...props}: any) => <a className="text-[#00FF66] hover:text-[#00FF66]/80 hover:underline font-medium transition-colors" target="_blank" rel="noreferrer" {...props} />,
    code: ({node, inline, ...props}: any) => 
      inline ? 
        <code className="bg-[#0D1117] text-[#00FF66] px-1.5 py-0.5 rounded font-mono text-sm border border-white/10" {...props} /> : 
        <pre className="bg-[#0D1117] text-slate-300 p-4 rounded-xl overflow-x-auto mb-4 font-mono text-sm border border-white/5 shadow-inner"><code {...props} /></pre>
  };

  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `w-full text-left px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
      isActive 
        ? 'bg-[#00FF66]/10 text-[#00FF66] shadow-[inset_2px_0_0_0_#00FF66]' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`;
  };

  return (
    <div className="flex h-screen bg-[#0D1117] text-slate-300 font-sans overflow-hidden selection:bg-[#00FF66]/30 selection:text-white">
      
      {/* SIDEBAR */}
      <div className="w-72 bg-[#161B22] border-r border-white/5 flex flex-col justify-between h-full z-20">
        <div>
          <div className="p-6 border-b border-white/5">
            <h1 className="text-2xl font-black text-white truncate tracking-tight">{project.name}</h1>
            <p className="text-xs text-[#00FF66] mt-1 font-mono">{user.name} @ workspace</p>
          </div>
          
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => setActiveTab('CREATE')} 
              className="w-full bg-[#00FF66] text-black font-bold py-3.5 rounded-xl mb-6 shadow-[0_0_15px_rgba(0,255,102,0.15)] hover:shadow-[0_0_25px_rgba(0,255,102,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 uppercase tracking-wider text-sm"
            >
              Write Log
            </button>
            <button onClick={() => setActiveTab('GLOBAL')} className={getTabClass('GLOBAL')}>Global Network</button>
            <button onClick={() => setActiveTab('TEAM_GENERAL')} className={getTabClass('TEAM_GENERAL')}>Team Terminal</button>
            <button onClick={() => setActiveTab('TEAM_WORK')} className={getTabClass('TEAM_WORK')}>Execution Logs</button>
            <button onClick={() => setActiveTab('HISTORY')} className={getTabClass('HISTORY')}>My Archives</button>
            <button onClick={() => setActiveTab('INVITE')} className={getTabClass('INVITE')}>Access Control</button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/5 space-y-2">
          <button onClick={() => setActiveTab('ABOUT')} className="w-full text-left px-5 py-2 text-sm text-slate-500 hover:text-white transition-colors font-medium">System Info</button>
          <button onClick={onLogout} className="w-full bg-[#0D1117] text-red-400 py-3 rounded-lg hover:bg-red-500/10 hover:text-red-300 border border-white/5 hover:border-red-500/30 transition-all font-bold text-sm">Terminate Session</button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-10 relative">
        
        {/* RESEARCH LINKS WIDGET */}
        <div className="fixed top-10 right-10 w-80 bg-[#161B22]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 z-50 hidden lg:block transition-all hover:border-white/20">
          <h3 className="text-xs font-black text-slate-400 border-b border-white/5 pb-3 mb-4 flex justify-between items-center uppercase tracking-widest">
            Data Links
            <span className="bg-[#0D1117] text-[#00FF66] px-2 py-1 rounded border border-[#00FF66]/20 text-[10px] font-mono">{researchLinks.length} active</span>
          </h3>
          <ul className="space-y-3 text-xs max-h-64 overflow-y-auto pr-2">
            {researchLinks.map(p => (
              <li key={`link-${p.id}`} className="bg-[#0D1117] p-3 rounded-xl border border-white/5 hover:border-[#00FF66]/30 transition-colors group">
                <a href={p.researchLink} target="_blank" rel="noreferrer" className="text-slate-200 group-hover:text-[#00FF66] font-medium block truncate text-sm transition-colors">
                  {p.title}
                </a>
                <span className="text-slate-500 block truncate mt-1 font-mono text-[10px]">{p.researchLink}</span>
              </li>
            ))}
            {researchLinks.length === 0 && <p className="text-slate-500 italic text-center py-4 text-xs font-mono">System empty. No links indexed.</p>}
          </ul>
        </div>

        {/* HEADER */}
        <div className="max-w-3xl mb-12 border-b border-white/5 pb-6 animate-fade-slide-in-1">
          <h2 className="text-4xl font-black text-white tracking-tight">
            {activeTab === 'CREATE' && 'Initialize New Log'}
            {activeTab === 'GLOBAL' && 'Global Hackathon Network'}
            {activeTab === 'TEAM_GENERAL' && 'Team Discussion Terminal'}
            {activeTab === 'TEAM_WORK' && 'Execution & Task Logs'}
            {activeTab === 'HISTORY' && 'Personal Archives'}
            {activeTab === 'INVITE' && 'Workspace Access Control'}
            {activeTab === 'ABOUT' && 'System Information'}
          </h2>
        </div>

        {/* POST CREATION FORM */}
        {activeTab === 'CREATE' && (
          <form onSubmit={handlePost} className="max-w-3xl bg-[#161B22] p-8 rounded-2xl shadow-2xl border border-white/5 animate-fade-slide-in-2">
            <div className="flex gap-4 mb-6">
              <select 
                value={postType} 
                onChange={e => setPostType(e.target.value)} 
                className="bg-[#0D1117] p-3 rounded-xl font-medium text-sm text-slate-300 outline-none border border-white/10 hover:border-white/20 focus:border-[#00FF66] transition-colors cursor-pointer"
              >
                <option value="GENERAL">General Discussion</option>
                <option value="WORK_DONE">Execution Log</option>
              </select>
              <label className="flex items-center text-sm font-medium text-slate-400 gap-3 bg-[#0D1117] px-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isPublic} 
                  onChange={e => setIsPublic(e.target.checked)} 
                  className="w-4 h-4 accent-[#00FF66] bg-[#0D1117] border-white/20 rounded" 
                />
                Push to Global Network
              </label>
            </div>
            
            <input 
              placeholder="Log Title..." 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full p-4 bg-[#0D1117] border border-white/10 focus:border-[#00FF66] rounded-xl font-bold mb-5 text-xl text-white outline-none focus:ring-1 focus:ring-[#00FF66] transition-all placeholder-slate-600" 
              required 
            />
            
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2 px-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Markdown Supported</p>
                <p className="text-[10px] text-slate-500 font-mono">Use `code` or **bold**</p>
              </div>
              <textarea 
                placeholder="Initialize text input..." 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                className="w-full p-4 bg-[#0D1117] border border-white/10 focus:border-[#00FF66] rounded-xl h-48 outline-none resize-none font-mono text-sm text-slate-300 focus:ring-1 focus:ring-[#00FF66] transition-all placeholder-slate-600" 
                required 
              />
            </div>
            
            <div className="bg-[#0D1117] p-5 rounded-xl mb-8 border border-white/5">
              <label className="text-[10px] font-bold text-[#00FF66] uppercase block mb-3 font-mono tracking-widest">Attach External Data Link</label>
              <input 
                placeholder="https://github.com/..." 
                value={researchLink} 
                onChange={e => setResearchLink(e.target.value)} 
                className="w-full p-3 bg-[#161B22] border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] transition-all placeholder-slate-600 font-mono" 
              />
            </div>
            
            <button className="bg-[#00FF66] text-black px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,255,102,0.3)] w-full md:w-auto transition-all duration-300">
              Execute Publication
            </button>
          </form>
        )}

        {/* FEED */}
        {['GLOBAL', 'TEAM_GENERAL', 'TEAM_WORK', 'HISTORY'].includes(activeTab) && (
          <div className="space-y-6 max-w-3xl pb-32 animate-fade-slide-in-2">
            {posts.filter(p => {
              if (activeTab === 'TEAM_GENERAL') return p.postType === 'GENERAL';
              if (activeTab === 'TEAM_WORK') return p.postType === 'WORK_DONE';
              return true; 
            }).map(post => (
              <div key={post.id} className={`bg-[#161B22]/60 backdrop-blur-sm p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${post.postType === 'WORK_DONE' ? 'border-l-4 border-l-[#00FF66] border-y-white/5 border-r-white/5 hover:border-r-white/10 hover:border-y-white/10' : 'border-white/5 hover:border-white/10'}`}>
                
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">{post.title}</h2>
                  {post.postType === 'WORK_DONE' && <span className="bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 text-[10px] px-2.5 py-1 rounded font-mono uppercase tracking-widest">Execution</span>}
                </div>
                
                <div className="text-[11px] font-mono text-slate-500 mb-6 flex items-center gap-3">
                  <span className="bg-[#0D1117] border border-white/5 px-2 py-1 rounded text-slate-300">{post.author?.name}</span>
                  {post.project && <span className="text-slate-400">dir: {post.project.name}</span>}
                  <span className="text-slate-600">[{new Date(post.createdAt).toLocaleString()}]</span>
                </div>
                
                <div className="markdown-body text-base mb-6 border-l-2 pl-5 border-white/10">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {post.content}
                  </ReactMarkdown>
                </div>
                
                {post.researchLink && (
                  <a href={post.researchLink} target="_blank" rel="noreferrer" className="inline-block bg-[#0D1117] border border-white/10 text-[#00FF66] text-xs px-4 py-2 rounded-lg hover:border-[#00FF66]/50 hover:bg-[#00FF66]/5 transition-all font-mono">
                    link_out: {post.researchLink}
                  </a>
                )}
              </div>
            ))}
            
            {posts.length === 0 && (
              <div className="text-center py-24 bg-[#161B22]/30 rounded-2xl border border-dashed border-white/10">
                <p className="text-slate-500 text-sm font-mono mb-4">Query returned 0 results.</p>
                <button onClick={() => setActiveTab('CREATE')} className="text-[#00FF66] font-medium hover:underline text-sm transition-all">Initialize first log entry</button>
              </div>
            )}
          </div>
        )}

        {/* INVITE SCREEN */}
        {activeTab === 'INVITE' && (
          <div className="max-w-xl bg-[#161B22] p-12 rounded-3xl border border-white/5 text-center shadow-2xl animate-fade-slide-in-2">
            <h3 className="text-xl font-bold mb-3 text-white">Workspace Access Key</h3>
            <p className="text-slate-400 mb-8 leading-relaxed text-sm">Distribute this secure token to authorized personnel to grant workspace access.</p>
            <div className="text-5xl md:text-6xl font-mono text-[#00FF66] tracking-widest bg-[#0D1117] py-10 rounded-2xl border border-white/10 mb-6 shadow-inner select-all cursor-pointer hover:border-[#00FF66]/30 transition-colors">
              {project.inviteCode}
            </div>
          </div>
        )}

        {/* ABOUT SCREEN */}
        {activeTab === 'ABOUT' && (
          <div className="max-w-2xl bg-[#161B22] p-10 rounded-3xl border border-white/5 shadow-2xl animate-fade-slide-in-2">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">HackLogger <span className="text-[#00FF66] font-mono text-sm font-normal border border-[#00FF66]/30 px-2 py-0.5 rounded-full bg-[#00FF66]/10">v2.0.0</span></h3>
            <p className="mb-6 text-slate-400 text-sm leading-relaxed">Engineered to eliminate context switching and centralize knowledge mapping during rapid development cycles.</p>
            <div className="space-y-4">
              <div className="bg-[#0D1117] p-4 rounded-xl border border-white/5">
                <p className="text-white text-sm font-bold mb-1">Global Network</p>
                <p className="text-slate-500 text-xs">Access open-source logs from concurrent development teams.</p>
              </div>
              <div className="bg-[#0D1117] p-4 rounded-xl border border-white/5">
                <p className="text-white text-sm font-bold mb-1">Execution Logs</p>
                <p className="text-slate-500 text-xs">Isolated tracking for completed algorithms and architecture implementation.</p>
              </div>
              <div className="bg-[#0D1117] p-4 rounded-xl border border-white/5">
                <p className="text-white text-sm font-bold mb-1">Data Links</p>
                <p className="text-slate-500 text-xs">Automated extraction and indexing of external repository and documentation URLs.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}