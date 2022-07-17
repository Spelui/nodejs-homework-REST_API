const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, '../', 'tmp');

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {},
});

const uploadFile = multer({
  storage: multerConfig,
});

module.exports = uploadFile;
