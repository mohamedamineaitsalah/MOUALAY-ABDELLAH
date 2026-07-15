const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./config/db');
const crypto = require('crypto');

async function run() {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const logoFilename = null;

    console.log('Inserting into DB...');
    const result = await db.query(
      `INSERT INTO sponsors (name, description, logo, website, twitter, facebook, instagram)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
          'Indomie', 
          'Official Sponsor', 
          logoFilename, 
          'https://www.indomie.com/homepage', 
          'https://x.com/indomielovers', 
          'https://www.facebook.com/Indomie/', 
          'https://www.instagram.com/indomie'
      ]
    );

    console.log('Successfully inserted Indomie!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
