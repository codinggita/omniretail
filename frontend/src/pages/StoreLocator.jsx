const StoreLocator = () => {
  const stores = [
    { id: 1, name: 'Main City Store', address: '123 Business Ave, Kalol, Gujarat', status: 'Open', hours: '9:00 AM - 9:00 PM' },
    { id: 2, name: 'Express Outlet', address: '45 Retail St, Ahmedabad', status: 'Closed', hours: '10:00 AM - 8:00 PM' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-manrope text-3xl font-bold text-white">Store Locator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left: List */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {stores.map((store) => (
            <div key={store.id} className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 hover:border-zinc-700 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="font-inter font-bold text-white">{store.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  store.status === 'Open' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {store.status}
                </span>
              </div>
              <p className="text-zinc-500 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {store.address}
              </p>
              <p className="text-zinc-500 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                {store.hours}
              </p>
              <button className="mt-2 py-2 bg-primary-container/10 text-primary-container border border-primary-container/20 rounded-xl text-xs font-bold hover:bg-primary-container/20 transition-colors">
                View on Map
              </button>
            </div>
          ))}
        </div>

        {/* Right: Map Placeholder */}
        <div className="lg:col-span-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-zinc-950 opacity-50 grayscale contrast-125">
             <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" className="w-full h-full object-cover" alt="Map background" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-white">
            <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container border border-primary-container/30 animate-bounce">
              <span className="material-symbols-outlined text-[32px]">location_on</span>
            </div>
            <p className="font-manrope text-xl font-bold">Interactive Map Component</p>
            <p className="font-inter text-sm text-zinc-400 text-center max-w-md">Integrating Google Maps API to display real-time store availability and inventory levels.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
