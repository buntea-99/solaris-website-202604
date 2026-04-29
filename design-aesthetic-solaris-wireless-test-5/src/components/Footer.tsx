export function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-solaris-600/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-[1400px] mx-auto border-t border-white/10 pt-16 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 bg-white rounded-sm"></div>
            <span className="font-semibold tracking-tight text-white">Solaris Wireless</span>
          </div>
          <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
            Institutional technology supply, provisioning and fulfilment. Headquartered in Miami, FL with strategic partners across four continents.
          </p>
          <div className="flex gap-4">
            <button className="text-sm font-medium border border-white/20 hover:border-white/50 px-5 py-2 rounded-full transition-colors">Miami HQ</button>
            <button className="text-sm font-medium border border-white/20 hover:border-white/50 px-5 py-2 rounded-full transition-colors">Amsterdam</button>
          </div>
        </div>
        
        <div>
          <h4 className="font-mono text-xs text-slate-500 mb-6 uppercase tracking-widest">Platform</h4>
          <ul className="space-y-4 text-slate-300">
            <li><a href="#" className="hover:text-white transition-colors">Provisioning</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Logistics</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Hardware Supply</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Enterprise Programs</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-mono text-xs text-slate-500 mb-6 uppercase tracking-widest">Company</h4>
          <ul className="space-y-4 text-slate-300">
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto mt-24 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
        <p>&copy; 2026 Solaris Wireless. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-slate-300">Privacy</a>
          <a href="#" className="hover:text-slate-300">Terms</a>
        </div>
      </div>
    </footer>
  );
}
