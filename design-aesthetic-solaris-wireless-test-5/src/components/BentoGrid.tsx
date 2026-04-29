import { motion } from 'framer-motion';

const bentoItems = [
  {
    title: 'Mobile Devices',
    desc: 'Apple, Samsung, Motorola. Sourced at institutional volumes.',
    span: 'col-span-1 md:col-span-2 row-span-2',
    bg: 'bg-slate-50',
    visual: (
      <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-slate-200 rounded-tl-3xl shadow-[-10px_-10px_30px_rgba(0,0,0,0.05)] overflow-hidden flex items-end justify-end">
        <div className="w-full h-full translate-y-12 translate-x-12 bg-white rounded-tl-3xl border-t border-l border-white shadow-xl flex items-center justify-center">
            <div className="w-20 h-40 bg-slate-900 rounded-[2rem] border-[4px] border-slate-800 relative"></div>
        </div>
      </div>
    )
  },
  {
    title: 'Starlink Terminals',
    desc: 'Off-grid connectivity for remote public sectors.',
    span: 'col-span-1 row-span-1',
    bg: 'bg-slate-950 text-white',
    visual: (
      <div className="absolute top-4 right-4 text-solaris-500">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
    )
  },
  {
    title: 'Device Provisioning',
    desc: 'OS Flashing, SIM Lock, Carrier Banners. Zero-touch deployment.',
    span: 'col-span-1 row-span-1',
    bg: 'bg-solaris-100',
    visual: null
  },
  {
    title: 'Global Fulfilment Logistics',
    desc: 'Direct-to-client delivery across 4 continents from Miami HQ.',
    span: 'col-span-1 md:col-span-3 row-span-1',
    bg: 'bg-white border border-slate-200',
    visual: (
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex gap-4 opacity-40">
        <div className="w-16 h-1 bg-slate-300 rounded-full"></div>
        <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
        <div className="w-8 h-1 bg-slate-300 rounded-full"></div>
      </div>
    )
  }
];

export function BentoGrid() {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl tracking-tighter font-medium mb-4">Hardware ecosystem.</h2>
          <p className="text-slate-500 max-w-xl text-lg">We operate end-to-end to ensure your institutional deployment hits the field perfectly configured.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[220px] gap-6">
          {bentoItems.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 0.98, transition: { duration: 0.2 } }}
              className={`${item.span} ${item.bg} rounded-[2rem] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between group cursor-pointer`}
            >
              <div className="relative z-10 max-w-sm">
                <h3 className={`text-2xl font-medium mb-2 ${item.bg.includes('slate-950') ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                <p className={`${item.bg.includes('slate-950') ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
              </div>
              
              {/* Animated Arrow */}
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center relative z-10 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.bg.includes('slate-950') ? 'white' : 'black'} strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>

              {item.visual}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
