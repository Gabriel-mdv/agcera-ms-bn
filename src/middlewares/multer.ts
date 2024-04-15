import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true)
    } else {
      cb(new Error('Not an image! Please upload only images.'))
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 10MB
  },
})

export default upload
