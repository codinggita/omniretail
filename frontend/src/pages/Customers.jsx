import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import { getCustomers, getCustomerStats } from '../api/customersApi';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ total: 0, activeToday: 0, avgLifetimeValue: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async (q = '') => {
    try {
      setLoading(true);
      const [custData, statsData] = await Promise.all([
        getCustomers(q ? { search: q } : {}),
        getCustomerStats(),
      ]);
      setCustomers(custData);
      setStats(statsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') load(search);
  };

  // Collect all feedback across customers
  const feedbacks = customers.flatMap(c =>
    (c.feedback || []).map(f => ({ ...f, name: c.name }))
  ).slice(0, 5);

  const exportCustomersCSV = () => {
    const header = ['Name', 'Email', 'Total Spend', 'Status'];
    const rows = customers.map(c => [
      c.name,
      c.email,
      c.totalSpend,
      c.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [header, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="font-manrope text-[32px] font-bold text-on-surface">Customers</h2>
          <p className="font-inter text-sm text-on-surface-variant mt-1">Manage and view your customer database.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon="download" onClick={exportCustomersCSV}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Stats */}
        {[
          { label: 'Total Customers', value: stats.total, icon: 'group', color: 'primary-container', suffix: '' },
          { label: 'Active Today', value: stats.activeToday, icon: 'bolt', color: 'secondary', suffix: '' },
          { label: 'Avg. Lifetime Value', value: stats.avgLifetimeValue, icon: 'payments', color: '[#a0a3a5]', prefix: '₹' },
        ].map(({ label, value, icon, color, prefix = '' }) => (
          <div key={label} className="col-span-1 md:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-card-padding backdrop-blur-md flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center text-${color}`}>
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <h3 className="font-inter text-sm text-on-surface-variant font-medium">{label}</h3>
            </div>
            <div className="flex items-baseline gap-3 mt-auto">
              <span className="font-manrope text-[48px] font-extrabold text-on-surface leading-none tracking-tight">
                {loading ? <span className="inline-block w-20 h-10 bg-zinc-800 animate-pulse rounded" /> : `${prefix}${value?.toLocaleString('en-IN')}`}
              </span>
            </div>
          </div>
        ))}

        {/* Customer Directory */}
        <div className="col-span-1 md:col-span-8 bg-zinc-900/50 border border-zinc-800 rounded-xl p-card-padding backdrop-blur-md flex flex-col min-h-[500px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="font-manrope text-[24px] font-semibold text-on-surface">Customer Directory</h3>
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 font-inter text-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/50 transition-colors placeholder:text-on-surface-variant/50"
                placeholder="Search customers..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-3 px-4 font-inter text-xs font-semibold tracking-widest uppercase text-on-surface-variant">Name</th>
                  <th className="py-3 px-4 font-inter text-xs font-semibold tracking-widest uppercase text-on-surface-variant hidden sm:table-cell">Contact</th>
                  <th className="py-3 px-4 font-inter text-xs font-semibold tracking-widest uppercase text-on-surface-variant text-right">Total Spend</th>
                  <th className="py-3 px-4 font-inter text-xs font-semibold tracking-widest uppercase text-on-surface-variant text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i}>
                      {[1, 2, 3, 4].map(j => (
                        <td key={j} className="py-4 px-4">
                          <div className="h-3 bg-zinc-800 animate-pulse rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-on-surface-variant font-inter text-sm">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c._id} className="group hover:bg-zinc-800/30 transition-colors cursor-pointer">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-outline-variant shrink-0 flex items-center justify-center font-manrope text-sm font-semibold text-on-surface-variant">
                            {c.avatar ? <img alt={c.name} className="w-full h-full object-cover" src={c.avatar} /> : c.initials}
                          </div>
                          <div>
                            <p className="font-inter text-sm font-medium text-on-surface group-hover:text-primary-container transition-colors">{c.name}</p>
                            <p className="font-inter text-sm text-on-surface-variant text-[12px] sm:hidden">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <p className="font-inter text-sm text-on-surface-variant">{c.email}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-inter text-sm font-medium text-on-surface">₹{c.totalSpend?.toLocaleString('en-IN')}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {c.status === 'Top' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container font-inter text-[12px] font-semibold tracking-widest uppercase">
                            <span className="material-symbols-outlined text-[12px] [font-variation-settings:'FILL'1]">star</span>
                            Top
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-variant border border-outline-variant text-on-surface-variant font-inter text-[12px] font-semibold tracking-widest uppercase">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Widget */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-gutter">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-card-padding backdrop-blur-md flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-manrope text-[24px] font-semibold text-on-surface">Recent Feedback</h3>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto pr-2">
              {feedbacks.length === 0 && !loading ? (
                <p className="font-inter text-sm text-on-surface-variant text-center py-8">No feedback yet.</p>
              ) : (
                feedbacks.map((f, i) => (
                  <div key={i} className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1 text-secondary">
                        {[...Array(5)].map((_, j) => (
                          <span key={j} className={`material-symbols-outlined text-[16px] ${j < f.rating ? "[font-variation-settings:'FILL'1]" : 'text-zinc-700'}`}>star</span>
                        ))}
                      </div>
                      <span className="font-inter text-[12px] text-on-surface-variant">{f.time}</span>
                    </div>
                    <p className="font-inter text-sm text-on-surface mb-2">"{f.text}"</p>
                    <p className="font-inter text-[12px] text-on-surface-variant">— {f.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;
