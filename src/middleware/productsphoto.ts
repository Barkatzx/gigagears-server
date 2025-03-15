import multer from "multer";

// Configure storage
const storage = multer.diskStorage({
  destination: "/public/products-photo",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter (optional)
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

export const productPhoto = multer({ storage, fileFilter });
