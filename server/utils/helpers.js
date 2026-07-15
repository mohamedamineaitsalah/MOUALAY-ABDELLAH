const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.generateToken = (id, role, expiresIn = process.env.JWT_EXPIRES_IN) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });
};

exports.deleteFile = (filename) => {
  if (!filename) return;
  const filepath = path.join(__dirname, '..', 'uploads', filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};
