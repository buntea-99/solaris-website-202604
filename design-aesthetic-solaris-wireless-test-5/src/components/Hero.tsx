import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center pt-24 pb-12 overflow-hidden bg-[#f9fafb]">
      {/* Background radial gradient for premium lighting */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-solaris-100/40 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Side: Typography */}
        <div className="flex flex-col gap-8 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-solaris-600 animate-pulse"></div>
            <span className="text-sm font-mono tracking-widest uppercase text-slate-500">Institutional Technology Supply</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring', damping: 25 }}
            className="text-6xl md:text-8xl tracking-tighter leading-[0.9] font-medium text-slate-950"
          >
            Supply chains built for <br />
            <span className="text-slate-400 italic font-serif tracking-normal">institutional scale.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg text-slate-600 max-w-[50ch] leading-relaxed"
          >
            Trusted by government agencies, Google, and global network operators. We source, provision, and deploy technology across four continents with zero fail rate.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-6 mt-4"
          >
            <button className="bg-slate-950 text-white px-8 py-4 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-2">
              Explore Services
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className={`w-12 h-12 rounded-full border-2 border-white bg-slate-${100 * i} flex items-center justify-center text-xs text-slate-400 overflow-hidden`}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}A`} alt="Client" className="w-full h-full object-cover opacity-80" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Right Side: Bento Visual (Asymmetric) */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, type: 'spring' }}
          className="relative h-[600px] w-full"
        >
          {/* Main big image/card */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=1000" alt="Hardware devices" className="w-full h-full object-cover mix-blend-overlay opacity-60 scale-105 hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 w-full h-full glass-dark !bg-transparent border-none"></div>
            
            <div className="absolute bottom-10 left-10 right-10">
              <div className="glass-dark p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <div className="text-solaris-400 font-mono text-sm mb-1">Global Fulfilment</div>
                  <div className="text-white text-xl font-medium">100,000+ Units Deployed</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-solaris-600 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white relative left-0.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating element */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-12 top-20 glass p-5 rounded-2xl shadow-xl w-64"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono font-bold text-slate-500">PROVISIONING</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
                className="h-full bg-slate-800"
              ></motion.div>
            </div>
            <div className="mt-4 flex justify-between text-xs text-slate-400 font-mono">
              <span>OS Flashing</span>
              <span className="text-slate-900">Active</span>
            </div>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}
