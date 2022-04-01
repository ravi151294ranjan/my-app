const util = require("util");
const multer = require("multer");
// const maxSize = 3 * 1024 * 1024;
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = 'public/uploads/';
        console.log(path, req.body.type)
        switch(req.body.type){
            case "content-upload-video":
                path= 'public/uploads/video-content/';
                break;
            case "content-upload-html-package":
                path= 'public/uploads/html-package/';
                break;
            case "content-image":
                path= 'public/uploads/content-image/';
                break;  
            case "sop-content-image":
                path= "public/uploads/sop-content-image/" 
                break;             
            default:
                path = 'public/uploads/';
                break;
        }

        var stat = null;
        try {
            stat = fs.statSync(path);
        } catch (err) {
            fs.mkdirSync(path);
        }
        if (stat && !stat.isDirectory()) {
            throw new Error('Directory cannot be created');
        }  
        cb(null, path )

    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    // limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;