const express = require('express');
const multer = require('multer');
const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8999;

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Healthcheck endpoint for Docker container
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Watermark generation endpoint
app.post('/watermark', (req, res, next) => {
  // Use upload.single to parse the file
  upload.single('pdf')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
      }
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Please upload a PDF file.' });
      }

      const watermarkText = req.body.text || 'CONFIDENTIAL';
      const opacity = parseFloat(req.body.opacity) || 0.3;
      const size = parseInt(req.body.size, 10) || 50;

      // Validate inputs
      if (opacity < 0 || opacity > 1) {
        return res.status(400).json({ error: 'Opacity must be between 0 and 1.' });
      }
      if (size < 10 || size > 200) {
        return res.status(400).json({ error: 'Font size must be between 10 and 200.' });
      }

      // Process PDF
      const pdfDoc = await PDFDocument.load(req.file.buffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        
        // Measure text width to center it properly
        const textWidth = font.widthOfTextAtSize(watermarkText, size);
        const textHeight = size; // Approximate height

        // Calculate diagonal angle (approx 45 degrees)
        const angle = 45;
        const angleRad = (angle * Math.PI) / 180;

        // Position text centered diagonally
        const x = (width - textWidth * Math.cos(angleRad) + textHeight * Math.sin(angleRad)) / 2;
        const y = (height - textWidth * Math.sin(angleRad) - textHeight * Math.cos(angleRad)) / 2;

        page.drawText(watermarkText, {
          x,
          y,
          size,
          font,
          color: rgb(0.7, 0.7, 0.7),
          rotate: degrees(angle),
          opacity,
        });
      }

      const pdfBytes = await pdfDoc.save();

      // Set headers and send response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="watermarked_${req.file.originalname}"`);
      res.send(Buffer.from(pdfBytes));

    } catch (error) {
      console.error('Error watermarking PDF:', error);
      res.status(500).json({ error: 'Failed to process PDF file. Ensure it is a valid non-password-protected PDF.' });
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`PDF Watermarker service running on port ${PORT}`);
});
