// import multer from 'multer';
// import multerS3 from 'multer-s3';
// import path from 'path';
// import { S3Client } from '@aws-sdk/client-s3';
// import config from '../config';

// const s3Config = new S3Client({
//   region: config.AWS.origin as string,
//   credentials: {
//     accessKeyId: config.AWS.accessKeyId as string,
//     secretAccessKey: config.AWS.secreatKey as string,
//   },
// });

// //
// export const uploadAwsS3Bucket = multer({
//   storage: multerS3({
//     s3: s3Config,
//     bucket: config.AWS.bucket_name as string,

//     key: (req, file, cb) => {
//       let filePath = '';
//       const fileExt = path.extname(file.originalname);
//       const modifyFileName =
//         file.originalname
//           .replace(fileExt, '')
//           .toLowerCase()
//           .split(' ')
//           .join('-') +
//         '-' +
//         Date.now() +
//         fileExt;

//       if (file.mimetype.includes('image')) {
//         filePath = `upload/images/${modifyFileName}`;
//       } else if (file.mimetype.includes(`audio`)) {
//         filePath = `upload/audios/${modifyFileName}`;
//       } else if (file.mimetype.includes(`video`)) {
//         filePath = `upload/videos/${modifyFileName}`;
//       } else if (file.mimetype.includes(`application`)) {
//         filePath = `upload/docs/${modifyFileName}`;
//       } else if (file.mimetype.includes(`pdf`)) {
//         filePath = `upload/pdfs/${modifyFileName}`;
//       } else {
//         filePath = `upload/others/${modifyFileName}`;
//       }

//       cb(null, filePath);
//     },
//     // Add the tagging configuration here
//   }),
// });

import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import config from '../config';

const s3Config = new S3Client({
  region: config.AWS.origin as string,
  credentials: {
    accessKeyId: config.AWS.accessKeyId as string,
    secretAccessKey: config.AWS.secreatKey as string,
  },
});

const uploadAwsS3Bucket = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: config.AWS.bucket_name as string,
    key: (req, file, cb) => {
      let filePath = '';
      const fileExt = path.extname(file.originalname);
      const modifyFileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now() +
        fileExt;

      // Determine file path based on field name and mimetype
      if (file.fieldname === 'image') {
        filePath = `upload/images/${modifyFileName}`;
      } else if (file.fieldname === 'media') {
        if (file.mimetype.includes('video')) {
          filePath = `upload/videos/${modifyFileName}`;
        } else if (file.mimetype.includes('audio')) {
          filePath = `upload/audios/${modifyFileName}`;
        } else if (file.mimetype.includes('application')) {
          filePath = `upload/docs/${modifyFileName}`;
        } else if (file.mimetype.includes('pdf')) {
          filePath = `upload/pdfs/${modifyFileName}`;
        } else {
          filePath = `upload/others/${modifyFileName}`;
        }
      }

      cb(null, filePath);
    },
  }),
});

// Export multer with fields for image and media
export const uploadMultiple = uploadAwsS3Bucket.fields([
  { name: 'image', maxCount: 6 },
  { name: 'media', maxCount: 3 },
]);
