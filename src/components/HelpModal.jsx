import React from 'react';
import { X, CheckCircle, Layout, BookOpen, Star, Zap, Image as ImageIcon } from 'lucide-react';

const HelpModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
        {/* Header */}
        <div className="sticky top-0 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-2xl">
              <BookOpen className="text-blue-400 w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">How to Use Unfold</h2>
              <p className="text-sm text-slate-400 mt-1">Your guide to mastering your workflow canvas.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all transform hover:rotate-90 hover:scale-110"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-10">
          
          <section className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>
            <h3 className="text-xl font-black text-blue-400 mb-4 flex items-center gap-3">
              <Layout size={24} className="text-blue-500" /> What is Unfold?
            </h3>
            <p className="text-slate-300 leading-relaxed text-[15px]">
              Unfold is a modern, personalized tracker designed to give you clarity on your goals and daily tasks. 
              Instead of endless messy lists, you organize your life into <strong className="text-white font-bold">Primary Topics</strong> and break them down into <strong className="text-white font-bold">Sub-topics</strong>.
              Whether you are preparing for job interviews, tracking a massive project, or mapping out a learning journey, Unfold adapts to your style.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-black text-emerald-400 mb-6 flex items-center gap-3 px-2">
              <CheckCircle size={24} /> What Can You Use Unfold For?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-emerald-900/30 hover:border-emerald-500/30 transition-colors flex gap-4">
                <div className="mt-1"><Star className="text-emerald-400" size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-100 mb-1 text-[15px]">Career Preparation</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Map out topics like "System Design", "React.js", "Algorithms" and add specific concepts you need to master under each.</p>
                </div>
              </div>
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-purple-900/30 hover:border-purple-500/30 transition-colors flex gap-4">
                <div className="mt-1"><Zap className="text-purple-400" size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-100 mb-1 text-[15px]">Project Milestones</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Use parent topics for major milestones and sub-topics for individual features and bugs you need to resolve.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-black text-amber-400 mb-6 flex items-center gap-3 px-2">
              <Zap size={24} /> Key Features & Controls
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <div className="bg-slate-800 p-2 rounded-xl shrink-0"><CheckCircle size={18} className="text-slate-300" /></div>
                <div>
                  <h4 className="font-bold text-white text-[15px]">Creating & Completing</h4>
                  <p className="text-sm text-slate-400 mt-1">Add a topic using the input field. Once added, type sub-topics inside it. Click the circle next to any item to instantly mark it as complete.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <div className="bg-slate-800 p-2 rounded-xl shrink-0"><Star size={18} className="text-amber-400" /></div>
                <div>
                  <h4 className="font-bold text-white text-[15px]">Pinning Items</h4>
                  <p className="text-sm text-slate-400 mt-1">Click the <strong className="text-slate-300">Pin icon</strong> to freeze important goals at the top of your list. Pinned topics will always appear before unpinned ones.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <div className="bg-slate-800 p-2 rounded-xl shrink-0"><ImageIcon size={18} className="text-blue-400" /></div>
                <div>
                  <h4 className="font-bold text-white text-[15px]">PDF Export</h4>
                  <p className="text-sm text-slate-400 mt-1">Need a hard copy? Click the <strong className="text-slate-300">Printer icon</strong> in the top navigation bar to generate a beautifully stylized PDF of your entire roadmap.</p>
                </div>
              </div>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
