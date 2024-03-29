// Import the PostgreSQL client
const { Pool } = require('pg');
require('dotenv').config()

// Create a PostgreSQL pool
const pool = new Pool({
  user:process.env.DB_USER,
  host:process.env.DB_HOST,
  database:process.env.DB_NAME,
  password:process.env.DB_PASSWORD
});

// Function to calculate the total price
async function calculatePrice(zone, organizationId, totalDistance, itemType) {
  const client = await pool.connect();
  try {
    // Fetch pricing information from the database based on the provided inputs
    const query = `
      SELECT base_distance_in_km, km_price, fix_price
      FROM pricing
      WHERE organization_id = $1 AND zone = $2
    `;
    const result = await client.query(query, [organizationId, zone]);

    // Check if any rows were returned
    if (result.rows.length === 0) {
      throw new Error('No pricing information found for the specified criteria');
    }

    // Destructure properties from the first row of the result
    const { base_distance_in_km, km_price, fix_price } = result.rows[0];

    // Calculate total price
    let totalPrice = fix_price; // Base price
    if (totalDistance > base_distance_in_km) {
      const additionalDistance = totalDistance - base_distance_in_km;
      const additionalPrice = additionalDistance * (itemType === 'perishable' ? km_price : km_price - 0.5); // Adjust km_price based on item type
      totalPrice += additionalPrice;
    }

    return totalPrice;
  } finally {
    client.release();
  }
}

module.exports = { calculatePrice };

