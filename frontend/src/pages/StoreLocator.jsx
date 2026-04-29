import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { getNearbyStores } from '../api/storesApi';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 12.9716,
  lng: 77.5946
};

// Dark theme map styles
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1b1b1b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#373737" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3c3c3c" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d3d3d" }],
  },
];

const StoreLocator = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    const fetchStores = async () => {
      const data = await getNearbyStores(center.lat, center.lng);
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
      <div className="flex-1 relative border-r border-zinc-800 overflow-hidden bg-zinc-900/20">
        {!isLoaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            options={{
              styles: darkMapStyle,
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            {stores.map(store => (
              <Marker
                key={store._id}
                position={{ lat: store.location.coordinates[1], lng: store.location.coordinates[0] }}
                onClick={() => onStoreClick(store)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                }}
              />
            ))}

            {selectedStore && (
              <InfoWindow
                position={{ 
                  lat: selectedStore.location.coordinates[1], 
                  lng: selectedStore.location.coordinates[0] 
                }}
                onCloseClick={() => setSelectedStore(null)}
              >
                <div className="p-2 min-w-[150px]">
                  <h3 className="font-bold text-zinc-900">{selectedStore.name}</h3>
                  <p className="text-sm text-zinc-600">{selectedStore.address}</p>
                  <p className="text-xs text-zinc-500 mt-1">{selectedStore.phone}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}

        {/* Search Overlay on Map */}
        <div className="absolute top-6 left-6 z-10 w-80">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search store locations..."
              className="w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-xl"
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
