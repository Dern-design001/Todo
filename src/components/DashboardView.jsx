import React, { useState } from 'react';
import { Plus, Trash2, Check, ChevronDown, ChevronRight, Pin, X, Circle, FileText } from 'lucide-react';

const DashboardView = ({
  topics, input, setInput, addTopic, editingId, setEditingId, editText, setEditText,
  saveEdit, toggleComplete, togglePin, deleteTopic, updateTopicNotes, expandedTopics, setExpandedTopics,
  subTopicInputs, setSubTopicInputs, addSubTopic, toggleSubTopic, toggleSubTopicPin, deleteSubTopic
}) => {
  const [activeNoteId, setActiveNoteId] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-6 pt-10 pb-20">
      {/* Input Form */}
      <form onSubmit={addTopic} className="flex gap-3 mb-12 group">
        <input 
          type="text" 
          placeholder="Add new main topic..."
          className="flex-grow bg-slate-900/40 backdrop-blur-md border-2 border-slate-800 rounded-[1.5rem] py-5 px-8 text-lg text-white outline-none focus:border-blue-500 transition-all shadow-xl placeholder:text-slate-600"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-8 rounded-[1.5rem] font-bold hover:bg-blue-500 shadow-xl shadow-blue-900/40 active:scale-95 transition-all"
        >
          <Plus size={28} />
        </button>
      </form>

      {/* Topics List */}
      <div className="space-y-8">
        {topics.map((topic) => {
          const topicTotal = 1 + topic.subTopics.length;
          const topicDone = (topic.completed ? 1 : 0) + topic.subTopics.filter(s => s.completed).length;
          const topicPercent = Math.round((topicDone / topicTotal) * 100);

          const sortedSubTopics = [...topic.subTopics].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return 0;
          });

          return (
            <div 
              key={topic.id} 
              className={`bg-slate-900/60 backdrop-blur-xl rounded-[2.2rem] border transition-all overflow-hidden ${
                topic.isPinned 
                  ? 'ring-2 ring-blue-500/30 border-blue-500/40 shadow-2xl shadow-blue-900/50' 
                  : 'border-slate-800/50 shadow-xl'
              } ${
                topic.completed && topicPercent === 100 
                  ? 'bg-emerald-900/10 border-emerald-500/30' 
                  : ''
              }`}
            >
              <div className="p-7">
                <div className="flex items-center gap-5">

                  {/* Tick Checkbox */}
                  <button 
                    onClick={() => toggleComplete(topic)} 
                    className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${
                      topic.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110' 
                        : 'bg-slate-950 border-slate-700 text-transparent hover:border-blue-500'
                    }`}
                  >
                    <Check size={24} strokeWidth={3} />
                  </button>

                  <div className="flex-grow min-w-0">
                    {editingId === topic.id ? (
                      <div className="flex items-center gap-3">
                        <input 
                          autoFocus
                          className="w-full bg-slate-950/50 text-white border-b-2 border-blue-500 outline-none py-1 px-2 font-black text-2xl"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => saveEdit(topic.id)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(topic.id)}
                        />
                        <button onClick={() => setEditingId(null)} className="text-slate-500">
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-2 overflow-hidden flex-grow">
                            {topic.isPinned && <Pin size={18} className="text-blue-400 fill-blue-400 shrink-0" />}
                            <span 
                              onClick={() => { setEditingId(topic.id); setEditText(topic.text); }}
                              className={`text-2xl font-black tracking-tight cursor-text whitespace-nowrap overflow-hidden transition-colors duration-300 ${
                                topic.completed ? 'text-slate-500' : 'text-slate-100'
                              }`}
                            >
                              {topic.text}
                            </span>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg shrink-0 ml-4 ${
                            topicPercent === 100 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {topicPercent}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-950/50 rounded-full overflow-hidden mt-1 border border-slate-800/30">
                          <div 
                            className={`h-full transition-all duration-700 ease-out ${
                              topicPercent === 100 
                                ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                                : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                            }`}
                            style={{ width: `${topicPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => togglePin(topic)} 
                      className={`p-3 rounded-2xl transition-all ${
                        topic.isPinned 
                          ? 'text-blue-400 bg-blue-500/20' 
                          : 'text-slate-600 hover:text-blue-400 hover:bg-slate-800'
                      }`}
                    >
                      <Pin size={22} fill={topic.isPinned ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={() => {
                        setExpandedTopics(prev => ({ ...prev, [topic.id]: !prev[topic.id] }));
                      }} 
                      className={`p-3 rounded-2xl transition-all ${
                        expandedTopics[topic.id] 
                          ? 'bg-slate-800 text-white' 
                          : 'text-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {expandedTopics[topic.id] ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                    </button>
                    <button 
                      onClick={() => setActiveNoteId(topic.id)} 
                      className="p-3 text-slate-600 hover:text-blue-400 transition-colors"
                      title="Topic Notes"
                    >
                      <FileText size={22} />
                    </button>
                    <button 
                      onClick={() => deleteTopic(topic.id)} 
                      className="p-3 text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>

                {expandedTopics[topic.id] && (
                  <div className="mt-6 pt-6 border-t border-slate-800/50 animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-4 mb-6 pl-14">
                      {sortedSubTopics.map(sub => (
                        <div key={sub.id} className="flex items-center gap-4 group">
                          <button 
                            onClick={() => toggleSubTopic(topic.id, sub.id)} 
                            className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
                              sub.completed 
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' 
                                : 'bg-slate-950 border-slate-800 text-transparent group-hover:border-blue-500'
                            }`}
                          >
                            <Check size={16} strokeWidth={4} />
                          </button>
                          <div className="flex items-center gap-3 flex-grow min-w-0">
                            <div className={`w-2 h-2 rounded-full shrink-0 transition-all duration-300 ${
                              sub.isPinned 
                                ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' 
                                : 'bg-slate-700'
                            }`} />
                            <span className={`text-lg font-bold flex-grow truncate transition-colors duration-300 ${
                              sub.completed 
                                ? 'text-slate-500' 
                                : sub.isPinned 
                                  ? 'text-cyan-300' 
                                  : 'text-slate-300'
                            }`}>
                              {sub.text}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => toggleSubTopicPin(topic.id, sub.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                sub.isPinned 
                                  ? 'text-cyan-400 bg-cyan-400/10' 
                                  : 'text-slate-600 hover:text-cyan-400'
                              }`}
                              title="Pin Sub-task"
                            >
                              <Circle size={16} fill={sub.isPinned ? "currentColor" : "none"} strokeWidth={sub.isPinned ? 0 : 2} />
                            </button>
                            <button 
                              onClick={() => deleteSubTopic(topic.id, sub.id)}
                              className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="relative pl-14">
                      <input 
                        type="text" 
                        placeholder="Add specific sub-task..."
                        className="w-full bg-slate-950/50 border-2 border-slate-800/50 rounded-2xl py-4 px-6 pr-14 text-base text-white font-bold outline-none focus:border-blue-500/50 transition-all shadow-inner"
                        value={subTopicInputs[topic.id] || ''}
                        onChange={(e) => setSubTopicInputs({ ...subTopicInputs, [topic.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && addSubTopic(topic.id)}
                      />
                      <button 
                        onClick={() => addSubTopic(topic.id)} 
                        className="absolute right-3 top-2 bottom-2 aspect-square bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-90 transition-transform"
                      >
                        <Plus size={22} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes Modal */}
      {activeNoteId && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setActiveNoteId(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-800/50 p-6 flex justify-between items-center border-b border-slate-700/50 shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-3 truncate">
                <FileText className="text-blue-400 shrink-0" />
                <span className="truncate">Notes: {topics.find(t => t.id === activeNoteId)?.text}</span>
              </h3>
              <button 
                onClick={() => setActiveNoteId(null)} 
                className="text-slate-400 hover:text-white transition-colors shrink-0 bg-slate-800 p-2 rounded-full border border-slate-700 hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex-grow overflow-auto flex flex-col">
              <textarea
                autoFocus
                className="w-full flex-grow bg-slate-950/50 border-2 border-slate-800/80 rounded-2xl p-6 text-[17px] leading-relaxed text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-all min-h-[400px] resize-none shadow-inner"
                placeholder="Add your notes, links, or thoughts here..."
                value={topics.find(t => t.id === activeNoteId)?.notes || ''}
                onChange={(e) => updateTopicNotes(activeNoteId, e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
