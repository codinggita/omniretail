import Order from '../models/order.model.js';

// @desc  Get all orders
// @route GET /api/v1/orders
export const getOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status && status !== 'All Statuses') query.status = status;
    if (search) query.orderId = { $regex: search, $options: 'i' };
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get order stats
// @route GET /api/v1/orders/stats
export const getOrderStats = async (req, res) => {
  try {
    const newOrders = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: 'Processing' });
    const returned = await Order.countDocuments({ status: 'Cancelled' });
    res.json({ newOrders, pending, returned });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Update order status
// @route PUT /api/v1/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
