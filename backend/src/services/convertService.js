// import fs from 'fs';
// import path from 'path';
// import mammoth from 'mammoth';
// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'; // Import rgb from pdf-lib

// class ConvertService {
//   async convertDocxToPdf(inputPath, outputPath) {
//     try {
//       // Read the .docx file
//       const { value: docxText } = await mammoth.extractRawText({ path: inputPath });

//       if (!docxText || docxText.trim() === '') {
//         throw new Error('The DOCX file is empty or could not be read');
//       }

//       // Replace newlines with spaces (to prevent encoding issues)
//       const cleanedText = docxText.replace(/\n/g, ' ');

//       // Create a new PDF document
//       const pdfDoc = await PDFDocument.create();
//       let page = pdfDoc.addPage(); // Start with a single page
//       const { width, height } = page.getSize();
//       const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//       // Set font size and color
//       const fontSize = 12;
//       const margin = 50; // Margin for text
//       let yPosition = height - margin; // Initial y-position

//       // Wrap text within page bounds
//       const lines = this.wrapText(cleanedText, width - 2 * margin, font, fontSize);

//       // Draw text line by line
//       lines.forEach((line) => {
//         if (yPosition <= margin) {
//           // Add a new page if there is no space left
//           page = pdfDoc.addPage();
//           yPosition = page.getHeight() - margin;
//         }

//         page.drawText(line, {
//           x: margin,
//           y: yPosition,
//           size: fontSize,
//           font: font,
//           color: rgb(0, 0, 0) // Black text
//         });

//         yPosition -= fontSize + 2; // Move to next line
//       });

//       // Save the PDF
//       const pdfBytes = await pdfDoc.save();
//       fs.writeFileSync(outputPath, pdfBytes);

//       return outputPath;
//     } catch (error) {
//       console.error('Conversion error:', error);
//       throw new Error('Failed to convert document');
//     }
//   }

//   // Helper function to wrap text
//   wrapText(text, maxWidth, font, fontSize) {
//     const words = text.split(' ');
//     const lines = [];
//     let currentLine = '';

//     words.forEach((word) => {
//       const testLine = currentLine ? `${currentLine} ${word}` : word;
//       const testWidth = font.widthOfTextAtSize(testLine, fontSize);

//       if (testWidth <= maxWidth) {
//         currentLine = testLine; // Add word to the current line
//       } else {
//         if (currentLine) lines.push(currentLine); // Push the current line to the lines array
//         currentLine = word; // Start new line with current word
//       }
//     });

//     if (currentLine) lines.push(currentLine); // Add the last line
//     return lines;
//   }

//   // Optional: Add password protection to PDF
//   async addPasswordProtection(inputPath, outputPath, password) {
//     try {
//       const pdfDoc = await PDFDocument.load(fs.readFileSync(inputPath));
//       const protectedPdf = await PDFDocument.create();

//       // Copy pages
//       const copiedPages = await protectedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
//       copiedPages.forEach((page) => protectedPdf.addPage(page));

//       // Encrypt PDF
//       protectedPdf.setEncryption({
//         ownerPassword: password,
//         userPassword: password,
//         printPermission: true,
//         modifyPermission: false
//       });

//       const pdfBytes = await protectedPdf.save();
//       fs.writeFileSync(outputPath, pdfBytes);

//       return outputPath;
//     } catch (error) {
//       console.error('Password protection error:', error);
//       throw new Error('Failed to add password protection');
//     }
//   }
// }

// export default new ConvertService();

// import { exec } from 'child_process';
// import path from 'path';

// class ConvertService {
//   async convertDocxToPdf(inputPath, outputPath) {
//     return new Promise((resolve, reject) => {
//       const command = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf --outdir ${path.dirname(outputPath)} "${inputPath}"`;
//       exec(command, (error, stdout, stderr) => {
//         if (error) {
//           console.error('LibreOffice conversion error:', stderr);
//           reject(new Error('Failed to convert document'));
//         } else {
//           console.log('LibreOffice output:', stdout);
//           resolve(outputPath);
//         }
//       });
//     });
//   }
// }

// export default new ConvertService();

// import { exec } from 'child_process';
// import fs from 'fs';
// import path from 'path';

// class ConvertService {
//   async convertDocxToPdf(inputPath, outputPath) {
//     return new Promise((resolve, reject) => {
//       console.log('Starting conversion with paths:');
//       console.log('Input Path:', inputPath);
//       console.log('Expected Output Path:', outputPath);

//       const command = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf --outdir ${path.dirname(outputPath)} "${inputPath}"`;

