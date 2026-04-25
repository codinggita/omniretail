import Negotiation from '../models/negotiation.model.js';
import Product from '../models/product.model.js';

// @desc  Create a new negotiation
// @route POST /api/v1/negotiations
export const createNegotiation = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if there's already an active negotiation for this user and product
    const existing = await Negotiation.findOne({
      productSku: product.sku,
      customerName: req.user.name,
      status: 'active'
    });

    if (existing) {
      return res.json(existing);
    }

    const negotiation = await Negotiation.create({
      productName: product.name,
      productImage: product.images?.[0]?.url,
      productSku: product.sku,
      basePrice: product.basePrice,
      minAcceptablePrice: product.minAcceptablePrice || (product.basePrice * 0.8),
      currentOffer: product.basePrice,
      customerName: req.user.name,
      customerInitials: req.user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      status: 'active',
      roundsTotal: 3,
      roundsUsed: 0,
      messages: [
        {
          sender: 'bot',
          content: `Hi ${req.user.name.split(' ')[0]}! I'm the OmniRetail AI assistant. I see you're interested in the ${product.name}. The base price is ₹${product.basePrice.toLocaleString('en-IN')}. What's your best offer?`,
          timestamp: new Date()
        }
      ]
    });

    res.status(201).json(negotiation);
  } catch (error) {
    console.error('Create negotiation error:', error);
    res.status(500).json({ 
      message: 'Server error while creating negotiation', 
      error: error.message 
    });
  }
};


// @desc  Get all active negotiations
// @route GET /api/v1/negotiations
export const getNegotiations = async (req, res) => {
  try {
    const negotiations = await Negotiation.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(negotiations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get negotiation by ID
// @route GET /api/v1/negotiations/:id
export const getNegotiationById = async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id);
    if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });
    res.json(negotiation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Send a message / place a bid
// @route POST /api/v1/negotiations/:id/message
export const sendMessage = async (req, res) => {
  try {
    const { content, offer } = req.body;
    const negotiation = await Negotiation.findById(req.params.id);
    if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });
    if (negotiation.status !== 'active')
      return res.status(400).json({ message: `Negotiation is already ${negotiation.status}` });

    // Add user message
    negotiation.messages.push({ sender: 'user', content, offer });
    negotiation.roundsUsed += 1;
    if (offer) negotiation.currentOffer = offer;

    // Bot logic
    if (offer && offer >= negotiation.minAcceptablePrice) {
      negotiation.status = 'accepted';
      negotiation.messages.push({
        sender: 'bot',
        content: `Deal! I accept ₹${offer.toLocaleString('en-IN')}. Your order will be confirmed shortly.`,
        offer,
      });
    } else if (negotiation.roundsUsed >= negotiation.roundsTotal) {
      const finalPrice = negotiation.minAcceptablePrice;
      negotiation.messages.push({
        sender: 'bot',
        content: `This is my absolute final offer: ₹${finalPrice.toLocaleString('en-IN')}. I cannot go any lower.`,
        offer: finalPrice,
      });
      negotiation.currentOffer = finalPrice;
    } else {
      const counterOffer = offer
        ? Math.round((offer + negotiation.minAcceptablePrice) / 2)
        : negotiation.minAcceptablePrice;
      negotiation.messages.push({
        sender: 'bot',
        content: `That's a bit low for this item. How about ₹${counterOffer.toLocaleString('en-IN')}? (Round ${negotiation.roundsUsed}/${negotiation.roundsTotal})`,
        offer: counterOffer,
      });
      negotiation.currentOffer = counterOffer;
    }

    await negotiation.save();
    res.json(negotiation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Accept a negotiation
// @route PUT /api/v1/negotiations/:id/accept
export const acceptNegotiation = async (req, res) => {
  try {
    const negotiation = await Negotiation.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    );
    if (!negotiation) return res.status(404).json({ message: 'Not found' });
    res.json(negotiation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Reject a negotiation
// @route PUT /api/v1/negotiations/:id/reject
export const rejectNegotiation = async (req, res) => {
  try {
    const negotiation = await Negotiation.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!negotiation) return res.status(404).json({ message: 'Not found' });
    res.json(negotiation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
