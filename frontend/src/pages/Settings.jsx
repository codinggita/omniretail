import { useSelector } from 'react-redux';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <h2 className="font-manrope text-3xl font-bold text-white">Settings</h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Section */}
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-manrope text-xl font-bold text-white mb-6">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
              <input type="text" defaultValue={user?.name} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-zinc-700" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
              <input type="email" defaultValue={user?.email} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-500 cursor-not-allowed" disabled />
            </div>
          </div>
          <button className="mt-6 bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </div>

        {/* Store Section (Retailer only) */}
        {user?.role === 'retailer' && (
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-manrope text-xl font-bold text-white mb-6">Store Configuration</h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                <div>
                  <p className="text-sm font-bold text-white">AI Negotiation Bot</p>
                  <p className="text-xs text-zinc-500">Automatically handle price offers from customers</p>
                </div>
                <div className="w-12 h-6 bg-secondary/20 rounded-full border border-secondary/30 relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-secondary rounded-full shadow-[0_0_10px_rgba(78,222,163,0.5)]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Default Discount Buffer (%)</label>
                <input type="number" defaultValue="20" className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white w-32 focus:outline-none focus:border-zinc-700" />
              </div>
            </div>
          </div>
        )}

        {/* Security */}
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-manrope text-xl font-bold text-white mb-6">Security</h3>
          <button className="bg-zinc-800 border border-zinc-700 px-6 py-2 rounded-lg text-white font-bold hover:bg-zinc-700 transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