//       exec(command, (error, stdout, stderr) => {
//         if (error) {
//           console.error('LibreOffice conversion error:', stderr);
//           reject(new Error('Failed to convert document'));
//         } else {
//           console.log('LibreOffice conversion success:', stdout);

//           // Log directory contents to confirm file location
//           const directoryContents = fs.readdirSync(path.dirname(outputPath));
//           console.log('Directory Contents After Conversion:', directoryContents);

//           // Check if the expected file exists
//           if (fs.existsSync(outputPath)) {
//             resolve(outputPath);
//           } else {
//             console.error('Converted PDF not found at:', outputPath);
//             reject(new Error('Converted PDF not found'));
//           }
//         }
//       });
//     });
//   }
// }

// export default new ConvertService();


// import { exec } from 'child_process';
// import fs from 'fs';
// import path from 'path';

// class ConvertService {
//   async convertDocxToPdf(inputPath, outputPath) {
//     return new Promise((resolve, reject) => {
//       const outputDir = path.dirname(outputPath);

//       console.log('Starting conversion with paths:');
//       console.log('Input Path:', inputPath);
//       console.log('Expected Output Path:', outputPath);

//       // LibreOffice command
//       const command = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf --outdir ${outputDir} "${inputPath}"`;

//       exec(command, (error, stdout, stderr) => {
//         if (error) {
//           console.error('LibreOffice conversion error:', stderr);
//           return reject(new Error('Failed to convert document'));
//         }

//         console.log('LibreOffice conversion success:', stdout);

//         // Check the directory for the actual PDF file
//         const files = fs.readdirSync(outputDir);
//         const actualPdfFile = files.find(file => file.endsWith('.pdf') && file.includes(path.basename(inputPath, '.docx')));

//         if (actualPdfFile) {
//           const actualPdfPath = path.join(outputDir, actualPdfFile);

//           // Rename the file to match the expected outputPath
//           fs.renameSync(actualPdfPath, outputPath);
//           console.log('Renamed file:', actualPdfPath, 'to:', outputPath);

//           resolve(outputPath); // Return the correct path
//         } else {
//           console.error('Converted PDF not found in directory:', outputDir);
//           reject(new Error('Converted PDF not found'));
//         }
//       });
//     });
//   }

//   async addPasswordProtection(inputPath, outputPath, password) {
//     try {
//       const pdfBytes = fs.readFileSync(inputPath);
//       const pdfDoc = await PDFDocument.load(pdfBytes);

//       pdfDoc.encrypt({
//         ownerPassword: password,
//         userPassword: password,
//         permissions: {
//           printing: 'lowResolution',
//           modifying: false,
//           copying: false,
//         },
//       });

//       const protectedPdfBytes = await pdfDoc.save();
//       fs.writeFileSync(outputPath, protectedPdfBytes);

//       return outputPath;
//     } catch (error) {
//       console.error('Password protection error:', error);
//       throw new Error('Failed to add password protection');
//     }
//   }
// }

// export default new ConvertService();


import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

class ConvertService {
  // Convert DOCX to PDF using LibreOffice
  async convertDocxToPdf(inputPath, outputPath, password = null) {
    return new Promise((resolve, reject) => {
      const command = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf --outdir ${path.dirname(outputPath)} "${inputPath}"`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('LibreOffice conversion error:', stderr);
          return reject(new Error('Failed to convert document'));
        }

        // Rename the generated PDF to match the expected output path
        const generatedPdfPath = path.join(path.dirname(outputPath), path.basename(inputPath).replace('.docx', '.pdf'));
        fs.renameSync(generatedPdfPath, outputPath);

        console.log(`PDF conversion success, path: ${outputPath}`);

        // If a password is provided, add it to the PDF
        if (password) {
          this.addPasswordProtection(outputPath, password)
            .then((protectedPath) => resolve(protectedPath))
            .catch((err) => reject(err));
        } else {
          resolve(outputPath);
        }
      });
    });
  }

  // Add password protection to a PDF
  async addPasswordProtection(pdfPath, password) {
    return new Promise((resolve, reject) => {
      const protectedPdfPath = pdfPath.replace('.pdf', '-protected.pdf');

      // LibreOffice doesn't natively support password protection via CLI, so use a library like qpdf
      const command = `qpdf --encrypt ${password} ${password} 256 -- ${pdfPath} ${protectedPdfPath}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Password protection error:', stderr);
          return reject(new Error('Failed to add password protection'));
        }

        console.log(`Password-protected PDF created: ${protectedPdfPath}`);

        // Clean up the original unprotected PDF
        fs.unlinkSync(pdfPath);

        resolve(protectedPdfPath);
      });
    });
  }
}

export default new ConvertService();
