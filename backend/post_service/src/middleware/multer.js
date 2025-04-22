import multer from 'multer';
import path from 'path';

// Konfigurasi storage dengan folder yang berbeda untuk image dan video
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, '../../public/images/'); // Folder khusus untuk gambar
    } else if (file.mimetype.startsWith('video')) {
      cb(null, '../../public/videos/'); // Folder khusus untuk video
    } else {
      cb(new Error('File harus berupa gambar atau video!'));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nama file unik
  }
});

// Filter tipe file (image atau video saja)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('File harus berupa gambar (jpeg, jpg, png, gif) atau video (mp4, avi, mkv)!'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB per file
  fileFilter: fileFilter
});
