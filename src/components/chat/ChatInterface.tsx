'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { mockChatMessages, mockDMThreads, mockIssues } from '@/data/mockData';
import { Hash, Bell, Send, Smile, Info, MoreVertical, Paperclip, Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Pre-calculate rooms outside component to avoid hydration issues IF they are constant
const CONSTANT_CHANNELS = [
  { id: 'general', name: '#general' },
  { id: 'roads-dept', name: '#roads-dept' },
  { id: 'water-dept', name: '#water-dept' },
  { id: 'waste-dept', name: '#waste-dept' },
];

const STABLE_ISSUE_THREADS = mockIssues.slice(0, 5).map((issue) => ({
  id: issue.id,
  name: issue.id,
  title: issue.title,
  lastMessage: `${issue.status} update`,
  unread: 0, // Start with 0 unread for stability
}));

export const ChatInterface = () => {
  const {
    currentUser,
    messages,
    sendMessage,
    activeRoom,
    setActiveRoom,
  } = useAppContext() as any;
  const { toast } = useToast();

  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(activeRoom || 'general');
  const [sortedMessages, setSortedMessages] = useState<any[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [mockIntervalId, setMockIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter((m: any) => m.roomId === selectedRoom);
  }, [messages, selectedRoom]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setActiveRoom(selectedRoom);
  }, [selectedRoom, setActiveRoom]);

  useEffect(() => {
    setSortedMessages(filteredMessages);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [filteredMessages]);

  const toggleMockAdminMessages = () => {
    if (mockIntervalId) {
      clearInterval(mockIntervalId);
      setMockIntervalId(null);
      toast({ title: 'Mock Messages Disabled' });
    } else {
      const id = setInterval(() => {
        setTyping('Admin is typing...');
        setTimeout(() => {
          sendMessage(selectedRoom, `Mock regular update from Admin at ${new Date().toLocaleTimeString()}`);
          setTyping(null);
        }, 1500);
      }, 10000);
      setMockIntervalId(id);
      toast({ title: 'Mock Messages Enabled (every 10s)' });
    }
  };

  useEffect(() => {
    return () => {
      if (mockIntervalId) clearInterval(mockIntervalId);
    };
  }, [mockIntervalId]);

  const members = ['Ali Hassan', 'Bilal Raza', 'Kamran Shah', 'Tariq Mehmood', 'Admin User'];
  const mentionCandidates = members.filter((m) => m.toLowerCase().includes(mentionQuery.toLowerCase()));

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(selectedRoom, text);
    setText('');
    setMentionOpen(false);
    setMentionQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    
    // Auto resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }

    const atIndex = val.lastIndexOf('@');
    if (atIndex >= 0 && !val.substring(atIndex).includes(' ')) {
      setMentionOpen(true);
      setMentionQuery(val.slice(atIndex + 1));
    } else {
      setMentionOpen(false);
      setMentionQuery('');
    }
  };

  const insertEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen w-full bg-slate-50 relative overflow-hidden font-body">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 relative z-10 shadow-sm hidden md:flex">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between shadow-sm relative z-10">
          <h2 className="font-black text-xl text-primary tracking-tight">Messages</h2>
          <div className="flex gap-2">
            <button 
              onClick={toggleMockAdminMessages} 
              className={cn("p-2 rounded-full transition-colors", mockIntervalId ? "bg-accent/20 text-accent" : "hover:bg-slate-100 text-slate-500")}
              title="Toggle Admin Mock Messages"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          <div className="space-y-1">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-2 mb-2">Channels</h3>
            {CONSTANT_CHANNELS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedRoom(c.id)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 group',
                  selectedRoom === c.id ? 'bg-primary text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <Hash className={cn("w-4 h-4", selectedRoom === c.id ? "text-primary-foreground/70" : "text-slate-400 group-hover:text-primary")} /> 
                <span className="font-bold text-sm tracking-tight">{c.name.replace('#', '')}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-2 mb-2">Direct Messages</h3>
            {mockDMThreads.map((dm) => (
              <button
                key={dm.id}
                onClick={() => setSelectedRoom(dm.id)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group',
                  selectedRoom === dm.id ? 'bg-primary text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs shadow-inner">
                    {dm.participantName.charAt(0)}
                  </div>
                  <span className="font-bold text-sm tracking-tight">{dm.participantName}</span>
                </div>
                {dm.unread > 0 && <span className="text-[10px] bg-accent text-white font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">{dm.unread}</span>}
              </button>
            ))}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-2 mb-2">Issue Threads</h3>
            {STABLE_ISSUE_THREADS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedRoom(t.id)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-xl transition-all group',
                  selectedRoom === t.id ? 'bg-primary text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm tracking-tight">{t.name}</span>
                  {t.unread > 0 && <span className="text-[10px] bg-accent text-white font-bold px-1.5 py-0.5 rounded-full shadow-sm">{t.unread}</span>}
                </div>
                <p className={cn("text-xs truncate", selectedRoom === t.id ? "text-primary-foreground/80" : "text-slate-500")}>{t.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col relative bg-[#E5E5EA]/30">
        {/* Chat Background Pattern (WhatsApp aesthetic) */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Chat Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200/60 bg-white/80 backdrop-blur-md relative z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
              {selectedRoom.startsWith('dm-') ? selectedRoom.charAt(3).toUpperCase() : <Hash className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-800">
                {selectedRoom.startsWith('dm-') ? mockDMThreads.find((d) => d.id === selectedRoom)?.participantName : selectedRoom}
              </h2>
              <p className="text-xs font-medium text-accent">
                {messages.filter((m: any) => m.roomId === selectedRoom).length} messages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><Info className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative z-10 scroll-smooth">
          {sortedMessages.map((msg, idx) => {
            const isSelf = msg.senderId === currentUser?.id || msg.senderId === currentUser?.email;
            const showAvatar = idx === 0 || sortedMessages[idx - 1].senderId !== msg.senderId;
            
            return (
              <div key={msg.id} className={cn("flex w-full group", isSelf ? "justify-end" : "justify-start")}>
                <div className={cn("flex max-w-[85%] md:max-w-[65%] items-end gap-2", isSelf ? "flex-row-reverse" : "flex-row")}>
                  {!isSelf && showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm border border-white">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  {!isSelf && !showAvatar && <div className="w-8 shrink-0"></div>}
                  
                  <div className={cn(
                    "flex flex-col relative px-4 py-2.5 shadow-sm group-hover:shadow transition-shadow",
                    isSelf 
                      ? "bg-accent text-white rounded-2xl rounded-br-sm" 
                      : "bg-white text-slate-800 rounded-2xl rounded-bl-sm border border-slate-100/50"
                  )}>
                    {!isSelf && showAvatar && (
                      <span className="text-[11px] font-black tracking-wide text-primary mb-1">{msg.senderName}</span>
                    )}
                    <div className={cn("text-[15px] leading-relaxed break-words", isSelf ? "text-white" : "text-slate-800")}>
                      {msg.message.split(' ').map((word: string, i: number) => {
                        if (word.startsWith('@')) return <span key={i} className="font-bold text-blue-500">{word} </span>;
                        if (word.match(/^ISS-\d+/)) return <span key={i} className="bg-black/10 px-1.5 py-0.5 rounded text-[13px] font-mono mx-0.5 cursor-pointer hover:bg-black/20 transition-colors uppercase">{word}</span>;
                        return word + ' ';
                      })}
                    </div>
                    <div className={cn("text-[10px] font-bold mt-1.5 flex items-center justify-end gap-1", isSelf ? "text-accent-foreground/70" : "text-slate-400")}>
                      {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isSelf && <CheckCheck className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {typing && (
            <div className="flex w-full justify-start animate-pulse">
              <div className="flex max-w-[85%] items-end gap-2">
                <div className="w-8 shrink-0"></div>
                <div className="bg-white text-slate-500 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 flex items-center gap-1">
                  <span className="text-xs font-bold mr-2">{typing}</span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div className="h-4"></div>
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-md border-t border-slate-200/60 p-4 relative z-10 w-full shrink-0 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
          
          {/* Mention Popover */}
          {mentionOpen && mentionCandidates.length > 0 && (
            <div className="absolute bottom-full left-4 mb-2 w-64 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-xs font-bold tracking-wider text-slate-500 uppercase">Users</div>
              <div className="max-h-48 overflow-y-auto p-1">
                {mentionCandidates.map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      const val = text;
                      const atIndex = val.lastIndexOf('@');
                      if (atIndex >= 0) {
                        setText(`${val.slice(0, atIndex + 1)}${name} `);
                        if (textareaRef.current) textareaRef.current.focus();
                      }
                      setMentionOpen(false);
                      setMentionQuery('');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-bold text-slate-700 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Emoji Popover */}
          {showEmojiPicker && (
            <div className="absolute bottom-full left-12 mb-2 p-2 rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-bottom-2 z-20">
              <div className="grid grid-cols-6 gap-1">
                {['😀','😂','😍','😎','👍','🙏','💡','🚧','🌳','💧','🔔','🎉'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => insertEmoji(emoji)}
                    className="w-8 h-8 text-xl flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div className="flex items-end gap-2 max-w-4xl mx-auto w-full">
            <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative bg-slate-50 border border-slate-200 rounded-2xl flex items-end focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-all shadow-sm">
              <button 
                onClick={() => setShowEmojiPicker((prev) => !prev)} 
                className={cn("p-2.5 text-slate-400 hover:text-accent rounded-full transition-colors shrink-0 mb-0.5", showEmojiPicker && "text-accent")}
              >
                <Smile className="w-6 h-6" />
              </button>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextareaChange}
                onKeyDown={onKeyDown}
                rows={1}
                className="flex-1 max-h-32 min-h-[44px] py-3 px-2 bg-transparent resize-none focus:outline-none text-[15px]"
                placeholder={`Message ${selectedRoom}`}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="p-3.5 bg-accent text-white rounded-full hover:bg-accent/90 disabled:opacity-50 disabled:hover:bg-accent transition-all shrink-0 shadow-md transform active:scale-95"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
