import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  }

  return (
    <div className="p-6 pb-24">
      <h2 className="text-4xl font-black mb-8 tracking-tighter">GALLERY</h2>
      
      {/* Griglia Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ scale: 0.98 }}
            onClick={() => setSelectedItem(item)}
            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-800"
          >
            {item.type === 'image' ? (
              <img src={item.url} className="w-full h-full object-cover" alt={item.caption} />
            ) : (
              <video src={item.url} className="w-full h-full object-cover" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
            )}
            {/* Overlay al passaggio del mouse */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
              <p className="text-xs font-medium truncate">{item.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX (Modal a tutto schermo) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
          >
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-6 right-6 text-white p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="max-w-4xl w-full flex flex-col items-center"
            >
              {selectedItem.type === 'image' ? (
                <img src={selectedItem.url} className="max-h-[80vh] rounded-2xl shadow-2xl" alt={selectedItem.caption} />
              ) : (
                <video src={selectedItem.url} controls autoPlay className="max-h-[80vh] rounded-2xl shadow-2xl" />
              )}
              <p className="mt-6 text-xl font-medium text-zinc-300">{selectedItem.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;