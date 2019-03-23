const multer = require('multer');
const GridStorage = require('multer-gridfs-storage');
const db = require('../config/database');

const storage = new GridStorage({
    url : db.url,
    file : (req,file)=>{
        return {
            bucketName : 'uploads'
        }
    }
})


const upload = multer({
    storage
}).array('car-pic', 5);

module.exports = upload
