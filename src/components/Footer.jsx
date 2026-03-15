import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

/**
 * Footer Component
 * Renders the page footer with social links and copyright.
 */
const Footer = () => {
  return (
    <footer className="mt-auto py-8 border-t border-primary/10 flex flex-col items-center gap-6">
      <div className="flex gap-4">
        <a 
          href="https://github.com/Miroslav-Novotny64" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="p-2 text-muted-foreground hover:text-primary transition-colors"
          aria-label="GitHub"
        >
          <Github size={24} />
        </a>
        <a 
          href="https://www.linkedin.com/in/miroslav-novotn%C3%BD-8a436b26b/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="p-2 text-muted-foreground hover:text-primary transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin size={24} />
        </a>
        <a 
          href="mailto:miroslav.novotny64@gmail.com" 
          className="p-2 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Email"
        >
          <Mail size={24} />
        </a>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 italic">
        &copy; {new Date().getFullYear()} Simple Impostor Game
      </p>
    </footer>
  );
};

export default Footer;
