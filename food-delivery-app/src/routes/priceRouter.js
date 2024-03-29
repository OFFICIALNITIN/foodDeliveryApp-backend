// Import required modules
const express = require('express');
const { calculatePrice } = require('../services/calculatePrice.js');

// Create Express router
const router = express.Router();

// Define API endpoint for price calculation
router.post('/calculatePrice', async (req, res) => {
  try {
    const { zone, organization_id, total_distance, item_type } = req.body;

    // Validate input parameters
    if (!zone || !organization_id || !total_distance || !item_type) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Call service function to calculate price
    const totalPrice = await calculatePrice(zone, organization_id, total_distance, item_type);

    // Respond with the total price
    res.json({ total_price: totalPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the router
module.exports = router;
