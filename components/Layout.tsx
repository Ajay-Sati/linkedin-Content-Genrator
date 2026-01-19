import React from 'react';
import { Activity, Radio, Cpu, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-background text-zinc-300 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 border-r border-border flex flex-col justify-between bg-surface/50 backdrop-blur-sm">
        <div>
          <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-border">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 font-bold text-white hidden md:block tracking-tight">PulseAI</span>
          </div>

          <nav className="p-4 space-y-2">
            <NavItem icon={<Radio size={20} />} label="Trend Scanner" active />
            <NavItem icon={<Cpu size={20} />} label="My Agents" />
            <NavItem icon={<Settings size={20} />} label="Configuration" />
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <button className="flex items-center space-x-3 w-full p-2 rounded-md hover:bg-zinc-800 text-zinc-500 transition-colors">
            <LogOut size={20} />
            <span className="hidden md:block text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md z-10">
          <h1 className="text-sm font-medium text-zinc-400">LinkedIn Authority Architect <span className="text-zinc-600 mx-2">/</span> Dashboard</h1>
          <div className="flex items-center space-x-4">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-mono text-zinc-500">SYSTEM OPERATIONAL</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-0">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`w-full flex items-center space-x-3 p-2 rounded-md transition-all duration-200 ${active ? 'bg-zinc-800 text-white shadow-sm' : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'}`}>
    {icon}
    <span className="hidden md:block text-sm font-medium">{label}</span>
  </button>
);

export default Layout;