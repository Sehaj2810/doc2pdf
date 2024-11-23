// backend/src/routes/documentRoutes.js
// import express from 'express';
// import upload from '../utils/fileUpload.js';
// import {
//   uploadDocument, 
//   downloadPDF, 
//   getDocumentMetadata 
// } from '../controllers/documentController.js';

// const router = express.Router();

// // File upload route (single file upload)
// router.post(
//   '/upload', 
//   upload.single('document'), 
//   uploadDocument
// );

// // Download PDF route
// router.get('/:id/download', downloadPDF);

// // Get document metadata route
// router.get('/:id', getDocumentMetadata);

// export default router;

import express from 'express';
import upload from '../utils/fileUpload.js';
import {
  uploadDocument,
  downloadPDF,
  getDocumentMetadata,
} from '../controllers/documentController.js';

const router = express.Router();

// File upload route (single file upload with optional password)
router.post(
  '/upload',
  upload.single('document'),
  uploadDocument
);

// Download PDF route
router.get('/:id/download', downloadPDF);

// Get document metadata route
router.get('/:id', getDocumentMetadata);

export default router;
