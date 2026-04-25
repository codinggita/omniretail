import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productsApi';
import { createNegotiation } from '../api/negotiationsApi';
import Button from '../components/ui/Button';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNegotiating, setIsNegotiating] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Fetch product error:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleStartNegotiation = async () => {
    try {
      setIsNegotiating(true);
      const neg = await createNegotiation(id);
      navigate(`/negotiation/${neg._id}`);
    } catch (err) {
      console.error('Negotiation start error:', err);
      alert(`Failed to start negotiation: ${err.message || 'Unknown error'}`);
    } finally {
      setIsNegotiating(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading product details...</div>;
  if (error || !product) return <div className="p-8 text-red-400">{error || 'Product not found'}</div>;

  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/inventory" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 outline-none">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-inter text-sm hidden sm:inline font-semibold uppercase tracking-widest">Back to Inventory</span>
        </Link>
      </div>

      {/* Alert Banner */}
      {product.isSurplus && (
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
      )}

      {/* Split View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Left Column: Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-gutter">
          
          {/* Main Image Bento Cell */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-card-padding shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] aspect-video relative group overflow-hidden flex items-center justify-center">
            <img 
              alt={product.name} 
              className="object-cover w-full h-full rounded-lg mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
              src={imageUrl} 
            />
            <button className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-700 p-2 rounded-lg text-zinc-300 hover:text-white transition-colors outline-none">
              <span className="material-symbols-outlined">fullscreen</span>
            </button>
          </div>

          {/* Gallery Grid Bento Cells - Placeholder for secondary images */}
          <div className="grid grid-cols-3 gap-gutter">
            {product.images?.slice(1, 3).map((img, idx) => (
              <div key={idx} className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] aspect-square overflow-hidden cursor-pointer hover:border-zinc-600 transition-colors">
                <img alt={`View ${idx + 2}`} className="object-cover w-full h-full rounded-lg opacity-60 hover:opacity-100 transition-opacity" src={img.url} />
              </div>
            ))}
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] aspect-square overflow-hidden flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <span className="material-symbols-outlined text-zinc-500 text-3xl">play_circle</span>
              <span className="font-inter text-[12px] font-semibold uppercase tracking-widest text-zinc-400">View Video</span>
            </div>
          </div>

          {/* Specs Bento Cell */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-card-padding shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <h3 className="font-manrope text-[24px] font-semibold text-white mb-6">Technical Specifications</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {product.specifications ? Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-zinc-800/50 pb-2">
                  <span className="font-inter text-sm text-zinc-400">{key}</span>
                  <span className="font-inter text-sm text-zinc-200">{val}</span>
                </div>
              )) : (
                <p className="text-zinc-500 text-sm italic col-span-2">No specifications listed for this product.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-gutter">
          
          {/* Product Header Bento */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-card-padding shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-inter text-[12px] font-semibold uppercase tracking-widest text-zinc-500">SKU: {product.sku}</span>
              <div className="bg-secondary-container/20 text-secondary-fixed border border-secondary-container/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,165,114,0.1)]">
                <div className={`w-1.5 h-1.5 rounded-full ${product.stockQuantity > 0 ? 'bg-secondary-fixed animate-pulse' : 'bg-red-500'}`}></div>
                <span className="font-inter text-[12px] font-semibold uppercase tracking-widest">
                  {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} units)` : 'Out of Stock'}
                </span>
              </div>
            </div>
            <div>
              <h1 className="font-manrope text-[32px] font-bold text-white mb-2 leading-tight">{product.name}</h1>
              <p className="font-inter text-base text-zinc-400">{product.description || 'No description available for this product.'}</p>
            </div>
          </div>

          {/* Pricing & Actions Bento */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-card-padding shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col gap-6">
            <div className="flex items-end gap-3">
              <span className="font-manrope text-[48px] font-extrabold text-white leading-none tracking-tight">
                ₹{product.basePrice.toLocaleString('en-IN')}
              </span>
              <span className="font-inter text-sm text-zinc-500 mb-1">Base Retail Price</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-inter text-base font-semibold py-3 px-4 rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-2 outline-none">
                <span className="material-symbols-outlined text-sm">shopping_cart</span>
                Add to Order
              </button>
              <button 
                onClick={handleStartNegotiation}
                disabled={isNegotiating}
                className="bg-primary-container text-on-primary-container font-inter text-base font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(96,165,250,0.3)] hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 outline-none disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">handshake</span>
                {isNegotiating ? 'Starting...' : 'Make an Offer'}
              </button>
            </div>
            {product.negotiationEnabled && (
              <div className="flex items-center gap-2 text-zinc-500 font-inter text-sm bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                <span className="material-symbols-outlined text-sm text-primary-container">info</span>
                Negotiation is enabled for this item based on current stock status.
              </div>
            )}
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
                    <td className="p-3 text-right">₹{product.basePrice.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-zinc-500">18%</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors bg-primary-container/5">
                    <td className="p-3 text-primary-fixed">5 - 19 units</td>
                    <td className="p-3 text-right text-primary-fixed font-semibold">₹{(product.basePrice * 0.94).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-secondary-fixed">22%</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3">20+ units</td>
                    <td className="p-3 text-right">₹{(product.basePrice * 0.88).toLocaleString('en-IN')}</td>
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
