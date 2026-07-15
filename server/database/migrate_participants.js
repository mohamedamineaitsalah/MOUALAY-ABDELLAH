require('dotenv').config();
const pool = require('../config/db');

async function migrate() {
  try {
    console.log('Starting participants table migration...');

    const addColumnsQueries = [
      "ALTER TABLE participants ADD COLUMN IF NOT EXISTS name_ar VARCHAR(255) NULL",
      "ALTER TABLE participants ADD COLUMN IF NOT EXISTS name_en VARCHAR(255) NULL",
      "ALTER TABLE participants ADD COLUMN IF NOT EXISTS city_ar VARCHAR(255) NULL",
      "ALTER TABLE participants ADD COLUMN IF NOT EXISTS city_en VARCHAR(255) NULL",
      "ALTER TABLE participants ADD COLUMN IF NOT EXISTS achievements_ar TEXT NULL",
      "ALTER TABLE participants ADD COLUMN IF NOT EXISTS achievements_en TEXT NULL"
    ];

    for (const query of addColumnsQueries) {
      try {
        await pool.query(query);
      } catch (e) {

        console.log(`Column addition info: ${e.message}`);
      }
    }
    console.log('✅ Bilingual columns verified/added.');

    await pool.query(`
      UPDATE participants 
      SET 
        name_en = COALESCE(name_en, name),
        name_ar = COALESCE(name_ar, name),
        city_en = COALESCE(city_en, city),
        city_ar = COALESCE(city_ar, city),
        achievements_en = COALESCE(achievements_en, achievements),
        achievements_ar = COALESCE(achievements_ar, achievements)
    `);
    console.log('✅ Standard values copied.');

    await pool.query(`
      UPDATE participants 
      SET 
        name_ar = 'المقدم هشام آيت صلاح', 
        name_en = 'MR. Hichame Ait salah',
        city_ar = 'آسفي',
        city_en = 'SAFI'
      WHERE name LIKE '%Hichame%'
    `);

    await pool.query(`
      UPDATE participants 
      SET 
        name_ar = 'المقدم رشيد سيكاس', 
        name_en = 'MR. Rachid Sikas',
        city_ar = 'الدار البيضاء - سطات',
        city_en = 'Casablanca-Settat'
      WHERE name LIKE '%Rachid%' OR name LIKE '%Sikas%'
    `);
    console.log('✅ Customized Arabic values for Rachid Sikas and Hichame Ait Salah successfully updated.');

    const [rows] = await pool.query('SELECT id, name_ar, name_en, city_ar, city_en FROM participants');
    console.log('Migration completed successfully. Current data:');
    console.log(JSON.stringify(rows, null, 2));

  } catch (error) {
    console.error('Migration failed:', error);
  }
  process.exit(0);
}

migrate();
