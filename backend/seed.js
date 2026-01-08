const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

try {
    const db = new Database('database.sqlite');
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
    rawContent = rawContent.replace(/const INITIAL_ICE_CREAMS: IceCream\[\] = /, '');
    rawContent = rawContent.trim();
    if (rawContent.endsWith(';')) {
        rawContent = rawContent.slice(0, -1);
    }

    // Use Function constructor instead of eval for better context control
    const getIceCreams = new Function(`return ${rawContent}`);
    const ice_creams = getIceCreams();

    console.log(`Parsed ${ice_creams.length} items`);

    const insert = db.prepare(`
      INSERT OR REPLACE INTO ice_creams (
        id, name, type, origin, base_ingredient, brand, calories, fat_content, 
        texture, acidity, sweetness, temperature, flavor_tags, topping_pairing, 
        price, shelf_life_days, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
        for (const item of ice_creams) {
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
    })();

    console.log(`Successfully seeded ${ice_creams.length} items!`);
} catch (e) {
    console.error('Error seeding:', e);
}
