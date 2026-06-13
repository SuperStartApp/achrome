import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Play, Pause, ExternalLink, Music, UserPlus, Check, Heart, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const audioRef = useRef(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')); 
  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('*').single();
      if (data) setSettings(data);
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
    setSubmitting(true);
    const { error } = await supabase.from('subscribers').insert([{ email }]);
    if (!error) {
      alert("Grazie! Ti abbiamo aggiunto alla lista.");
      setEmail('');
    } else {
      alert("Errore nell'iscrizione.");
    }
    setSubmitting(false);
  };

  if (!settings) return <div className="h-screen bg-black flex items-center justify-center text-white">Caricamento...</div>;

  return (
    <div className="bg-black min-h-screen flex flex-col">
      
      {/* 1. HEADER SECTION (Solo Immagine + Nome Band) */}
      <header className="relative h-[70vh] w-full flex items-end pb-10 px-8 overflow-hidden">
        {/* Immagine di Sfondo */}
        <div className="absolute inset-0 z-0">
          <img 
            src={settings.home_image_url} 
            className="w-full h-full object-cover opacity-70" 
            alt="Achrome Background" 
          />
          {/* Gradiente che sfuma verso il basso per connettersi al nero della pagina */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        {/* Nome della Band (In basso a sinistra sulla foto) */}
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 text-6xl md:text-8xl font-black tracking-tighter"
        >
          ACHROME
        </motion.h1>
      </header>

      {/* 2. MAIN CONTENT SECTION (Testo, Tasti, Donazioni, Newsletter) */}
      <main className="flex-grow flex flex-col items-center px-6">
        
        {/* Testo Dinamico (Appena fuori dalla foto) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-4xl text-left mb-10"
        >
          <p className="text-xl md:text-2xl font-medium text-zinc-300 leading-relaxed">
            {settings.home_text}
          </p>
        </motion.div>

        {/* Action Bar (Tasti Play, Segui, Spotify) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center gap-4 mb-16"
        >
          {/* Tasto Play */}
          <button 
            onClick={toggleAudio}
            className="bg-green-500 text-black p-5 rounded-full shadow-xl hover:bg-green-400 transition-all active:scale-95"
          >
            {isPlaying ? <Pause fill="black" size={32} /> : <Play fill="black" size={32} />}
          </button>

          {/* Tasto Segui */}
          <button 
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all active:scale-95 ${
              isFollowing ? 'bg-zinc-800 text-white' : 'bg-white text-black'
            }`}
          >
            {isFollowing ? <><Check size={20}/> Seguito</> : <><UserPlus size={20}/> Segui già</>}
          </button>

          {/* Tasto Spotify */}
          <a 
            href={settings.spotify_link || "#"} 
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-zinc-800/80 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold hover:bg-zinc-700 transition-all active:scale-95"
          >
            <Music size={20} /> Spotify <ExternalLink size={16} />
          </a>
        </motion.div>

        {/* Sezione Donazione (Solo se attiva) */}
        {settings.donation_enabled && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-md mb-20"
          >
            <a 
              href="https://paypal.me/tuouser" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg transition-all"
            >
              <Heart size={24} fill="white" /> Sostieni la Band
            </a>
          </motion.div>
        )}

        {/* Sezione Newsletter */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-md text-center mb-24"
        >
          <h3 className="text-xl font-bold mb-2">Rimani aggiornato</h3>
          <p className="text-zinc-400 text-sm mb-6">Iscriviti per ricevere le date dei nuovi concerti e news esclusive.</p>
          
          <form onSubmit={handleSubscribe} className="flex w-full gap-2">
            <input 
              type="email" 
              placeholder="la-tua-mail@esempio.com" 
              className="flex-grow bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-green-500 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-white text-black p-4 rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </motion.section>

      </main>
    </div>
  );
};

export default Home;