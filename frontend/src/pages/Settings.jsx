import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { generateApiKey, getProfile } from '../api/authApi';

const Settings = () => {
  const { user: reduxUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState(reduxUser);
  const [apiKey, setApiKey] = useState('');
  const [loadingKey, setLoadingKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Refresh full profile data (to get apiKeyCreatedAt and hasApiKey)
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleGenerateKey = async () => {
    if (!window.confirm('Generating a new API key will invalidate any existing key. Continue?')) return;
    
    try {
      setLoadingKey(true);
      const data = await generateApiKey();
      setApiKey(data.apiKey);
      // Refresh profile to update hasApiKey and createdAt
      const updatedProfile = await getProfile();
      setUser(updatedProfile);
    } catch (err) {
      alert('Failed to generate API key');
    } finally {
      setLoadingKey(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Settings</h2>
        <p className="text-zinc-400">Manage your store preferences, integrations, and account details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Settings */}
        <div className="md:col-span-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-4 border-b border-zinc-800/50 pb-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Profile Settings</h3>
              <p className="text-sm text-zinc-500">Update your operator information.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all" 
                type="text" 
                defaultValue={user?.name}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Role</label>
              <input 
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 capitalize cursor-not-allowed" 
                type="text" 
                value={user?.role}
                disabled
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-blue-500/50" 
                type="email" 
                defaultValue={user?.email}
              />
            </div>
          </div>
          
          <div className="mt-auto pt-6 flex justify-end">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
              Save Changes
            </button>
          </div>
        </div>

        {/* Store Configurations */}
        <div className="md:col-span-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-4 border-b border-zinc-800/50 pb-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700">
              <span className="material-symbols-outlined">store</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Store Config</h3>
              <p className="text-sm text-zinc-500">Global preferences.</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-bold text-zinc-200">Live Sync</span>
                <span className="block text-xs text-zinc-500">Real-time inventory updates</span>
              </div>
              <div className="w-12 h-7 bg-blue-500 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-md"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-bold text-zinc-200">Maintenance Mode</span>
                <span className="block text-xs text-zinc-500">Pause storefront operations</span>
              </div>
              <div className="w-12 h-7 bg-zinc-800 rounded-full relative cursor-pointer border border-zinc-700">
                <div className="absolute left-1 top-1 w-5 h-5 bg-zinc-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* API Access */}
        <div className="md:col-span-7 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-4 border-b border-zinc-800/50 pb-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700">
              <span className="material-symbols-outlined">api</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">API Access</h3>
              <p className="text-sm text-zinc-500">Manage integration keys for POS/ERP.</p>
            </div>
          </div>
          
          {user?.role === 'retailer' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Production API Key</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400 font-mono text-sm flex items-center justify-between overflow-hidden">
                    <span className="truncate">{apiKey || (user?.hasApiKey ? '••••••••••••••••••••••••••••••••' : 'No key generated')}</span>
                    {apiKey && (
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded ml-2 whitespace-nowrap border border-emerald-500/20">NEW</span>
                    )}
                  </div>
                  {apiKey && (
                    <button 
                      onClick={copyToClipboard}
                      className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-4 rounded-xl hover:bg-zinc-700 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                    </button>
                  )}
                </div>
                {user?.apiKeyCreatedAt && (
                  <p className="mt-3 text-[11px] text-zinc-500 font-medium">
                    Last generated: {new Date(user.apiKeyCreatedAt).toLocaleString()}
                  </p>
                )}
                {apiKey && (
                  <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3">
                    <span className="material-symbols-outlined text-amber-500 text-[20px]">warning</span>
                    <p className="text-[11px] text-amber-200/70 leading-relaxed">
                      Make sure to copy your API key now. You won't be able to see it again for security reasons.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={handleGenerateKey}
                  disabled={loadingKey}
                  className="text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group transition-all"
                >
                  <span className={`material-symbols-outlined text-[18px] ${loadingKey ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>sync</span>
                  {user?.hasApiKey ? 'Rotate API Key' : 'Generate API Key'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-zinc-800/50 border border-zinc-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-zinc-600 text-3xl">lock</span>
              </div>
              <h3 className="text-zinc-300 font-bold mb-2">Retailer Access Only</h3>
              <p className="text-xs text-zinc-500">API keys are only available for retailer accounts to integrate with POS systems.</p>
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="md:col-span-5 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-4 border-b border-zinc-800/50 pb-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700">
              <span className="material-symbols-outlined">notifications_active</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Notifications</h3>
              <p className="text-sm text-zinc-500">Manage alert channels.</p>
            </div>
          </div>
          
          <div className="space-y-5">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="w-6 h-6 rounded-lg border-2 border-blue-500 bg-blue-500/10 flex items-center justify-center mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-blue-400">check</span>
              </div>
              <div>
                <span className="block text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">Low Stock Alerts</span>
                <span className="block text-xs text-zinc-500 mt-1">Notify when inventory falls below threshold.</span>
              </div>
            </label>
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="w-6 h-6 rounded-lg border-2 border-zinc-700 bg-zinc-950 flex items-center justify-center mt-0.5 group-hover:border-zinc-600 transition-all">
              </div>
              <div>
                <span className="block text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">Daily Summary</span>
                <span className="block text-xs text-zinc-500 mt-1">Receive a nightly email digest of all operations.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="md:col-span-12 bg-red-500/5 backdrop-blur-md border border-red-500/20 rounded-2xl p-8 mt-4 shadow-[inset_0_1px_0_rgba(239,68,68,0.1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-500 mb-1">Danger Zone</h3>
                <p className="text-sm text-red-200/50">Irreversible actions for your store environment. Please be careful.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="text-right hidden sm:block">
                <strong className="block text-zinc-200 text-sm">Factory Reset</strong>
                <span className="text-zinc-500 text-xs">Clears all inventory data</span>
              </div>
              <button className="whitespace-nowrap px-8 py-3 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all font-bold text-xs uppercase tracking-widest active:scale-95">
                Reset Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
