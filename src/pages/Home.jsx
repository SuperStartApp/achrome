import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Play, Pause, ExternalLink, Music, Send, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [email, setEmail] = useState('');
  const audioRef = useRef(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')); 
  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('*').single();
      if (data) {
        setSettings(data);
        if (data.audio_preview_url) audioRef.current.src = data.audio_preview_url;
      }
    }
    fetchSettings();
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.log(e));
      setIsPlaying(true);
      timerRef.current = setTimeout(() => {
        audioRef.current.pause();
        setIsPlaying(false);
      }, 30000);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    const { error } = await supabase.from('subscribers').insert([{ email }]);
    if (error) alert("Errore iscrizione!");
    else {
      alert("Grazie per esserti iscritto!");
      setEmail('');
    }
  };

  if (!settings) return <div className="h-screen bg-black flex items-center justify-center text-white">Caricamento...</div>;

  return (
    <div className="pb-20">
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-center p-6 overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="absolute inset-0 z-0">
          <img src={settings.home_image_url} className="w-full h-full object-cover opacity-60" alt="Band Background" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
            ACHROME
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="text-lg md:text-xl opacity-80 max-w-md mb-8 font-light">
            {settings.home_text}
          </motion.p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleAudio} className="bg-green-500 text-black p-4 rounded-full shadow-xl hover:bg-green-400 transition-colors">
              {isPlaying ? <Pause fill="black" /> : <Play fill="black" />}
            </motion.button>
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={settings.spotify_link || "#"} target="_blank" className="bg-zinc-800 text-white p-4 rounded-full shadow-xl hover:bg-zinc-700 transition-colors flex items-center gap-2 px-6">
              <Music size={20} /> <span>Spotify</span> <ExternalLink size={16} />
            </motion.a>
            {/* TASTO DONAZIONE CONDIZIONALE */}
            {settings.donation_enabled && (
              <motion.a 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                href="https://paypal.me/tuouser" 
                target="_blank" 
                className="bg-red-600 text-white p-4 rounded-full shadow-xl hover:bg-red-500 transition-colors flex items-center gap-2 px-6"
              >
                <Heart size={20} fill="white" /> Sostieni la Band
              </motion.a>
            )}
          </div>
        </div>
      </section>

      {/* SEZIONE NEWSLETTER */}
      <section className="p-10 bg-zinc-900/50 border-t border-zinc-800 flex flex-col items-center text-center">
        <h3 className="text-2xl font-bold mb-2">Rimani aggiornato</h3>
        <p className="text-zinc-400 mb-6 max-w-xs">Iscriviti per ricevere le date dei nuovi concerti e news esclusive.</p>
        <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
          <input 
            type="email" 
            placeholder="la-tua-mail@esempio.com" 
            className="flex-grow bg-black border border-zinc-700 p-4 rounded-2xl outline-none focus:border-green-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="bg-white text-black p-4 rounded-2xl hover:bg-zinc-200 transition-all">
            <Send size={20} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home;