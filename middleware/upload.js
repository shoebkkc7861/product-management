import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".csv" && ext !== ".xlsx") {
    return cb(new Error("Only CSV or Excel files allowed"), false);
  }
  cb(null, true);
};

export default multer({ storage, fileFilter });
