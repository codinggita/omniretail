import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productsApi';
import { createNegotiation } from '../api/negotiationsApi';

const statusConfig = {
  'in_stock': {
    bg: 'bg-secondary/10',
    text: 'text-secondary',
    border: 'border-secondary/20',
    dot: 'bg-secondary',
    label: 'In Stock'
  },
  'low_stock': {
    bg: 'bg-[#f59e0b]/10',
    text: 'text-[#f59e0b]',
    border: 'border-[#f59e0b]/20',
    dot: 'bg-[#f59e0b]',
    label: 'Low Stock'
  },
  'out_of_stock': {
    bg: 'bg-error/10',
    text: 'text-error',
    border: 'border-error/20',
    dot: 'bg-error',
    label: 'Out of Stock'
  },
};

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Footwear', 'Audio', 'Wearables', 'Accessories', 'Phones'];

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const isCustomer = user?.role === 'customer';

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    basePrice: '',
    category: 'Electronics',
    stockQuantity: '',
    imageBase64: ''
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      basePrice: product.basePrice,
      category: product.category,
      stockQuantity: product.stockQuantity,
      imageBase64: product.images?.[0]?.url || ''
    });
    setShowModal(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      // Ensure the response is an array (handle case where data is nested in data property)
      const data = Array.isArray(res) ? res : res.data;
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageBase64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const stock = Number(formData.stockQuantity);
      const productData = {
        sku: formData.sku,
        name: formData.name,
        basePrice: Number(formData.basePrice),
        minAcceptablePrice: Number(formData.basePrice) * 0.8, // default 20% negotiation buffer
        category: formData.category,
        stockQuantity: stock,
        stockStatus: stock > 10 ? 'in_stock' : (stock > 0 ? 'low_stock' : 'out_of_stock'),
        images: formData.imageBase64 ? [{ url: formData.imageBase64, isPrimary: true }] : [],
        negotiationEnabled: true
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        await createProduct(productData);
      }

      await fetchProducts(); // Refresh list
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ sku: '', name: '', basePrice: '', category: 'Electronics', stockQuantity: '', imageBase64: '' });
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Check console.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handleOffer = async (product) => {
    try {
      const neg = await createNegotiation(product._id);
      navigate(`/negotiation/${neg._id}`);
    } catch (error) {
      console.error('Error starting negotiation:', error);
      alert(`Failed to start negotiation: ${error.message || 'Unknown error'}`);
    }
  };

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalProducts = products.length;
  const inStock = products.filter((p) => p.stockStatus === 'in_stock').length;
  const lowStock = products.filter((p) => p.stockStatus === 'low_stock').length;
  const outOfStock = products.filter((p) => p.stockStatus === 'out_of_stock').length;
  const surplusItems = products.filter(p => p.isSurplus).length;

  if (loading) {
    return <div className="text-white p-8">Loading products...</div>;
  }

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-manrope text-[32px] font-bold text-on-surface tracking-tight">
            {isCustomer ? 'Shop' : 'Inventory'}
          </h2>
          <p className="font-inter text-sm text-outline mt-1">
            {isCustomer ? 'Browse our catalog and negotiate the best prices.' : 'Manage your product catalog, stock levels, and wholesale tiers.'}
          </p>
        </div>
        {!isCustomer && (
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-zinc-600 transition-all font-inter text-sm font-semibold outline-none">
              <span className="material-symbols-outlined text-[18px]">upload</span>
              Import
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-inter text-sm font-bold shadow-[0_0_20px_rgba(96,165,250,0.25)] hover:shadow-[0_0_30px_rgba(96,165,250,0.4)] hover:-translate-y-0.5 transition-all outline-none"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Product
            </button>
          </div>
        )}
      </div>

      {/* Stat Cards - Only show for retailers */}
      {!isCustomer && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: totalProducts, icon: 'inventory_2', color: 'text-primary-container', bg: 'bg-primary-container/10', border: 'border-primary-container/20' },
            { label: 'In Stock', value: inStock, icon: 'check_circle', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
            { label: 'Low Stock', value: lowStock, icon: 'warning', color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10', border: 'border-[#f59e0b]/20' },
            { label: 'Out of Stock', value: outOfStock, icon: 'do_not_disturb_on', color: 'text-error', bg: 'bg-error/10', border: 'border-error/20' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900/50 backdrop-blur-md rounded-xl border border-zinc-800 p-5 flex items-center gap-4 hover:border-outline-variant transition-colors relative overflow-hidden group"
            >
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className={`w-11 h-11 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined ${stat.color} text-[22px]`}>{stat.icon}</span>
              </div>
              <div>
                <p className="font-inter text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{stat.label}</p>
                <p className="font-manrope text-[28px] font-extrabold text-on-surface leading-none mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Surplus Alert - Retailers Only */}
      {!isCustomer && surplusItems > 0 && (
        <div className="bg-secondary-container/10 border border-secondary-container/30 rounded-xl p-4 flex items-start gap-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-container/5 to-transparent pointer-events-none" />
          <div className="w-9 h-9 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary text-[18px]">local_offer</span>
          </div>
          <div>
            <h3 className="font-inter text-sm font-semibold text-secondary">{surplusItems} Surplus Stock Items Detected</h3>
            <p className="font-inter text-sm text-outline mt-0.5">
              Some items are flagged as surplus. Enable volume discounts to accelerate sell-through.
            </p>
          </div>
          <button className="ml-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary font-inter text-xs font-semibold hover:bg-secondary/20 transition-colors outline-none">
            View All
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Toolbar: Search + Filters + View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            className="w-full bg-surface-container border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 font-inter text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/50 transition-all"
            placeholder="Search products, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative">
            <select className="appearance-none bg-surface-container border border-outline-variant rounded-xl pl-4 pr-8 py-2.5 font-inter text-sm text-on-surface-variant focus:outline-none focus:border-primary-container transition-all cursor-pointer">
              <option>Sort: Newest</option>
              <option>Sort: Price Low-High</option>
              <option>Sort: Price High-Low</option>
              <option>Sort: Stock Level</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">unfold_more</span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors outline-none ${viewMode === 'grid' ? 'bg-primary-container/20 text-primary-container' : 'text-outline hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors outline-none ${viewMode === 'list' ? 'bg-primary-container/20 text-primary-container' : 'text-outline hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-[20px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-full font-inter text-xs font-semibold uppercase tracking-wider transition-all outline-none border ${
              activeCategory === cat
                ? 'bg-primary-container/20 text-primary-container border-primary-container/40 shadow-[0_0_15px_rgba(96,165,250,0.15)]'
                : 'text-outline border-outline-variant hover:text-on-surface hover:border-zinc-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const sc = statusConfig[product.stockStatus || 'in_stock'];
            const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300?text=No+Image';
            
            return (
              <div
                key={product._id}
                className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 overflow-hidden hover:border-outline-variant transition-all duration-300 group flex flex-col relative"
              >
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Image Area */}
                <div className="relative aspect-[4/3] bg-zinc-950/60 overflow-hidden flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />

                  {/* Surplus Badge */}
                  {product.isSurplus && (
                    <div className="absolute top-3 left-3 bg-secondary/20 border border-secondary/30 text-secondary rounded-full px-2.5 py-1 font-inter text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">local_offer</span>
                      Surplus
                    </div>
                  )}

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container font-inter text-xs font-bold rounded-full shadow-[0_0_15px_rgba(96,165,250,0.3)] hover:shadow-[0_0_25px_rgba(96,165,250,0.5)] transition-all outline-none"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div>
                    <p className="font-inter text-[10px] font-semibold uppercase tracking-wider text-outline">{product.sku}</p>
                    <h3 className="font-manrope text-base font-bold text-on-surface mt-1 truncate">{product.name}</h3>
                    <p className="font-inter text-xs text-on-surface-variant mt-0.5">{product.category}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-manrope text-[22px] font-extrabold text-on-surface">
                      ${product.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${sc.bg} ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      <span className={`font-inter text-[10px] font-bold uppercase tracking-wider ${sc.text}`}>{sc.label}</span>
                    </div>
                  </div>

                  {/* Stock Bar (Retailers) */}
                  {!isCustomer && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-inter text-xs text-outline">Stock Level</span>
                        <span className="font-inter text-xs font-semibold text-on-surface-variant">{product.stockQuantity} units</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            product.stockQuantity === 0
                              ? 'bg-error'
                              : product.stockQuantity <= 5
                              ? 'bg-[#f59e0b]'
                              : 'bg-secondary'
                          }`}
                          style={{ width: `${Math.min((product.stockQuantity / 40) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    {!isCustomer && (
                      <button 
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-zinc-600 font-inter text-xs font-semibold transition-all outline-none"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => isCustomer ? navigate(`/product/${product._id}`) : handleOffer(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-container/10 border border-primary-container/30 text-primary-container hover:bg-primary-container/20 font-inter text-xs font-semibold transition-all outline-none"
                    >
                      <span className="material-symbols-outlined text-[16px]">{isCustomer ? 'shopping_cart' : 'handshake'}</span>
                      {isCustomer ? 'Buy' : 'Offer'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-zinc-700 text-[64px]">inventory_2</span>
              <p className="font-manrope text-xl font-bold text-on-surface-variant mt-4">No products found</p>
              <p className="font-inter text-sm text-outline mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-zinc-800/80 bg-zinc-950/40">
            {['Product', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
              <span key={h} className="font-inter text-xs font-semibold uppercase tracking-wider text-outline">{h}</span>
            ))}
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-zinc-800/50">
            {filtered.map((product) => {
              const sc = statusConfig[product.stockStatus || 'in_stock'];
              const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/150';

              return (
                <div
                  key={product._id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-zinc-800/30 transition-colors group"
                >
                  {/* Product */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-inter text-sm font-semibold text-on-surface truncate">{product.name}</p>
                      <p className="font-inter text-xs text-outline">{product.sku}</p>
                    </div>
                    {product.isSurplus && (
                      <span className="bg-secondary/10 border border-secondary/20 text-secondary rounded-full px-2 py-0.5 font-inter text-[10px] font-bold uppercase">Surplus</span>
                    )}
                  </div>

                  {/* Category */}
                  <span className="font-inter text-sm text-on-surface-variant">{product.category}</span>

                  {/* Price */}
                  <span className="font-manrope text-base font-bold text-on-surface">
                    ${product.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>

                  {/* Stock */}
                  <div className="flex flex-col gap-1.5">
                    <div className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full border ${sc.bg} ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      <span className={`font-inter text-[10px] font-bold uppercase tracking-wider ${sc.text}`}>{sc.label}</span>
                    </div>
                    <span className="font-inter text-xs text-outline">{product.stockQuantity} units</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => isCustomer ? navigate(`/product/${product._id}`) : handleOffer(product)}
                      className="w-8 h-8 rounded-lg bg-primary-container/10 border border-primary-container/30 flex items-center justify-center text-primary-container hover:bg-primary-container/20 transition-all outline-none"
                      title={isCustomer ? 'Buy' : 'Offer'}
                    >
                      <span className="material-symbols-outlined text-[16px]">{isCustomer ? 'shopping_cart' : 'handshake'}</span>
                    </button>
                    <Link
                      to={`/product/${product._id}`}
                      className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-outline hover:text-on-surface hover:border-zinc-600 transition-all outline-none"
                      title="View Details"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </Link>
                    {!isCustomer && (
                      <>
                        <button 
                          onClick={() => handleEdit(product)}
                          className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-outline hover:text-on-surface hover:border-zinc-600 transition-all outline-none"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-outline hover:text-error hover:border-error/50 hover:bg-error/10 transition-all outline-none"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 relative overflow-hidden shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 font-semibold uppercase mb-1 block">Product Name</label>
                  <input required value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary-container" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-semibold uppercase mb-1 block">SKU</label>
                  <input required value={formData.sku} onChange={(e)=>setFormData({...formData, sku: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary-container" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 font-semibold uppercase mb-1 block">Base Price ($)</label>
                  <input required type="number" value={formData.basePrice} onChange={(e)=>setFormData({...formData, basePrice: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary-container" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-semibold uppercase mb-1 block">Stock Quantity</label>
                  <input required type="number" value={formData.stockQuantity} onChange={(e)=>setFormData({...formData, stockQuantity: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary-container" />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase mb-1 block">Category</label>
                <select value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary-container">
                  {CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase mb-1 block">Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-container/20 file:text-primary-container hover:file:bg-primary-container/30" />
                {formData.imageBase64 && <div className="mt-2 text-xs text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> Image ready</div>}
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    setFormData({ sku: '', name: '', basePrice: '', category: 'Electronics', stockQuantity: '', imageBase64: '' });
                  }} 
                  className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
