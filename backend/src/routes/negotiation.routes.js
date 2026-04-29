const express = require('express');
const {
  getNegotiations,
  getNegotiationById,
  sendMessage,
  acceptNegotiation,
  rejectNegotiation,
  createNegotiation,
} = require('../controllers/negotiation.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.get('/', protect, getNegotiations);
router.post('/', protect, createNegotiation);
router.get('/:id', protect, getNegotiationById);
router.post('/:id/message', protect, sendMessage);
router.put('/:id/accept', protect, acceptNegotiation);
router.put('/:id/reject', protect, rejectNegotiation);

module.exports = router;
