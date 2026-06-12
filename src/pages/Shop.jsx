import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { ShoppingCart, ExternalLink } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  }

  return (
    <div className="p-6 pb-24">
      <h2 className="text-4xl font-black mb-8 tracking-tighter">OFFICIAL MERCH</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {products.length === 0 ? (
          <p className="text-zinc-500 text-center col-span-full py-10">Nessun gadget disponibile al momento...</p>
        ) : (
          products.map((product, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={product.id} 
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group"
            >
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={product.photo_url} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={product.name} 
                />
                {product.price && (
                  <div className="absolute top-4 right-4 bg-white text-black font-bold px-3 py-1 rounded-full shadow-lg">
                    €{product.price}
                  </div>
                )}
              </div>
              
              <div className="p-5 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-4">{product.name}</h3>
                
                {/* TASTO PAYPAL: Appare solo se c'è un prezzo */}
                {product.price > 0 ? (
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={product.paypal_link} 
                    target="_blank"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart size={18} /> Acquista con PayPal <ExternalLink size={14} />
                  </motion.a>
                ) : (
                  <span className="text-zinc-500 text-sm italic">Prodotto non disponibile</span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Shop;