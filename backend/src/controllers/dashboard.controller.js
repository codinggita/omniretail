const Order = require('../models/order.model.js');
const Customer = require('../models/customer.model.js');
const Negotiation = require('../models/negotiation.model.js');

// @desc  Get dashboard KPI stats
// @route GET /api/v1/dashboard/stats
// @access Private
exports.getDashboardStats = async (req, res) => {
  try {
    const totalNegotiations = await Negotiation.countDocuments();
    const acceptedNegotiations = await Negotiation.countDocuments({ status: 'accepted' });
    const rejectedNegotiations = await Negotiation.countDocuments({ status: 'rejected' });

    const acceptanceRate =
      totalNegotiations > 0
        ? parseFloat(((acceptedNegotiations / totalNegotiations) * 100).toFixed(1))
        : 0;

    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();

    const activeNegotiations = await Negotiation.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      totalOffers: totalNegotiations,
      acceptanceRate,
      wastedTripsAvoided: rejectedNegotiations,
      totalOrders,
      totalCustomers,
      activeNegotiations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
