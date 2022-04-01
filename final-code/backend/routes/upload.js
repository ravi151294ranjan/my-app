
/**
 * Upload module to perform File based operations..
 * @module Upload
 */

var express = require('express');
var router = express.Router();
const multer = require('multer');
let fs = require('fs-extra');
var fileSystem = require('fs')
var path = require('path');
var crypto = require('crypto');
var os = require('os');
// var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var util = require("../utils/util");
const { async } = require('q');
const IV_LENGTH = 16;
/**
 * Its contains the details of uploa0ding destination and renaming process
 * @type {Function}
 */
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let typePath = req.query.type
        let assetType = req.query.assetType
        let version = req.query.version
        let mode=req.query.mode
        console.log(typePath + "==" + assetType + "==" + version+"=="+mode)
        if (req.query.type != 'guidefiles') {
            if(mode != undefined){
                let path = `./uploads/assets/${mode}/${typePath}`;
                // cb(null, 'uploads')
                fs.mkdirsSync(path);
                cb(null, path);
    
            }else{
                let path = `./uploads/assets/${typePath}`;
                // cb(null, 'uploads')
                fs.mkdirsSync(path);
                cb(null, path);    
            }
        } else {
            let path = `./uploads/pdf/${typePath}`;
            fs.mkdirsSync(path);
            cb(null, path);
        }
    },
    filename: function (req, file, cb) {
        // let assetType = req.query.assetType
        const vName = file.originalname.split('.')
        let version = req.query.version
        let CatType = req.query.CatType
        if (req.query.type == 'uploadcommand' || req.query.type == 'guidefiles') {
            let filenameNew = (file.originalname).split('.');
            cb(null, filenameNew[0] + '-' + Date.now() + '.' + vName[vName.length - 1])
        } else {
            let filenameNew = (file.originalname).split('.');
            console.log(CatType+"=====+++++++++++++++++++++++++++")
            if (filenameNew.length > 2) {
                cb(null, filenameNew[0] +'_'+Date.now()  + '_' + version+ '_'+CatType+ '.' + filenameNew[1] + '.' + vName[vName.length - 1])
            } else {
                cb(null, filenameNew[0] +'_'+Date.now()  + '_' + version+ '_'+CatType+'.' + vName[vName.length - 1])
            }
        }
        // cb(null, file.originalname)// + '-' + Date.now() + '.' + vName[vName.length - 1])
        // cb(null, file.originalname + '-' + Date.now() + '.' + vName[vName.length - 1])
    }
})

/**
 * Its show to properties of multer library. Here we declare what type of storage and what type of files we want to processs.
 * @type {Function}
 */
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ||
            file.mimetype == 'application/octet-stream' || file.mimetype == 'application/pdf') {
            cb(null, true);
        } else {
            cb(null, false);
            // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }

})
/**
 * Sends a HTTP POST request to create user record based on tenant Login.
 * </br> 
 * @function uploadfile
 * @function
 * @path {POST} path /upload/uploadfile
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param upload.single {Function} It act as a midileware and it contains the details of file storage and upload variables.
 * @param req.file {File} Its contain File details to store in storage
 * @return {Object} Its return success or failure message based on File upload status.
 */

router.post('/uploadfile', upload.single('File'), (req, res, next) => {
    try {
        const file = req.file
        if (!file) {
            const error = {
                status: false
            }
            // error.httpStatusCode = 400
            res.status(400).send(error);
            // res.send(error)
            // return next(error)
        } else {
            file['status'] = true
            if (req.query.type == 'uploadcommand') {
                let ret = ''
                if (os.type() == 'Windows_NT') {
                    ret = (file.path).replace('uploads\\', '');
                } else {
                    ret = (file.path).replace('uploads/assets/', '');
                }
                file['path'] = process.env.baseUrl + ret
            }
            if (req.query.type == 'guidefiles') {
                let ret = ''
                if (os.type() == 'Windows_NT') {
                    ret = (file.path).replace('uploadspdf\\', '');
                } else {
                    ret = (file.path).replace('uploads/pdf/', '');
                }
                file['path'] = process.env.baseUrl + ret
            }
            res.status(200).send(file);
        }
    } catch (err) {
        util.writeLog(`${err} -> uploadfile`, 'post:/uploadImg/uploadfile');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }

})


