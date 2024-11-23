// backend/src/controllers/documentController.js
import fs from 'fs';
import path from 'path';
import Document from '../models/Document.js';
import ConvertService from '../services/convertService.js';

// export const uploadDocument = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     // Create document metadata entry
//     const document = new Document({
//       originalName: req.file.originalname,
//       fileName: req.file.filename,
//       fileType: req.file.mimetype,
//       size: req.file.size,
//       pdfPath: null
//     });

//     // Convert DOCX to PDF
//     const inputPath = req.file.path;
//     const outputPath = path.join(
//       process.env.UPLOAD_PATH, 
//       `${document._id}.pdf`
//     );

//     const pdfPath = await ConvertService.convertDocxToPdf(inputPath, outputPath);

//     // Optional: Add password protection
//     // const protectedPdfPath = await ConvertService.addPasswordProtection(pdfPath, outputPath, 'optional-password');

//     // Update document with PDF path
//     document.pdfPath = pdfPath;
//     await document.save();

//     // Optional: Remove original DOCX file
//     fs.unlinkSync(inputPath);

//     res.status(201).json(document);
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ message: 'File upload and conversion failed' });
//   }
// };
// export const uploadDocument = async (req, res) => { //working
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     // Create document metadata entry
//     const document = new Document({
//       originalName: req.file.originalname,
//       fileName: req.file.filename,
//       fileType: req.file.mimetype,
//       size: req.file.size,
//       pdfPath: null
//     });

//     // Convert DOCX to PDF
//     const inputPath = req.file.path;
//     const outputPath = path.join(process.env.UPLOAD_PATH, `${document._id}.pdf`);

//     // Log paths for debugging
//     console.log('Input DOCX Path:', inputPath);
//     console.log('Expected Output PDF Path:', outputPath);

//     if (fs.existsSync(inputPath)) {
//       const pdfPath = await ConvertService.convertDocxToPdf(inputPath, outputPath);

//       // Log after conversion
//       console.log('Actual Output PDF Path:', pdfPath);
//       console.log('File exists:', fs.existsSync(pdfPath));

//       // Verify that the PDF file exists
//       if (fs.existsSync(pdfPath)) {
//         console.log('Saving PDF to the database with path:', pdfPath);

//         document.pdfPath = pdfPath;
//         await document.save();

//         fs.unlinkSync(inputPath); // Delete the original DOCX file
//         return res.status(201).json(document);
//       } else {
//         console.error('Failed to save PDF file:', pdfPath);
//         return res.status(500).json({ message: 'Failed to save PDF' });
//       }
//     } else {
//       console.error('Uploaded DOCX file not found:', inputPath);
//       return res.status(400).json({ message: 'Uploaded DOCX file not found' });
//     }
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ message: 'File upload and conversion failed' });
//   }
// };




// export const downloadPDF = async (req, res) => {//working
//   try {
//     const document = await Document.findById(req.params.id);

//     if (!document || !document.pdfPath) {
//       return res.status(404).json({ message: 'PDF not found' });
//     }

//     res.download(document.pdfPath, document.originalName.replace('.docx', '.pdf'));
//   } catch (error) {
//     console.error('Download error:', error);
//     res.status(500).json({ message: 'Failed to download PDF' });
//   }
// };



// export const getDocumentMetadata = async (req, res) => {
//   try {
//     const document = await Document.findById(req.params.id);

//     if (!document) {
//       return res.status(404).json({ message: 'Document not found' });
//     }

//     res.json(document);
//   } catch (error) {
//     console.error('Metadata retrieval error:', error);
//     res.status(500).json({ message: 'Failed to retrieve document metadata' });
//   }
// };


// Upload document and optionally apply password protection
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { password } = req.body; // Extract password from request

    // Create document metadata entry
    const document = new Document({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      size: req.file.size,
      pdfPath: null,
      passwordProtected: !!password // Set passwordProtected based on password presence
    });

    // Convert DOCX to PDF
    const inputPath = req.file.path;
    const outputPath = path.join(process.env.UPLOAD_PATH, `${document._id}.pdf`);

    // Log paths for debugging
    console.log('Input DOCX Path:', inputPath);
    console.log('Expected Output PDF Path:', outputPath);

    if (fs.existsSync(inputPath)) {
      const pdfPath = await ConvertService.convertDocxToPdf(inputPath, outputPath, password);

      // Log after conversion
      console.log('Actual Output PDF Path:', pdfPath);
      console.log('File exists:', fs.existsSync(pdfPath));

      // Verify that the PDF file exists
      if (fs.existsSync(pdfPath)) {
        console.log('Saving PDF to the database with path:', pdfPath);

        document.pdfPath = pdfPath;
        await document.save();

        fs.unlinkSync(inputPath); // Delete the original DOCX file
        return res.status(201).json({
          message: 'File converted successfully',
          _id: document._id,
          originalName: document.originalName,
          pdfUrl: `/uploads/${path.basename(pdfPath)}`,
          passwordProtected: document.passwordProtected
        });
      } else {
        console.error('Failed to save PDF file:', pdfPath);
        return res.status(500).json({ message: 'Failed to save PDF' });
      }
    } else {
      console.error('Uploaded DOCX file not found:', inputPath);
      return res.status(400).json({ message: 'Uploaded DOCX file not found' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload and conversion failed' });
  }
};

// Download PDF
export const downloadPDF = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || !document.pdfPath) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    console.log('Sending file for download:', document.pdfPath);
    res.download(document.pdfPath, document.originalName.replace('.docx', '.pdf'));
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Failed to download PDF' });
  }
};

// Get document metadata
export const getDocumentMetadata = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({
      _id: document._id,
      originalName: document.originalName,
      fileType: document.fileType,
      size: document.humanReadableSize,
      uploadDate: document.uploadDate,
      passwordProtected: document.passwordProtected,
      status: document.status
    });
  } catch (error) {
    console.error('Metadata retrieval error:', error);
    res.status(500).json({ message: 'Failed to retrieve document metadata' });
  }
};
