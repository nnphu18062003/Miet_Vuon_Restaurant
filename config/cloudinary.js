const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

let upload;

// Check if Cloudinary Keys are present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'miet_vuon_restaurant',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        }
    });
    upload = multer({ storage: storage });
} else {
    // MOCK MODE: Use local storage or simple pass-through if keys are missing
    console.log("⚠️  CLOUDINARY KEYS MISSING: using Mock Storage for testing.");
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images/') // Fallback to local
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    });
    upload = multer({ storage: storage });

    // Mock cloudinary.uploader for direct calls if any (optional)
    cloudinary.uploader = {
        upload: async (path) => ({ secure_url: '/images/mock-url.jpg' })
    };
}

module.exports = { cloudinary, upload };
