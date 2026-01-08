const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
const { seedDatabase } = require('./seed');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

function initializeDatabase() {
  // Check if table exists
  const tableCheck = db.prepare("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='ice_creams'").get();

  let needsSeeding = false;
  if (tableCheck.count === 0) {
    needsSeeding = true;
  } else {
    // Check if table is empty
    const rowCheck = db.prepare("SELECT count(*) as count FROM ice_creams").get();
    if (rowCheck.count === 0) {
      needsSeeding = true;
    }
  }

  if (needsSeeding) {
    console.log('📦 Database empty or missing. Auto-seeding...');
    seedDatabase(db);
  } else {
    console.log('✅ Database already initialized.');
  }
}

// Run initialization
initializeDatabase();

// API Endpoints
app.get('/api/icecreams', (req, res) => {
  const iceCreams = db.prepare('SELECT * FROM ice_creams').all();
  // Map snake_case to camelCase for the frontend
  const mapped = iceCreams.map(item => ({
    id: item.id,
    name: item.name,
    type: item.type,
    origin: item.origin,
    baseIngredient: item.base_ingredient,
    brand: item.brand,
    calories: item.calories,
    fatContent: item.fat_content,
    texture: item.texture,
    acidity: item.acidity,
    sweetness: item.sweetness,
    temperature: item.temperature,
    flavor: item.flavor_tags,
    toppingPairing: item.topping_pairing,
    price: item.price,
    shelfLifeDays: item.shelf_life_days,
    imageUrl: item.image_url
  }));
  res.json(mapped);
});

app.get('/api/search', (req, res) => {
  const query = req.query.q || '';
  const searchTerm = `%${query}%`;
  const iceCreams = db.prepare(`
    SELECT * FROM ice_creams 
    WHERE name LIKE ? 
    OR flavor_tags LIKE ? 
    OR brand LIKE ?
    OR type LIKE ?
  `).all(searchTerm, searchTerm, searchTerm, searchTerm);

  const mapped = iceCreams.map(item => ({
    id: item.id,
    name: item.name,
    type: item.type,
    origin: item.origin,
    baseIngredient: item.base_ingredient,
    brand: item.brand,
    calories: item.calories,
    fatContent: item.fat_content,
    texture: item.texture,
    acidity: item.acidity,
    sweetness: item.sweetness,
    temperature: item.temperature,
    flavor: item.flavor_tags,
    toppingPairing: item.topping_pairing,
    price: item.price,
    shelfLifeDays: item.shelf_life_days,
    imageUrl: item.image_url
  }));
  res.json(mapped);
});

// Admin endpoint to seed data manually
app.post('/api/seed', (req, res) => {
  try {
    seedDatabase(db);
    res.json({ success: true, message: 'Database re-seeded successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`🍦 Server running at http://localhost:${port}`);
});
