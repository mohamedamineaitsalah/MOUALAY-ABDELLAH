const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const initDatabase = async () => {
  try {

    const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  charset: 'utf8mb4',
  ssl: {
    rejectUnauthorized: false
  }
});

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.end();

    const pool = require('../config/db');

    const createTables = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        google_id VARCHAR(255),
        avatar VARCHAR(500),
        role ENUM('admin', 'visitor') DEFAULT 'visitor',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title_ar VARCHAR(500) NOT NULL,
        title_en VARCHAR(500) NOT NULL,
        description_ar TEXT NOT NULL,
        description_en TEXT NOT NULL,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image VARCHAR(500) NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        title_ar VARCHAR(500),
        title_en VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        youtube_url VARCHAR(500) NOT NULL,
        thumbnail VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS festival_program (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title_ar VARCHAR(500) NOT NULL,
        title_en VARCHAR(500) NOT NULL,
        description_ar TEXT,
        description_en TEXT,
        event_date DATE,
        event_time TIME,
        location VARCHAR(500),
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NULL,
        name_ar VARCHAR(255) NULL,
        name_en VARCHAR(255) NULL,
        city VARCHAR(255) NULL,
        city_ar VARCHAR(255) NULL,
        city_en VARCHAR(255) NULL,
        description_ar TEXT NULL,
        description_en TEXT NULL,
        photo VARCHAR(500) NULL,
        achievements TEXT NULL,
        achievements_ar TEXT NULL,
        achievements_en TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS sponsors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(500),
        image VARCHAR(500),
        website VARCHAR(500),
        facebook VARCHAR(500),
        instagram VARCHAR(500),
        twitter VARCHAR(500),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS countdown (
        id INT AUTO_INCREMENT PRIMARY KEY,
        festival_date DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        site_key VARCHAR(255) UNIQUE NOT NULL,
        site_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    const statements = createTables.split(';').filter(stmt => stmt.trim());
    for (let stmt of statements) {
      await pool.query(stmt);
    }

    const [adminCheck] = await pool.query('SELECT * FROM users WHERE email = ?', ['Mohamedamineaitsalah02@gmail.com']);
    if (adminCheck.length === 0) {
      const hashedPassword = await bcrypt.hash('Moulay1', 10);
      await pool.query(
        'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin', 'Moussem', 'Mohamedamineaitsalah02@gmail.com', hashedPassword, 'admin']
      );
      console.log('Admin user seeded.');
    }

    const [countdownCheck] = await pool.query('SELECT * FROM countdown');
    if (countdownCheck.length === 0) {
      await pool.query('INSERT INTO countdown (festival_date) VALUES (?)', ['2025-08-15 09:00:00']);
    }

    const [settingsCheck] = await pool.query('SELECT * FROM settings');
    if (settingsCheck.length === 0) {
      const defaultSettings = [
        ['site_title_ar', 'موسم مولاي عبد الله أمغار'],
        ['site_title_en', 'Moussem Moulay Abdellah Amghar'],
        ['site_desc_ar', 'أكبر تجمع للتبوريدة والفروسية التقليدية في المغرب'],
        ['site_desc_en', 'The Biggest Traditional Equestrian & Tbourida Festival in Morocco'],
        ['contact_email', 'mohamedamineaitsalah02@gmail.com'],
        ['contact_phone', '+212 697936897'],
        ['address', 'Moulay Abdellah, El Jadida, Morocco']
      ];
      for (const [key, val] of defaultSettings) {
        await pool.query('INSERT INTO settings (site_key, site_value) VALUES (?, ?)', [key, val]);
      }
    }

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

module.exports = initDatabase;