router.get('/getThumpnailImg/:id/:mode', (req, res) => {
    try {
        console.log(req.params.id + "===="+req.params.mode)
        // var TenantDetail = req.headers.tendetail
        // var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
        // let decrypted = JSON.parse(decipher.update(TenantDetail, 'hex', 'utf8') + decipher.final('utf8'));

        if(req.params.mode=='Web'){
            let p = path.join(__dirname, `../uploads/assets/thumbnail/${req.params.id}`);
            res.sendFile(p);
        }else{
            let p = path.join(__dirname, `../uploads/assets/VR/thumbnail/${req.params.id}`);
            res.sendFile(p);
            
        }
    } catch (err) {
        util.writeLog(`${err} -> getThumpnailImg`, 'get:/uploadImg//getThumpnailImg/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})

// router.get('/getThumpnailImg', (req, res) => {
//     try {
//         var TenantDetail = req.headers.tendetail
//         var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
//         let decrypted = JSON.parse(decipher.update(TenantDetail, 'hex', 'utf8') + decipher.final('utf8'));
//         let p = path.join(__dirname, `../uploads/assets/thumbnail/${req.query.id}`);
//         res.sendFile(p);
//     } catch (err) {
//         util.writeLog(`${err} -> getThumpnailImg`, 'get:/uploadImg//getThumpnailImg');
//         var error = new Error();
//         error.success = false;
//         error.status = 404;
//         error.message = 'An internal error occurred. Please try again later';
//         res.send(error);
//     }
// })


// router.get('/getbundle', (req, res) => {
//     try {
//         let filename = 'cubetest.unity3d'
//         let p = path.join(__dirname, `../uploads/sample/bundle/${filename}`);
//         res.sendFile(p);
//     } catch (err) {
//         util.writeLog(`${err} -> getbundle`, 'get:/uploadImg//getbundle');
//         var error = new Error();
//         error.success = false;
//         error.status = 404;
//         error.message = 'An internal error occurred. Please try again later';
//         res.send(error);
//     }
//     // res.download(p);
// })
// router.get('/getmanifest', (req, res) => {
//     try {
//         let filename = 'cubetest.unity3d.manifest'
//         if (os.type() == 'Windows_NT') {
//             let p = path.join(__dirname, `../sample/bundle/${filename}`);
//             res.sendFile(p);
//         } else {
//             let p = path.join(__dirname, `../uploads/sample/bundle/${filename}`);
//             res.sendFile(p);
//         }
//     } catch (err) {
//         util.writeLog(`${err} -> getmanifest`, 'get:/uploadImg//getmanifest');
//         var error = new Error();
//         error.success = false;
//         error.status = 404;
//         error.message = 'An internal error occurred. Please try again later';
//         res.send(error);
//     }
// })


router.get('/getthumbnailData', (req, res) => {
    try {
        var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
        let decrypted = JSON.parse(decipher.update(req.query.id, 'hex', 'utf8') + decipher.final('utf8'));
        var vSplitData = (decrypted[0].thumbnailImgPath).split(process.env.baseUrl);
        if (os.type() == 'Windows_NT') {
            let p = path.join(__dirname, `../${vSplitData[1]}`);
            res.sendFile(p);
        } else {
            let p = path.join(__dirname, `../uploads/assets/${vSplitData[1]}`);
            res.sendFile(p);
        }
    } catch (err) {
        util.writeLog(`${err} -> getthumbnailData`, 'get:/uploadImg//getthumbnailData');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})


router.get('/getAssetForPreview/:id', (req, res) => {
    console.log(req.params.id + "=======")
    if (os.type() == 'Windows_NT') {
        let p = path.join(__dirname, `../uploads/assets/bundle/${req.params.id}`);
        console.log(p)
        res.sendFile(p);
    } else {
        let p = path.join(__dirname, `../uploads/assets/bundle/${req.params.id}`);
        res.sendFile(p);
    }
   // console.log(p);
})


router.get('/encryptCheck', (req, res) => {
    var text='6062bad3dcb51004d7a2fa87'
    const iv = crypto.randomBytes(16);
    console.log(iv)
    const cipher = crypto.createCipheriv(process.env.cryptoalgorithm, process.env.secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    var enc =iv.toString('hex')+"_"+encrypted.toString('hex')
    console.log(iv.toString('hex')+"_"+encrypted.toString('hex'))



    res.send(enc)
})


router.get('/dencryptCheck', (req, res) => {
    let hash='8013747ef95eae150cc9b748f255aa27_54f6b8e13c96e8001d007739cd023381c6bdbf246df320bf'
    let val=hash.split('_')
    const decipher = crypto.createDecipheriv(process.env.cryptoalgorithm, process.env.secretKey, Buffer.from(val[0], 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(val[1], 'hex')), decipher.final()]);

    console.log(decrpyted.toString())
    res.send(decrpyted.toString())
})

function decrypt(text){
    let hash=text//'8013747ef95eae150cc9b748f255aa27_54f6b8e13c96e8001d007739cd023381c6bdbf246df320bf'
    let val=hash.split('_')
    const decipher = crypto.createDecipheriv(process.env.cryptoalgorithm, process.env.secretKey, Buffer.from(val[0], 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(val[1], 'hex')), decipher.final()]);

    console.log(decrpyted.toString())
    return decrpyted.toString()
}

console.log("Platform: " + os.platform());
console.log("type: " + os.type());

module.exports = router