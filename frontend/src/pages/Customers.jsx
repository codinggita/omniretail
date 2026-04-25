import { useState } from 'react';

const Customers = () => {
  const [customers] = useState([
    { id: 1, name: 'Saptak Bhattacharyya', email: 'saptak@example.com', orders: 12, spent: 450000, status: 'VIP' },
    { id: 2, name: 'Rahul Sharma', email: 'rahul@example.com', orders: 5, spent: 85000, status: 'Active' },
    { id: 3, name: 'Priya Patel', email: 'priya@example.com', orders: 2, spent: 15000, status: 'New' },
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-manrope text-3xl font-bold text-white">Customer Database</h2>
        <div className="flex gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">search</span>
            <input type="text" placeholder="Search customers..." className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-700" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {customers.map((c) => (
          <div key={c.id} className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container border border-primary-container/30">
                <span className="material-symbols-outlined text-[24px]">person</span>
              </div>
              <div>
                <h3 className="font-inter font-bold text-white">{c.name}</h3>
                <p className="text-zinc-500 text-xs">{c.email}</p>
              </div>
              <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                c.status === 'VIP' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                c.status === 'Active' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
              }`}>
                {c.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Total Orders</p>
                <p className="text-xl font-manrope font-bold text-white mt-1">{c.orders}</p>
              </div>
              <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Total Spent</p>
                <p className="text-xl font-manrope font-bold text-white mt-1">₹{c.spent.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-300 text-xs font-semibold transition-colors mt-2">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
