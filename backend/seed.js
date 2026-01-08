const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

function seedDatabase(db) {
  try {
    console.log('🌱 Starting database seeding...');

    // Ensure table exists
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

    const rawDataPath = path.join(__dirname, 'raw_data.txt');
    let rawContent = fs.readFileSync(rawDataPath, 'utf8');

    // Clean up
    rawContent = rawContent.replace(/export const INITIAL_ICE_CREAMS: IceCream\[\] = /, '');
    rawContent = rawContent.trim();
    if (rawContent.endsWith(';')) {
      rawContent = rawContent.slice(0, -1);
    }

    const getIceCreams = new Function(`return ${rawContent}`);
    const ice_creams = getIceCreams();

    console.log(`Parsed ${ice_creams.length} items to seed.`);

    const insert = db.prepare(`
      INSERT OR REPLACE INTO ice_creams (
        id, name, type, origin, base_ingredient, brand, calories, fat_content, 
        texture, acidity, sweetness, temperature, flavor_tags, topping_pairing, 
        price, shelf_life_days, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((items) => {
      for (const item of items) {
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
          `https://plus.unsplash.com/premium_photo-1675865396014-c6373752c03c?q=80&w=400&auto=format&fit=crop`
        );
      }
    });

    insertMany(ice_creams);

    console.log(`✅ Successfully seeded ${ice_creams.length} items!`);
    return true;
  } catch (e) {
    console.error('❌ Error seeding:', e);
    return false;
  }
}

// Allow running directly: node seed.js
if (require.main === module) {
  const db = new Database(path.join(__dirname, 'database.sqlite'));
  seedDatabase(db);
}

module.exports = { seedDatabase };
