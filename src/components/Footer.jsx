import { Phone, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-4 border-t border-zinc-800 text-center">
      <p className="text-sm mb-4 opacity-80">
        WebApp progettata con il <span className="text-red-600">❤️</span> da 
        <span className="font-bold ml-1"> SuPer & </span>
        <span className="font-bold">
          <span className="text-white">comunicA</span>
          <span className="text-red-600">ttivamente</span>
        </span>
      </p>
      
      <div className="flex flex-wrap justify-center gap-6 text-xs opacity-70">
        <a href="tel:+393934533500" className="flex items-center gap-2 hover:text-red-500 transition-colors">
          <Phone size={14} /> +39 393 453 3500
        </a>
        <a href="mailto:info@superstart.it" className="flex items-center gap-2 hover:text-red-500 transition-colors">
          <Mail size={14} /> info@superstart.it
        </a>
        <a href="https://www.superstart.it" target="_blank" className="flex items-center gap-2 hover:text-red-500 transition-colors">
          <Globe size={14} /> www.superstart.it
        </a>
      </div>
    </footer>
  );
};

export default Footer;