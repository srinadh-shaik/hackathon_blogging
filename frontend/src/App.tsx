import { useState, useEffect } from 'react';
import type { User, Project } from './types';
import Auth from './components/Auth';
import ProjectHub from './components/ProjectHub';
import Dashboard from './components/Dashboard';
import ResponsiveHeroBanner from './components/ui/responsive-hero-banner';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('hackathon_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [project, setProject] = useState<Project | null>(() => {
    const savedProject = localStorage.getItem('hackathon_project');
    return savedProject ? JSON.parse(savedProject) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('hackathon_user', JSON.stringify(user));
    else localStorage.removeItem('hackathon_user');
  }, [user]);

  useEffect(() => {
    if (project) localStorage.setItem('hackathon_project', JSON.stringify(project));
    else localStorage.removeItem('hackathon_project');
  }, [project]);

  if (!user && showLanding) {
    return <ResponsiveHeroBanner onGetStarted={() => setShowLanding(false)} />;
  }

  if (!user) return <Auth onLogin={setUser} />;
  
  if (!project) return <ProjectHub user={user} onJoin={setProject} />;
  
  return <Dashboard user={user} project={project} onLogout={() => setProject(null)} />;
}