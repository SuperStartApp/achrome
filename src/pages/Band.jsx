import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music } from 'lucide-react';

const Band = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const { data } = await supabase.from('members').select('*');
    if (data) setMembers(data);
  }

  return (
    <div className="p-6 pb-24">
      <h2 className="text-4xl font-black mb-8 tracking-tighter">THE BAND</h2>
      
      {/* Griglia Membri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {members.length === 0 ? (
          <p className="text-zinc-500 text-center col-span-full py-10">Nessun membro inserito nel database...</p>
        ) : (
          members.map((member, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={member.id} 
              onClick={() => setSelectedMember(member)}
              className="group relative bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-4 rounded-3xl cursor-pointer hover:border-green-500/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={member.photo_url} 
                    className="w-24 h-24 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    alt={member.name} 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-black p-1 rounded-full">
                    <Music size={14} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-zinc-400 font-medium">{member.role}</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Clicca per leggere la storia $\rightarrow$
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL DELLA STORIA */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Overlay scuro */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Finestra Modal */}
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-zinc-900 border-t border-zinc-800 sm:border sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              {/* Header Modal */}
              <div className="relative h-48">
                <img src={selectedMember.photo_url} className="w-full h-full object-cover" alt={selectedMember.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                <button 
                  onClick={() => setSelectedMember(null)} 
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenuto Modal */}
              <div className="p-6 pt-0 -mt-8 relative">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-3xl font-black">{selectedMember.name}</h3>
                  <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                    {selectedMember.role}
                  </span>
                </div>
                <p className="text-zinc-300 leading-relaxed font-light">
                  {selectedMember.bio}
                </p>
                
                <button 
                  onClick={() => setSelectedMember(null)} 
                  className="w-full mt-8 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-2xl font-bold transition-all"
                >
                  Chiudi Profilo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Band;