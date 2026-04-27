import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import { getOrders, getOrderStats, updateOrderStatus } from '../api/ordersApi';

const STATUS_COLORS = {
  Processing: 'bg-[#a0a3a5]/10 text-[#a0a3a5] border-[#a0a3a5]/20',
  Shipped: 'bg-primary-container/10 text-primary-container border-primary-container/20',
  Delivered: 'bg-secondary/10 text-secondary border-secondary/20',
  Cancelled: 'bg-error/10 text-error border-error/20',
};

const SkeletonRow = () => (
  <tr>
    {[...Array(6)].map((_, i) => (
      <td key={i} className="py-4 px-6">
        <div className="h-3 bg-zinc-800 animate-pulse rounded w-full" />
      </td>
    ))}
  </tr>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ newOrders: 0, pending: 0, returned: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const load = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        getOrders({ status: statusFilter === 'All Statuses' ? '' : statusFilter, search }),
        getOrderStats(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') load();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      load();
    } catch (e) { console.error(e); }
  };

  const exportOrdersCSV = () => {
    const header = ['Order ID', 'Date', 'Customer', 'Total', 'Status'];
    const rows = orders.map(o => [
      o.orderId,
      new Date(o.createdAt).toLocaleDateString('en-IN'),
      o.customer,
      o.total,
      o.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [header, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-manrope text-[32px] font-bold text-on-surface mb-1">Orders Management</h2>
          <p className="font-inter text-sm text-on-surface-variant">Track, manage, and fulfill customer orders across all channels.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              className="appearance-none bg-surface-container border border-surface-variant rounded-lg px-4 py-2 pr-10 font-inter text-sm text-on-surface focus:outline-none cursor-pointer outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">filter_list</span>
          </div>
          <Button icon="download" onClick={exportOrdersCSV}>Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Stat Widgets */}
        {[
          { label: 'New Orders', value: stats.newOrders, icon: 'shopping_bag', color: 'primary' },
          { label: 'Pending Fulfillment', value: stats.pending, icon: 'hourglass_empty', color: '[#a0a3a5]' },
          { label: 'Cancelled', value: stats.returned, icon: 'assignment_return', color: 'error' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className={`col-span-1 md:col-span-4 bg-surface-container rounded-xl border border-surface-variant p-card-padding relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 rounded-full blur-3xl -mr-10 -mt-10`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="font-inter text-sm text-on-surface-variant font-medium">{label}</h3>
              <div className={`w-8 h-8 rounded-full bg-${color}/10 flex items-center justify-center text-${color}`}>
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </div>
            </div>
            <div className="relative z-10">
              <span className="font-manrope text-[32px] font-bold text-on-surface tracking-tight">
                {loading ? <span className="inline-block w-16 h-8 bg-zinc-800 animate-pulse rounded" /> : value?.toLocaleString()}
              </span>
            </div>
          </div>
        ))}

        {/* Orders Table */}
        <div className="col-span-1 md:col-span-12 bg-surface-container rounded-xl border border-surface-variant overflow-hidden mt-4 flex flex-col">
          <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-low/50">
            <h3 className="font-manrope text-[24px] font-semibold text-on-surface">Recent Orders</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                className="bg-surface border border-surface-variant rounded-lg pl-9 pr-4 py-1.5 font-inter text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 transition-all focus:w-64"
                placeholder="Search Order ID..."
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
                <tr className="bg-surface-container-low font-inter text-xs font-semibold tracking-widest uppercase text-on-surface-variant border-b border-surface-variant">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6 text-right">Total</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-inter text-sm text-on-surface divide-y divide-surface-variant">
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-on-surface-variant font-inter text-sm">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-surface-container-high/50 transition-colors group">
                      <td className="py-4 px-6 whitespace-nowrap font-medium text-primary">{order.orderId}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-on-surface-variant">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#39393b] flex items-center justify-center text-[10px] font-bold text-on-surface">
                            {order.initials}
                          </div>
                          {order.customer}
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right font-medium">
                        ₹{order.total?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <select
                          className="bg-surface-container border border-surface-variant rounded-lg px-2 py-1 font-inter text-xs text-on-surface focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-surface-variant flex items-center justify-between text-sm font-inter text-on-surface-variant bg-surface-container-lowest/30">
            <div>Showing {orders.length} orders</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
