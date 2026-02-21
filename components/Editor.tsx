'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import { useState, useEffect } from 'react';
import { 
  Save, Upload, Moon, Sun, Bold, Italic, Heading1, Heading2, 
  Undo, Redo, Terminal, Folder, Eye, Code as CodeIcon, Plus, Trash2, AlertCircle
} from 'lucide-react';

const lowlight = createLowlight(all);

export default function Editor() {
  const [filename, setFilename] = useState('nuova-nota.md');
  const [files, setFiles] = useState<string[]>([]);
  const [dark, setDark] = useState(true);
  const [view, setView] = useState<'visual' | 'source'>('visual');
  const [sourceContent, setSourceContent] = useState('');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [tempNewName, setTempNewName] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }), 
      Markdown, 
      CodeBlockLowlight.configure({ lowlight })
    ],
    content: '# Nuova Nota',
    immediatelyRender: false, // Risolve l'errore SSR / Hydration mismatch
    editorProps: { 
      attributes: { class: 'prose dark:prose-invert max-w-none focus:outline-none p-10 min-h-[800px]' } 
    },
    onUpdate: ({ editor }) => {
      const md = (editor.storage.markdown as any).getMarkdown();
      setSourceContent(md);
    }
  });

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (Array.isArray(data)) setFiles(data);
    } catch (e) { console.error("Errore fetch lista file"); }
  };

  useEffect(() => { fetchFiles(); }, []);

  const createNewNote = () => {
    const defaultContent = '# Nuova Nota';
    editor?.commands.setContent(defaultContent);
    setSourceContent(defaultContent);
    setFilename('nuova-nota.md');
  };

  const saveToServer = async () => {
    if (!editor || !filename.trim()) return;
    const content = view === 'visual' ? (editor.storage.markdown as any).getMarkdown() : sourceContent;
    await fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, content }),
    });
    fetchFiles();
  };

  const deleteFile = async (name: string) => {
    if (!confirm(`Eliminare definitivamente ${name}?`)) return;
    await fetch(`/api/files?file=${name}`, { method: 'DELETE' });
    if (filename === name) createNewNote();
    fetchFiles();
  };

  const loadFile = async (name: string) => {
    const res = await fetch(`/api/files?file=${name}`);
    const data = await res.json();
    editor?.commands.setContent(data.content);
    setSourceContent(data.content);
    setFilename(name);
  };

  const handleRename = async (oldName: string) => {
    if (!tempNewName.trim() || tempNewName === oldName) { setEditingFile(null); return; }
    await fetch('/api/files', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldName, newName: tempNewName }),
    });
    if (filename === oldName) setFilename(tempNewName);
    setEditingFile(null);
    fetchFiles();
  };

  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const r = new FileReader();
      r.onload = (ev) => {
        const c = ev.target?.result as string;
        editor?.commands.setContent(c);
        setSourceContent(c);
        setFilename(file.name);
      };
      r.readAsText(file);
    }
  };

  const isFilenameInvalid = !filename.trim() || filename.trim() === '.md';

  if (!editor) return null;

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden transition-colors">
        
        {/* SIDEBAR */}
        <div className="w-72 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex flex-col shadow-xl z-20">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Folder size={14} /> Archivio
            </span>
            <button onClick={createNewNote} className="text-blue-500 hover:rotate-90 transition-transform duration-200">
              <Plus size={22}/>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
            {files.map(f => (
              <div key={f} className="group flex items-center mb-1">
                {editingFile === f ? (
                  <input autoFocus className="flex-1 p-2 text-sm bg-white dark:bg-zinc-800 border-2 border-blue-500 rounded outline-none shadow-lg" value={tempNewName} onChange={e => setTempNewName(e.target.value)} onBlur={() => handleRename(f)} onKeyDown={e => e.key === 'Enter' && handleRename(f)} />
                ) : (
                  <>
                    <button onClick={() => loadFile(f)} onDoubleClick={() => { setEditingFile(f); setTempNewName(f); }} className={`flex-1 text-left p-2 rounded text-sm truncate transition-all ${filename === f ? 'bg-blue-600 text-white shadow-md font-bold' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}>
                      {f}
                    </button>
                    <button onClick={() => deleteFile(f)} className="p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all ml-1">
                      <Trash2 size={14}/>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <label className="flex items-center justify-center gap-2 p-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 text-[10px] font-black uppercase transition-all shadow-sm">
              <Upload size={14} /> Carica Locale
              <input type="file" hidden accept=".md" onChange={handleLocalUpload} />
            </label>
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          <div className="sticky top-0 z-[100] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-2 flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <div className="flex bg-zinc-200 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-300 dark:border-zinc-700 mr-4">
                <button onClick={() => setView('visual')} className={`px-4 py-1.5 rounded-md text-[10px] font-black flex items-center gap-2 transition-all ${view === 'visual' ? 'bg-white dark:bg-zinc-700 text-blue-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}>
                  <Eye size={14} /> VISUAL
                </button>
                <button onClick={() => setView('source')} className={`px-4 py-1.5 rounded-md text-[10px] font-black flex items-center gap-2 transition-all ${view === 'source' ? 'bg-white dark:bg-zinc-700 text-blue-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}>
                  <CodeIcon size={14} /> SOURCE
                </button>
              </div>
              
              {view === 'visual' && (
                <div className="flex items-center gap-0.5">
                  <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"><Heading1 size={18}/></button>
                  <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"><Heading2 size={18}/></button>
                  <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1.5" />
                  <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-md ${editor.isActive('bold') ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}><Bold size={18}/></button>
                  <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-md ${editor.isActive('italic') ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}><Italic size={18}/></button>
                  <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded-md ${editor.isActive('codeBlock') ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}><Terminal size={18}/></button>
                  <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1.5" />
                  <button onClick={() => editor.chain().focus().undo().run()} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"><Undo size={18}/></button>
                  <button onClick={() => editor.chain().focus().redo().run()} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"><Redo size={18}/></button>
                  
                  {editor.isActive('codeBlock') && (
                    <select className="ml-3 text-[10px] font-bold bg-blue-600 text-white rounded-full px-4 py-1.5 border-none outline-none cursor-pointer shadow-lg shadow-blue-500/20" value={editor.getAttributes('codeBlock').language || 'auto'} onChange={e => editor.chain().focus().updateAttributes('codeBlock', { language: e.target.value }).run()}>
                      <option value="auto">Auto-Detect</option>
                      <option value="javascript">JS</option>
                      <option value="python">Python</option>
                      <option value="bash">Bash</option>
                      <option value="yaml">YAML</option>
                    </select>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <input value={filename} onChange={e => setFilename(e.target.value)} className={`bg-transparent border-b px-2 py-1 text-xs w-52 outline-none font-mono transition-all ${isFilenameInvalid ? 'border-red-500 text-red-500' : 'border-zinc-300 dark:border-zinc-700 focus:border-blue-500'}`} />
                {isFilenameInvalid && <AlertCircle size={14} className="absolute right-0 top-1.5 text-red-500" />}
              </div>
              <button onClick={() => setDark(!dark)} className="p-2 border dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm">
                {dark ? <Sun size={18}/> : <Moon size={18}/>}
              </button>
              <button 
                onClick={saveToServer} 
                disabled={isFilenameInvalid}
                className={`flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all active:scale-95 ${isFilenameInvalid ? 'opacity-50 cursor-not-allowed bg-zinc-500' : ''}`}
              >
                <Save size={14} /> Salva
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900">
            <div className="max-w-4xl mx-auto py-12 px-6 min-h-full">
              {view === 'visual' ? (
                <EditorContent editor={editor} />
              ) : (
                <textarea 
                  value={sourceContent} 
                  onChange={e => {
                    const val = e.target.value;
                    setSourceContent(val);
                    editor.commands.setContent(val);
                  }} 
                  className="w-full h-[82vh] font-mono text-sm bg-zinc-50 dark:bg-zinc-950 p-10 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 outline-none resize-none shadow-inner leading-relaxed text-zinc-800 dark:text-zinc-300" 
                  spellCheck={false} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .prose pre { background: #0f172a !important; color: #f1f5f9; padding: 2rem !important; border-radius: 1rem; border: 1px solid #1e293b; font-family: 'Fira Code', monospace; margin: 2rem 0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .hljs-keyword { color: #7dd3fc; font-weight: bold; } 
        .hljs-string { color: #86efac; } 
        .hljs-comment { color: #64748b; font-style: italic; }
        .hljs-function { color: #fbbf24; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
