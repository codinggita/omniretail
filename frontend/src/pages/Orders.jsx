import { useState } from 'react';

const Orders = () => {
  const [orders] = useState([
    { id: 'ORD-001', customer: 'Rahul Sharma', product: 'AeroBook Pro', amount: 154000, status: 'Processing', date: '2024-04-20' },
    { id: 'ORD-002', customer: 'Priya Patel', product: 'Sony WH-1000XM5', amount: 24999, status: 'Shipped', date: '2024-04-19' },
    { id: 'ORD-003', customer: 'Amit Singh', product: 'iPhone 15 Pro', amount: 129900, status: 'Delivered', date: '2024-04-18' },
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-manrope text-3xl font-bold text-white">Order Management</h2>
        <div className="flex gap-3">
          <button className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg text-white text-sm font-semibold">Export</button>
          <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-sm font-bold">New Order</button>
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/50 border-b border-zinc-800">
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Order ID</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Customer</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Product</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest text-right">Amount</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-zinc-300">
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="p-4 font-medium text-white">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">{order.product}</td>
                <td className="p-4 text-right">₹{order.amount.toLocaleString('en-IN')}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'Delivered' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                    order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-zinc-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
