var  multer=require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
var multerUpload = multer({ storage: storage })
var cpUpload = multerUpload.fields([{ name: 'foo', maxCount: 1 }, { name: 'file', maxCount: 8 }])

module.exports = cpUpload;