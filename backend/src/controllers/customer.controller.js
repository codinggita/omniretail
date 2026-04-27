import Customer from '../models/customer.model.js';

// @desc  Get all customers
// @route GET /api/v1/customers
export const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    const customers = await Customer.find(query).sort({ totalSpend: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get customer stats
// @route GET /api/v1/customers/stats
export const getCustomerStats = async (req, res) => {
  try {
    const total = await Customer.countDocuments();
    const activeToday = await Customer.countDocuments({ status: { $in: ['Active', 'Top'] } });
    const all = await Customer.find().select('totalSpend');
    const avgLifetimeValue =
      all.length > 0
        ? Math.round(all.reduce((sum, c) => sum + c.totalSpend, 0) / all.length)
        : 0;
    res.json({ total, activeToday, avgLifetimeValue });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
