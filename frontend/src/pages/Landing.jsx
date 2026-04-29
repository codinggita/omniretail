import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SEO from '../components/common/SEO';

const Landing = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] font-inter selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      <SEO 
        title="Modern Hybrid Retail Solutions"
        description="Transform your retail business with OmniRetail's hybrid platform. Real-time inventory sync, AI negotiation, and seamless local store integration."
        keywords="retail, e-commerce, ai negotiation, store locator, inventory management, omniretail"
      />
      
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-[100] bg-[#131315]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary-container/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '22px' }}>storefront</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white font-manrope">OmniRetail</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-outline hover:text-white transition-colors">Features</a>
            <a href="#technology" className="text-sm font-semibold text-outline hover:text-white transition-colors">Technology</a>
            <Link to="/support" className="text-sm font-semibold text-outline hover:text-white transition-colors">Support</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link 
                to="/dashboard"
                className="px-6 py-2.5 bg-primary-container text-on-primary-container rounded-full font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary-container/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-white hover:text-primary-container transition-colors">Sign In</Link>
                <Link 
                  to="/register"
                  className="px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-white/10"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">The Future of Hybrid Retail is Here</span>
          </div>
          
          <h1 className="font-manrope text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[1.05]">
            Bridging the gap between<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary">
              Physical & Digital.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-outline mb-12 leading-relaxed">
            OmniRetail empowers retailers with shelf-level stock visibility, AI-driven price negotiations, and seamless local store integration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link 
              to="/register"
              className="w-full sm:w-auto px-10 py-5 bg-primary-container text-on-primary-container rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-primary-container/30 flex items-center justify-center gap-3"
            >
              Start Free Trial
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-md">
              Watch Demo
              <span className="material-symbols-outlined">play_circle</span>
            </button>
          </div>

          {/* Hero Image Mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-transparent to-transparent z-10" />
            <div className="rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] transform hover:rotate-1 transition-transform duration-700">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                alt="Dashboard Preview" 
                className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-32 px-6 bg-[#0d0d0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-manrope text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Everything you need to <span className="text-primary-container">Scale.</span></h2>
            <p className="text-outline text-lg max-w-2xl mx-auto">One powerful platform to manage your entire retail empire, from inventory to customer relations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Real-time Sync', desc: 'Shelf-level stock visibility across all physical branches and digital stores.', icon: 'sync' },
              { title: 'AI Negotiation', desc: 'Enable automated, fair price negotiations with your customers via OmniBot.', icon: 'handshake' },
              { title: 'Local Discovery', desc: 'Interactive store locator helps customers find your products at the nearest branch.', icon: 'location_on' },
              { title: 'Rich Analytics', desc: 'Deep insights into inventory turnover, surplus stock, and customer behavior.', icon: 'analytics' },
              { title: 'Secure API', desc: 'Robust REST endpoints for seamless integration with your existing POS systems.', icon: 'api' },
              { title: 'Support Hub', desc: 'Integrated ticketing and FAQ system to keep your customers happy 24/7.', icon: 'support_agent' },
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-primary-container/30 transition-all hover:-translate-y-2">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-primary-container text-3xl">{f.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-outline leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto p-12 md:p-24 rounded-[3rem] bg-gradient-to-br from-primary-container/20 to-secondary/10 border border-white/10 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 blur-[100px] -z-10" />
          <h2 className="font-manrope text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter">Ready to revolutionize your retail?</h2>
          <p className="text-outline text-lg mb-12 max-w-xl mx-auto">Join thousands of retailers using OmniRetail to drive more footfall and digital sales.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/register"
              className="px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-white/20"
            >
              Get Started for Free
            </Link>
            <Link 
              to="/support"
              className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container text-[18px]">storefront</span>
              </div>
              <span className="text-xl font-black text-white font-manrope">OmniRetail</span>
            </div>
            <p className="text-outline max-w-sm mb-8">Empowering the next generation of hybrid retailers with intelligent, real-time technology.</p>
            <div className="flex gap-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map(s => (
                <div key={s} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-container/20 hover:border-primary-container/30 transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-outline text-[18px]">public</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Product</h4>
            <ul className="space-y-4 text-sm text-outline">
              <li><Link to="/inventory" className="hover:text-primary-container">Inventory</Link></li>
              <li><Link to="/shop" className="hover:text-primary-container">E-commerce</Link></li>
              <li><Link to="/negotiation" className="hover:text-primary-container">AI OmniBot</Link></li>
              <li><Link to="/locator" className="hover:text-primary-container">Store Finder</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4 text-sm text-outline">
              <li><Link to="/support" className="hover:text-primary-container">Support</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-container">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-container">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-outline text-xs">
          © 2026 OmniRetail. Built with ❤️ for modern retailers.
        </div>
      </footer>

    </div>
  );
};

export default Landing;
