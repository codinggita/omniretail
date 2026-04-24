import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const ProductDetail = () => {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 outline-none">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-inter text-sm hidden sm:inline font-semibold uppercase tracking-widest">Back to Inventory</span>
        </Link>
      </div>

      {/* Alert Banner */}
      <div className="bg-secondary-container/10 border border-secondary-container/30 rounded-xl p-4 flex items-start gap-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] relative overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-container/5 to-transparent pointer-events-none"></div>
        <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-secondary-container text-sm">local_offer</span>
        </div>
        <div>
          <h3 className="font-inter text-sm font-semibold text-secondary-fixed">Surplus Stock Alert</h3>
          <p className="font-inter text-sm text-zinc-400 mt-1">This item is flagged as surplus. Additional volume discounts are available to accelerate sell-through.</p>
        </div>
      </div>

      {/* Split View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Left Column: Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-gutter">
          
          {/* Main Image Bento Cell */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-card-padding shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] aspect-video relative group overflow-hidden flex items-center justify-center">
            <img 
              alt="Ultra-thin premium silver laptop" 
              className="object-cover w-full h-full rounded-lg mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBDqoh3UBaW9mhH4W_Ib7oUJbFIuIXKTcqcq5LVf5iEW0dmcmgvlGfMVx1muPU0a538xbyh32ztvYGu7uHUUgbN7baBoatCrvuYp4cgxkArCaCeJ6R6v8ZSGoduFIrvepu_yfLER7-QuSgQhWCFWARVLErAvxEqneQ-iIjAbs4gaXykKcB8Rn5TkRAyi0F4rkxQA8390mpcTBUBT2q83efinxPt-hAP8CTWhsMJpjOYJQAgpYMbFqeaPEzyBtiN_VZvfIT5rqvp6XI" 
            />
            <button className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-700 p-2 rounded-lg text-zinc-300 hover:text-white transition-colors outline-none">
              <span className="material-symbols-outlined">fullscreen</span>
            </button>
          </div>

          {/* Gallery Grid Bento Cells */}
          <div className="grid grid-cols-3 gap-gutter">
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] aspect-square overflow-hidden cursor-pointer hover:border-primary-container transition-colors ring-1 ring-primary-container/50">
              <img 
                alt="Close up profile view" 
                className="object-cover w-full h-full rounded-lg opacity-90" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjKkv4JMUuck-8BeZPQ3D5LM2mVqvZP2JLZ5hevZGAxVe5TRUNagOM8WvQFBlpyXptvnnBz_GS2JBZKYXGEJnCgl8PvJPcdF2s6J940e8aAlcVGhRs2Bguiw6tSscWLd2UU_d3lbSyXIi_KhXhrpH6QbLdpP4GoI3pu2F_YWbqPd4qT6h_YQPvCwX7K6o9Bv1ItSg9njk6CG1bYguiDrLqWByJKAHBGGK8OokFYNU2UJXZkmaAgVPO2LblHJ7IZnaCqRzsRCHBU7lA" 
              />
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] aspect-square overflow-hidden cursor-pointer hover:border-zinc-600 transition-colors">
              <img 
                alt="Top down view" 
                className="object-cover w-full h-full rounded-lg opacity-60 hover:opacity-100 transition-opacity" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIg8orHKw2QlChamT_KysvUIcJoEkL57jbmzsaj6erZj3ukBEC5595J_fPM8NWMtzN4jUZAQAf4fjFi7zqH56IA_oYF-A40mjrGl0tMyLLVNeINNUzcbVrCN6bFEXtIIKv0msfSr9ifHHHA4GlVc6_6z53ykOyGuuwY7VKcodTwYXDxTLh09bZIRgUMU0WktX7YSrq7PEf6jxCCO8nHWNtBshIa9W1w1z5P5CGC5elFBSX0YfklpWWi1S6gNexq0dVIrGKiZ5o9ui6" 
              />
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] aspect-square overflow-hidden flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <span className="material-symbols-outlined text-zinc-500 text-3xl">play_circle</span>
              <span className="font-inter text-[12px] font-semibold uppercase tracking-widest text-zinc-400">View Video</span>
            </div>
          </div>

          {/* Specs Bento Cell */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-card-padding shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <h3 className="font-manrope text-[24px] font-semibold text-white mb-6">Technical Specifications</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                <span className="font-inter text-sm text-zinc-400">Processor</span>
                <span className="font-inter text-sm text-zinc-200">M2 Max 12-core</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                <span className="font-inter text-sm text-zinc-400">Memory</span>
                <span className="font-inter text-sm text-zinc-200">32GB Unified</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                <span className="font-inter text-sm text-zinc-400">Storage</span>
                <span className="font-inter text-sm text-zinc-200">1TB NVMe SSD</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                <span className="font-inter text-sm text-zinc-400">Display</span>
                <span className="font-inter text-sm text-zinc-200">14.2" Liquid Retina XDR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-gutter">
          
          {/* Product Header Bento */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-card-padding shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-inter text-[12px] font-semibold uppercase tracking-widest text-zinc-500">SKU: LAP-M2M-32-1T-SLV</span>
              <div className="bg-secondary-container/20 text-secondary-fixed border border-secondary-container/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,165,114,0.1)]">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse"></div>
                <span className="font-inter text-[12px] font-semibold uppercase tracking-widest">In Stock at Kalol Store</span>
              </div>
            </div>
            <div>
              <h1 className="font-manrope text-[32px] font-bold text-white mb-2 leading-tight">AeroBook Pro 14" Ultra-Thin</h1>
              <p className="font-inter text-base text-zinc-400">The definitive workstation for mobile professionals. Features aerospace-grade aluminum chassis and next-generation thermal management.</p>
            </div>
          </div>

          {/* Pricing & Actions Bento */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-card-padding shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col gap-6">
            <div className="flex items-end gap-3">
              <span className="font-manrope text-[48px] font-extrabold text-white leading-none tracking-tight">$2,499.00</span>
              <span className="font-inter text-sm text-zinc-500 mb-1">Base Retail Price</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-inter text-base font-semibold py-3 px-4 rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-2 outline-none">
                <span className="material-symbols-outlined text-sm">shopping_cart</span>
                Add to Order
              </button>
              <Link to="/negotiation/1" className="bg-primary-container text-on-primary-container font-inter text-base font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(96,165,250,0.3)] hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 outline-none">
                <span className="material-symbols-outlined text-sm">handshake</span>
                Make an Offer
              </Link>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 font-inter text-sm bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
              <span className="material-symbols-outlined text-sm text-primary-container">info</span>
              Negotiation is enabled for this item based on current surplus status.
            </div>
          </div>

          {/* Pricing Tiers Bento */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-card-padding shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col gap-4">
            <h3 className="font-manrope text-[24px] font-semibold text-white">Wholesale Tiers</h3>
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-zinc-800">
                    <th className="font-inter text-[12px] font-semibold uppercase tracking-widest text-zinc-400 p-3">Quantity</th>
                    <th className="font-inter text-[12px] font-semibold uppercase tracking-widest text-zinc-400 p-3 text-right">Unit Price</th>
                    <th className="font-inter text-[12px] font-semibold uppercase tracking-widest text-zinc-400 p-3 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="font-inter text-sm text-zinc-300">
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3">1 - 4 units</td>
                    <td className="p-3 text-right">$2,499.00</td>
                    <td className="p-3 text-right text-zinc-500">18%</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors bg-primary-container/5">
                    <td className="p-3 text-primary-fixed">5 - 19 units</td>
                    <td className="p-3 text-right text-primary-fixed font-semibold">$2,350.00</td>
                    <td className="p-3 text-right text-secondary-fixed">22%</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3">20+ units</td>
                    <td className="p-3 text-right">$2,199.00</td>
                    <td className="p-3 text-right text-secondary-fixed">28%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProductDetail;
