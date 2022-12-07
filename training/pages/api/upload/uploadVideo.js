import multer from "multer";
import path, { resolve } from "path";
import nc from 'next-connect'
import { tr } from "date-fns/locale";
const moment = require('moment');
const fs = require('fs');
const formidable = require('formidable');
const slugify = require('slugify');
// import { promises as fs } from "fs";
import { IncomingForm } from 'formidable';

var mv = require("mv");

// // export const config = {
// //     api: {
// //         bodyParser: false
// //     },
// // };

// // export default async (req, res) => {
    
// //     const data = await new Promise((resolve, reject) => {
// //        const form = new IncomingForm()
       
// //         form.parse(req, (err, fields, files) => {
// //             if (err) return reject(err)
// //             console.log(JSON.stringify(fields), files)
// //             var oldPath = files.file.filepath;
// //             var newPath = `./public/uploads/${files.file.originalFilename}`;
// //             mv(oldPath, newPath, function(err) {
// //             });
// //             res.status(200).json({ fields, files })
// //         })
// //     })

// //     res.json(data)
// // }



// export default async (req, res) => {

//     fs.mkdir(`./public/uploads`, {recursive: true}, function (err) {
//         return console.log(err)
//     });

//     const data = await new Promise((resolve, reject) => {
//         const form = formidable({
//             multiples: true,
//             uploadDir: `./public/uploads`,
//         });
        
//         form.keepExtensions = true;
//         form.keepFileName = true;
        
//         form.on("fileBegin", function (name, file) {
//             file.path = path.join(`./public/uploads`, slugify(file.name));
//         });


//         form.parse(req, (err, fields, files) => {
//             if (err) return reject(err);
//             resolve(files);
//         });
//     });

//     res.json(data);
// }



export const config = {
    api: {
        bodyParser: false
    },
};

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./public/uploads");
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        },
    }),
});

const handler = nc({
    onError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).end("something broke!")
    },
    onNoMatch: (req, res, next) => {
        res.status(404).end("Page is not found");
    }
})
.use(upload.array('inputFile'))
.post((req, res) => {
    res.status(200).send({ file: req.file })
})

export default handler;


// import { IncomingForm } from 'formidable';
// import { promises as fs } from 'fs';

// // first we need to disable the default body parser
// export const config = {
//     api: {
//         bodyParser: false,
//     }
// };

// export default async (req, res) => {
//     if (req.method === 'POST') {

//         // parse form with a Promise wrapper
//         const data = await new Promise((resolve, reject) => {
//             const form = new IncomingForm();
//             form.parse(req, (err, fields, files) => {
//                 if (err) return reject(err);
//                 resolve({ fields, files });
//             });
//         });

//         try {
//             const imageFile = data.files.inputFile; // .image because I named it in client side by that name: // pictureData.append('image', pictureFile);
//             const imagePath = imageFile.filepath;
//             const pathToWriteImage = `public/uploads`; // include name and .extention, you can get the name from data.files.image object
//             const image = await fs.readFile(imagePath);
//             await fs.writeFile(pathToWriteImage, image);
//             //store path in DB
//             res.status(200).json({ message: 'image uploaded!'});
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//             return;
//         }
//     };
// };



// import cloudinary from 'cloudinary';
// import { IncomingForm } from 'formidable';

// cloudinary.config({
//   cloud_name: 'dp7ubtrfe',
//   api_key: '683389499698583',
//   api_secret: 'J7cN_aB2Cl3D6KpU7JY1O1wZIzQ',
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async (req, res) => {
//   const data = await new Promise((resolve, reject) => {
//     const form = new IncomingForm();

//     form.parse(req, (err, fields, files) => {
//       if (err) return reject(err);
//       resolve({ fields, files });
//     });
//   });

//   const file = data?.files?.inputFile.path;

//   const response = await cloudinary.v2.uploader.upload(file, {
//     resource_type: 'video',
//     public_id: 'my_video',
//   });
//   return res.json(response);
// };

// export default async (req, res) => {

// const formidable = require("formidable");

// const form = new formidable.IncomingForm();
// form.uploadDir = "/uploads";
// form.keepExtensions = true;
// form.parse(req, (err, fields, files) => {
//   console.log(err, fields, files);
//   res.send(err || "DONE");
// });
// }

// import axios from 'axios';

// export default function handler(req, res) {
//   const body = req.body.body;

//   const result = axios.post('http://localhost:3001/uploadVideo', {
//       body: body
//     })
//   res.status(200).json(result.then((res) => console.log(res)))
// }



// const express = require('express')
// const multer = require('multer')

// const app = express();

// const fileStorageEngine = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     },
// })

// const upload = multer({storage: fileStorageEngine})

// app.post('/uploadVideo', upload.single('video'), (req, res) => {
//     console.log(req.file)
//     res.send(req.file)
// })

// app.listen(3001)

// const express = require("express")
// const cors = require("cors");
// const multer = require("multer");

// const app = express();

// //Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any origins
// app.use(cors());

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, __dirname + "/public/uploads");
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     },
// });

// const Data = multer({ storage: storage });

// app.post("/files", Data.any("files"), (req, res) => {
//     if (res.status(200)) {
//         console.log("Your file has been uploaded successfully.");
//         console.log(req.files);
//         res.json(req.files);
//         res.end();
//     }
//     res.send(req.file)
// });

// app.listen(8000, () => {
//     console.log("Server is running");
// });


// import cloudinary from 'cloudinary';
// import { IncomingForm } from 'formidable';

// cloudinary.config({
//   cloud_name: 'dp7ubtrfe',
//   api_key: '683389499698583',
//   api_secret: 'J7cN_aB2Cl3D6KpU7JY1O1wZIzQ',
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async (req, res) => {
//   const data = await new Promise((resolve, reject) => {
//     const form = new IncomingForm();

//     form.parse(req, (err, fields, files) => {
//       if (err) return reject(err);
//       resolve({ fields, files });
//     });
//   });

//   const file = data?.files?.inputFile.path;

//   const response = await cloudinary.v2.uploader.upload(file, {
//     folder: 'videos'
//   });
//   return res.json(response);
// };