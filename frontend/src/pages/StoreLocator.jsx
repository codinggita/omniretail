import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getNearbyStores } from '../api/storesApi';

// Fix for default marker icons in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Create a custom blue icon to match the brand
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const center = [12.9716, 77.5946]; // [lat, lng] for Leaflet

// Component to handle map view updates
const MapRefocus = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14, { animate: true });
    }
  }, [position, map]);
  return null;
};

const StoreLocator = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      // Mock coordinates for Bengaluru
      const data = await getNearbyStores(center[0], center[1]);
      setStores(data);
    };
    fetchStores();
  }, []);

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onStoreClick = (store) => {
    setSelectedStore(store);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
      {/* Left side: Map */}
      <div className="flex-1 relative border-r border-zinc-800 overflow-hidden bg-[#0e0e10]">
        <MapContainer 
          center={center} 
          zoom={12} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false} // We will use custom placement or standard
        >
          {/* CartoDB Dark Matter Tiles (Perfect for Dark Mode) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {stores.map(store => (
            <Marker
              key={store._id}
              position={[store.location.coordinates[1], store.location.coordinates[0]]}
              icon={customIcon}
              eventHandlers={{
                click: () => onStoreClick(store),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-zinc-900">{store.name}</h3>
                  <p className="text-xs text-zinc-600">{store.address}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">{store.phone}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {selectedStore && (
            <MapRefocus position={[selectedStore.location.coordinates[1], selectedStore.location.coordinates[0]]} />
          )}
        </MapContainer>

        {/* Search Overlay on Map */}
        <div className="absolute top-6 left-6 z-[1000] w-80">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search store locations..."
              className="w-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Right side: List */}
      <div className="w-96 flex flex-col bg-zinc-950/40">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Nearby Stores</h2>
          <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-500/20">
            {filteredStores.length} LOCATIONS
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {filteredStores.map(store => (
            <div 
              key={store._id}
              onClick={() => onStoreClick(store)}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                selectedStore?._id === store._id 
                  ? 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className={`font-bold transition-colors ${
                    selectedStore?._id === store._id ? 'text-blue-400' : 'text-zinc-200 group-hover:text-white'
                  }`}>
                    {store.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {store.address}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-zinc-500 group-hover:text-blue-400">directions</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">High Availability</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-950/50 p-2 rounded-xl border border-zinc-800/50 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-zinc-500 text-[16px] mb-1">inventory_2</span>
                  <span className="text-xs font-bold text-zinc-300">850</span>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded-xl border border-zinc-800/50 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-zinc-500 text-[16px] mb-1">schedule</span>
                  <span className="text-[10px] font-bold text-zinc-300">OPEN</span>
                </div>
                <div className="bg-zinc-950/50 p-2 rounded-xl border border-zinc-800/50 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-zinc-500 text-[16px] mb-1">local_shipping</span>
                  <span className="text-[10px] font-bold text-zinc-300 uppercase">Today</span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredStores.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-zinc-600 text-3xl">location_off</span>
              </div>
              <h3 className="text-zinc-300 font-bold mb-2">No stores found</h3>
              <p className="text-xs text-zinc-500">Try searching for a different location or adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;

