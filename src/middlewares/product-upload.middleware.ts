import multer from "multer";
import { storage } from "../utils/cloudinary";

export const uploadProduct = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    if (allowedTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar (jpg, jpeg, png, webp) yang diperbolehkan"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});
