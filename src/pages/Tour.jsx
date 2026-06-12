import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { MapPin, Calendar, Clock, ThumbsUp, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Tour = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
    if (data) setEvents(data);
  }

  const handleJoin = async (eventId, currentAttendees) => {
    const { error } = await supabase
      .from('events')
      .update({ attendees: currentAttendees + 1 })
      .eq('id', eventId);
    
    if (!error) {
      // Ricarichiamo gli eventi per aggiornare il numero a schermo
      fetchEvents();
    }
  };

  const openMaps = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <div className="p-6 pb-24">
      <h2 className="text-4xl font-black mb-8 tracking-tighter">TOUR DATE</h2>
      
      <div className="grid gap-6">
        {events.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">Nessuna data in programma al momento...</p>
        ) : (
          events.map((event, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.1 }}
              key={event.id} 
              className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl overflow-hidden shadow-xl"
            >
              {/* Immagine Condizionale */}
              {event.image_url && (
                <img src={event.image_url} className="w-full h-40 object-cover" alt={event.title} />
              )}

              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{event.title}</h3>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                      <MapPin size={14} className="text-red-500" />
                      <span>{event.address}</span>
                    </div>
                  </div>
                  {/* Prezzo Condizionale */}
                  {event.price && event.price > 0 && (
                    <span className="bg-white text-black px-3 py-1 rounded-full font-bold text-sm">
                      €{event.price}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-zinc-300 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} /> {new Date(event.date).toLocaleDateString('it-IT')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} /> {event.time}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  {/* Mappa */}
                  <button 
                    onClick={() => openMaps(event.address)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm font-medium"
                  >
                    <ExternalLink size={16} /> Navigatore
                  </button>

                  {/* Ci sarò */}
                  <button 
                    onClick={() => handleJoin(event.id, event.attendees)}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-red-900/30 text-zinc-400 hover:text-red-500 px-4 py-3 rounded-2xl transition-all border border-transparent hover:border-red-500/50"
                  >
                    <ThumbsUp size={18} />
                    <span className="font-bold">{event.attendees}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tour;