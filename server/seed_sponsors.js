const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./config/db');

async function run() {
  try {

    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const cocaSrc = path.join(__dirname, '..', 'coca cola.jpg');
    const cocaDest = path.join(uploadsDir, 'coca_cola.jpg');
    if (fs.existsSync(cocaSrc)) {
      fs.copyFileSync(cocaSrc, cocaDest);
      console.log('Copied coca cola.jpg');
    }

    const inwiSrc = path.join(__dirname, '..', 'inwi.jpg');
    const inwiDest = path.join(uploadsDir, 'inwi.jpg');
    if (fs.existsSync(inwiSrc)) {
      fs.copyFileSync(inwiSrc, inwiDest);
      console.log('Copied inwi.jpg');
    }

    const sponsors = [
      {
        name: 'Coca-Cola',
        description: 'Official Sponsor',
        logo: 'coca_cola.jpg',
        website: 'https://www.coca-cola.com',
        twitter: 'https://x.com/cocacolaco',
        facebook: 'https://www.facebook.com/TheCocaColaCo/',
        instagram: 'https://www.instagram.com/thecocacolaco/'
      },
      {
        name: 'Inwi',
        description: 'Official Telecom Partner',
        logo: 'inwi.jpg',
        website: 'https://inwi.ma',
        twitter: 'https://x.com/inwi?lang=fr',
        facebook: 'https://www.facebook.com/inwi.ma/',
        instagram: 'https://www.instagram.com/inwi_maroc/'
      }
    ];

    await db.query('DELETE FROM sponsors');

    for (const s of sponsors) {
      await db.query(
        `INSERT INTO sponsors (name, description, logo, website, twitter, facebook, instagram)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [s.name, s.description, s.logo, s.website, s.twitter, s.facebook, s.instagram]
      );
      console.log(`Inserted ${s.name}`);
    }

    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
