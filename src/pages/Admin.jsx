import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Save, Lock, Unlock, Globe, Image as ImageIcon, Music, 
  Calendar, Users, ShoppingBag, Layout, Trash2, PlusCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Spostato fuori per ottimizzazione delle performance
const TabButton = ({ id, icon: Icon, label, activeTab, setActiveTab }) => (
  <button 
    onClick={() => setActiveTab(id)}
    className={`flex flex-col items-center gap-1 p-2 min-w-[70px] transition-all ${activeTab === id ? 'text-green-500 scale-110' : 'text-zinc-500'}`}
  >
    <Icon size={22} />
    <span className="text-[10px] font-bold uppercase">{label}</span>
  </button>
);

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    home_image_url: '',
    home_text: '',
    spotify_link: '',
    audio_preview_url: '',
    donation_enabled: false
  });
  const [tour, setTour] = useState([]);
  const [members, setMembers] = useState([]);
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);

  const [newTour, setNewTour] = useState({ title: '', date: '', time: '', address: '', image_url: '', price: 0 });
  const [newMember, setNewMember] = useState({ name: '', role: '', photo_url: '', bio: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, photo_url: '', paypal_link: '' });
  const [newGallery, setNewGallery] = useState({ type: 'image', url: '', caption: '' });

  useEffect(() => {
    if (isAuthenticated) fetchAllData();
  }, [isAuthenticated]);

  async function fetchAllData() {
    setLoading(true);
    try {
      const { data: s } = await supabase.from('site_settings').select('*').single();
      const { data: t } = await supabase.from('events').select('*').order('date', { ascending: true });
      const { data: m } = await supabase.from('members').select('*');
      const { data: p } = await supabase.from('products').select('*');
      const { data: g } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });

      if (s) setSettings(s);
      if (t) setTour(t);
      if (m) setMembers(m);
      if (p) setProducts(p);
      if (g) setGallery(g);
    } catch (err) {
      console.error("Errore caricamento dati:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = () => {
    if (pin === '123456') setIsAuthenticated(true);
    else alert('PIN Errato!');
  };

  const saveSettings = async () => {
    const { error } = await supabase.from('site_settings').update(settings).eq('id', 1);
    if (!error) alert('Impostazioni Home salvate!');
    else alert('Errore salvataggio');
  };

  const addItem = async (table, data, callback) => {
    const { error } = await supabase.from(table).insert([data]);
    if (!error) {
      alert('Aggiunto con successo!');
      callback();
    } else {
      alert('Errore durante l\'aggiunta');
    }
  };

  const deleteItem = async (table, id, callback) => {
    if (!window.confirm("Sei sicuro?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) {
      alert('Eliminato!');
      callback();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 text-center max-w-sm w-full">
          <Lock className="mx-auto mb-4 text-zinc-500" size={40} />
          <h2 className="text-2xl font-black mb-6">ACCESSO ADMIN</h2>
          <input 
            type="password" placeholder="PIN" 
            className="w-full bg-black border border-zinc-700 p-4 rounded-2xl text-center text-2xl tracking-widest mb-6 outline-none focus:border-green-500"
            value={pin} onChange={(e) => setPin(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-white text-black py-4 rounded-2xl font-bold">Entra</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 sticky top-0 z-50">
        <h1 className="text-xl font-black tracking-tighter flex items-center gap-2"><Unlock size={20} className="text-green-500" /> DASHBOARD</h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-xs text-zinc-500">Logout</button>
      </div>

      <div className="flex justify-around bg-zinc-900 border-b border-zinc-800 p-2 sticky top-[60px] z-40">
        <TabButton id="home" icon={Layout} label="Home" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="tour" icon={Calendar} label="Tour" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="band" icon={Users} label="Band" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="shop" icon={ShoppingBag} label="Shop" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="gallery" icon={ImageIcon} label="Gallery" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="p-6">
        {loading ? <p className="text-center text-zinc-500">Caricamento...</p> : (
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Impostazioni Home</h2>
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                  <div><label className="block text-xs text-zinc-500 mb-1 font-bold uppercase">URL Immagine Home</label><input className="w-full bg-black border border-zinc-700 p-3 rounded-xl outline-none" value={settings.home_image_url} onChange={(e) => setSettings({...settings, home_image_url: e.target.value})} /></div>
                  <div><label className="block text-xs text-zinc-500 mb-1 font-bold uppercase">Testo Benvenuto</label><textarea className="w-full bg-black border border-zinc-700 p-3 rounded-xl outline-none h-24" value={settings.home_text} onChange={(e) => setSettings({...settings, home_text: e.target.value})} /></div>
                  <div><label className="block text-xs text-zinc-500 mb-1 font-bold uppercase">Link Spotify</label><input className="w-full bg-black border border-zinc-700 p-3 rounded-xl outline-none" value={settings.spotify_link} onChange={(e) => setSettings({...settings, spotify_link: e.target.value})} /></div>
                  <div><label className="block text-xs text-zinc-500 mb-1 font-bold uppercase">URL Audio Preview (mp3)</label><input className="w-full bg-black border border-zinc-700 p-3 rounded-xl outline-none" value={settings.audio_preview_url} onChange={(e) => setSettings({...settings, audio_preview_url: e.target.value})} /></div>
                  <div className="flex items-center justify-between pt-4"><span>Attiva Donazioni</span><input type="checkbox" className="w-6 h-6 accent-green-500" checked={settings.donation_enabled} onChange={(e) => setSettings({...settings, donation_enabled: e.target.checked})} /></div>
                  <button onClick={saveSettings} className="w-full bg-green-500 text-black py-4 rounded-2xl font-bold mt-4">Salva Modifiche</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'tour' && (
              <motion.div key="tour" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Gestione Tour</h2>
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                  <h3 className="font-bold text-green-500 flex items-center gap-2"><PlusCircle size={18}/> Aggiungi Data</h3>
                  <input placeholder="Titolo" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewTour({...newTour, title: e.target.value})} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewTour({...newTour, date: e.target.value})} />
                    <input type="time" className="bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewTour({...newTour, time: e.target.value})} />
                  </div>
                  <input placeholder="Indirizzo" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewTour({...newTour, address: e.target.value})} />
                  <input placeholder="URL Immagine" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewTour({...newTour, image_url: e.target.value})} />
                  <input type="number" placeholder="Prezzo (€)" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewTour({...newTour, price: parseFloat(e.target.value)})} />
                  <button onClick={() => addItem('events', newTour, fetchAllData)} className="w-full bg-white text-black py-3 rounded-xl font-bold">Aggiungi</button>
                </div>
                <div className="space-y-3">
                  {tour.map(t => <div key={t.id} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center"><div><p className="font-bold">{t.title}</p><p className="text-xs text-zinc-500">{t.date}</p></div><button onClick={() => deleteItem('events', t.id, fetchAllData)} className="text-red-500"><Trash2 size={18}/></button></div>)}
                </div>
              </motion.div>
            )}

            {activeTab === 'band' && (
              <motion.div key="band" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Membri Band</h2>
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                  <h3 className="font-bold text-green-500 flex items-center gap-2"><PlusCircle size={18}/> Nuovo Membro</h3>
                  <input placeholder="Nome" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewMember({...newMember, name: e.target.value})} />
                  <input placeholder="Ruolo" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewMember({...newMember, role: e.target.value})} />
                  <input placeholder="URL Foto" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewMember({...newMember, photo_url: e.target.value})} />
                  <textarea placeholder="Bio" className="w-full bg-black border border-zinc-700 p-3 rounded-xl h-20" onChange={(e) => setNewMember({...newMember, bio: e.target.value})} />
                  <button onClick={() => addItem('members', newMember, fetchAllData)} className="w-full bg-white text-black py-3 rounded-xl font-bold">Aggiungi</button>
                </div>
                <div className="space-y-3">
                  {members.map(m => <div key={m.id} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center"><div className="flex items-center gap-3"><img src={m.photo_url} className="w-10 h-10 rounded-full object-cover"/><p className="font-bold">{m.name}</p></div><button onClick={() => deleteItem('members', m.id, fetchAllData)} className="text-red-500"><Trash2 size={18}/></button></div>)}
                </div>
              </motion.div>
            )}

            {activeTab === 'shop' && (
              <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Gestione Shop</h2>
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                  <h3 className="font-bold text-green-500 flex items-center gap-2"><PlusCircle size={18}/> Nuovo Gadget</h3>
                  <input placeholder="Nome" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                  <input type="number" placeholder="Prezzo (€)" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                  <input placeholder="URL Immagine" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewProduct({...newProduct, photo_url: e.target.value})} />
                  <input placeholder="Link PayPal" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewProduct({...newProduct, paypal_link: e.target.value})} />
                  <button onClick={() => addItem('products', newProduct, fetchAllData)} className="w-full bg-white text-black py-3 rounded-xl font-bold">Aggiungi</button>
                </div>
                <div className="space-y-3">
                  {products.map(p => <div key={p.id} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center"><div className="flex items-center gap-3"><img src={p.photo_url} className="w-10 h-10 rounded-lg object-cover"/><p className="font-bold">{p.name} - €{p.price}</p></div><button onClick={() => deleteItem('products', p.id, fetchAllData)} className="text-red-500"><Trash2 size={18}/></button></div>)}
                </div>
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Gestione Gallery</h2>
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                  <h3 className="font-bold text-green-500 flex items-center gap-2"><PlusCircle size={18}/> Nuova Immagine/Video</h3>
                  <select className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewGallery({...newGallery, type: e.target.value})}>
                    <option value="image">Immagine</option>
                    <option value="video">Video</option>
                  </select>
                  <input placeholder="URL Media" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewGallery({...newGallery, url: e.target.value})} />
                  <input placeholder="Didascalia" className="w-full bg-black border border-zinc-700 p-3 rounded-xl" onChange={(e) => setNewGallery({...newGallery, caption: e.target.value})} />
                  <button onClick={() => addItem('gallery', newGallery, fetchAllData)} className="w-full bg-white text-black py-3 rounded-xl font-bold">Carica</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {gallery.map(g => <div key={g.id} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group"><img src={g.type === 'image' ? g.url : 'https://via.placeholder.com/150?text=Video'} className="w-full h-full object-cover opacity-50"/><button onClick={() => deleteItem('gallery', g.id, fetchAllData)} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-red-500"><Trash2 size={20}/></button></div>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Admin;