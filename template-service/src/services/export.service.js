const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const ApiError = require('../utils/ApiError');

// Create exports directory if it doesn't exist
const exportsDir = path.join(__dirname, '../exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

// Create data/templates directory if it doesn't exist
const templatesDir = path.join(__dirname, '../data/templates');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

const exportAsDocx = async (template, data) => {
  try {
    // In a real implementation, we would have template DOCX files
    // For MVP, we'll generate a simple DOCX using the template content and data
    
    // Create a basic template string - in a real app this would be more sophisticated
    const templateContent = template.content;
    
    // Create a simple template file if it doesn't exist yet
    const templatePath = path.join(templatesDir, `${template.category}.docx`);
    
    // For MVP, we'll skip the actual file creation and just simulate it
    // In a real implementation, we would have proper DOCX templates
    
    // Generate a unique filename
    const filename = `${template.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.docx`;
    const outputPath = path.join(exportsDir, filename);
    
    // Simple approach for MVP - write content to a file
    // In a real implementation, we would use Docxtemplater properly
    fs.writeFileSync(outputPath, JSON.stringify({
      template: templateContent,
      data: data
    }));
    
    return {
      filename,
      path: outputPath
    };
  } catch (error) {
    throw new ApiError(500, 'Failed to generate DOCX', true, error.stack);
  }
};

const exportAsPdf = async (template, data) => {
  try {
    // Generate a unique filename
    const filename = `${template.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    const outputPath = path.join(exportsDir, filename);
    
    // Create a PDF document
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    
    doc.pipe(stream);
    
    // Add content to the PDF
    doc.fontSize(16).text(template.title, { align: 'center' });
    doc.moveDown();
    
    // Simple template rendering - in a real app, this would be more sophisticated
    let content = template.content;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      content = content.replace(regex, data[key]);
    });
    
    doc.fontSize(12).text(content);
    
    // Finalize the PDF
    doc.end();
    
    // Wait for the stream to finish
    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        resolve({
          filename,
          path: outputPath
        });
      });
      
      stream.on('error', (error) => {
        reject(new ApiError(500, 'Failed to generate PDF', true, error.stack));
      });
    });
  } catch (error) {
    throw new ApiError(500, 'Failed to generate PDF', true, error.stack);
  }
};

module.exports = {
  exportAsDocx,
  exportAsPdf
}; 