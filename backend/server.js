const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, 'database.sqlite'));

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS ice_creams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    origin TEXT,
    base_ingredient TEXT,
    brand TEXT,
    calories INTEGER,
    fat_content INTEGER,
    texture INTEGER,
    acidity INTEGER,
    sweetness INTEGER,
    temperature TEXT,
    flavor_tags TEXT,
    topping_pairing TEXT,
    price INTEGER,
    shelf_life_days INTEGER,
    image_url TEXT
  )
`);

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

// Admin endpoint to seed data (just in case)
app.post('/api/seed', (req, res) => {
  const items = req.body;
  const insert = db.prepare(`
    INSERT OR REPLACE INTO ice_creams (
      id, name, type, origin, base_ingredient, brand, calories, fat_content, 
      texture, acidity, sweetness, temperature, flavor_tags, topping_pairing, 
      price, shelf_life_days, image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction((data) => {
    for (const item of data) {
      insert.run(
        item.id,
        item.name,
        item.type,
        item.origin,
        item.baseIngredient,
        item.brand,
        item.calories,
        item.fatContent,
        item.texture,
        item.acidity,
        item.sweetness,
        item.temperature,
        item.flavor,
        item.toppingPairing,
        item.price,
        item.shelfLifeDays,
        item.imageUrl || `https://images.unsplash.com/photo-1501443762994-82bd5dabb892?w=400&q=80`
      );
    }
  });

  transaction(items);
  res.json({ success: true, count: items.length });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
