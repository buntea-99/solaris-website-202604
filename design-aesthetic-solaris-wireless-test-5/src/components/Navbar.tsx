import { motion } from 'framer-motion';

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      <div className="glass px-6 py-3 rounded-full flex items-center justify-between w-full max-w-5xl">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 bg-slate-950 rounded-md shadow-sm"></div>
          <span className="font-semibold tracking-tight text-slate-900">Solaris Wireless</span>
        </div>
        
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <li className="text-slate-900 cursor-pointer">Supply</li>
          <li className="hover:text-slate-900 transition-colors cursor-pointer">Provisioning</li>
          <li className="hover:text-slate-900 transition-colors cursor-pointer">Fulfilment</li>
          <li className="hover:text-slate-900 transition-colors cursor-pointer">Network</li>
        </ul>
        
        <button className="bg-slate-950 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-solaris-600 transition-colors active:scale-95">
          Request Quote
        </button>
      </div>
    </motion.nav>
  );
}
