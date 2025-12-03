import jsPDF from 'jspdf';
import { artworks, client, galleryInfo, proposalIntro, defaultTerms } from '../data/mockData';
import { formatPriceFull, formatDate } from './formatters';

// Load image as base64
async function loadImageAsBase64(imagePath) {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Could not load image: ${imagePath}`, error);
    return null;
  }
}

export async function generateProposalPDF(selectedArtworkIds) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter' // 612 x 792 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - (margin * 2);

  const selectedWorks = artworks.filter(a => selectedArtworkIds.includes(a.id));

  // Pre-load all images
  const imageCache = {};
  for (const artwork of selectedWorks) {
    imageCache[artwork.id] = await loadImageAsBase64(artwork.imageUrl);
  }

  const totalValue = selectedWorks.reduce((sum, a) => sum + a.price, 0);
  const primaryCount = selectedWorks.filter(a => a.market === 'Primary').length;
  const secondaryCount = selectedWorks.filter(a => a.market === 'Secondary').length;

  let currentY = 0;

  // Helper functions
  const addCenteredText = (text, y, fontSize = 12, fontStyle = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.text(text, pageWidth / 2, y, { align: 'center' });
  };

  const addLine = (y, color = '#cccccc') => {
    doc.setDrawColor(color);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
  };

  const addPageNumber = (pageNum, totalPages) => {
    doc.setFontSize(9);
    doc.setTextColor('#999999');
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 30, { align: 'center' });
    doc.setTextColor('#000000');
  };

  const totalPages = 3 + selectedWorks.length + 2; // Cover, Intro, Summary, Artworks, Terms, Contact

  // ============================================
  // PAGE 1: COVER PAGE
  // ============================================
  currentY = 150;

  // Gallery name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1f2937');
  addCenteredText(galleryInfo.name.toUpperCase(), currentY, 24, 'bold');

  currentY += 25;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#6b7280');
  addCenteredText(galleryInfo.tagline, currentY, 11, 'normal');

  currentY += 60;
  addLine(currentY);

  currentY += 80;
  doc.setTextColor('#1f2937');
  addCenteredText('ARTWORK PROPOSAL', currentY, 28, 'bold');

  currentY += 50;
  doc.setTextColor('#374151');
  addCenteredText(`Prepared for ${client.name}`, currentY, 18, 'normal');

  currentY += 35;
  doc.setTextColor('#6b7280');
  addCenteredText(formatDate(), currentY, 12, 'normal');

  currentY += 50;
  addLine(currentY);

  currentY += 50;
  doc.setTextColor('#374151');
  addCenteredText('Postwar Abstraction', currentY, 14, 'italic');

  currentY += 25;
  addCenteredText(`${selectedWorks.length} Selected Work${selectedWorks.length !== 1 ? 's' : ''}`, currentY, 14, 'normal');

  // Contact info at bottom
  currentY = pageHeight - 180;
  doc.setFontSize(11);
  doc.setTextColor('#374151');
  addCenteredText(galleryInfo.contact.name, currentY, 11, 'normal');
  currentY += 18;
  doc.setTextColor('#6b7280');
  addCenteredText(galleryInfo.contact.role, currentY, 10, 'normal');
  currentY += 18;
  addCenteredText(galleryInfo.contact.email, currentY, 10, 'normal');
  currentY += 18;
  addCenteredText(galleryInfo.contact.phone, currentY, 10, 'normal');

  // ============================================
  // PAGE 2: INTRODUCTION
  // ============================================
  doc.addPage();
  currentY = 60;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1f2937');
  doc.text('INTRODUCTION', margin, currentY);
  currentY += 8;
  addLine(currentY);

  currentY += 35;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#374151');
  doc.text(proposalIntro.greeting, margin, currentY);

  currentY += 30;
  doc.setFontSize(11);
  const introLines = doc.splitTextToSize(proposalIntro.body, contentWidth);
  doc.text(introLines, margin, currentY);
  currentY += (introLines.length * 16) + 30;

  addLine(currentY);
  currentY += 30;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1f2937');
  doc.text('PROPOSAL FOCUS', margin, currentY);
  currentY += 25;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#374151');
  const focusPoints = [
    'Museum-quality Postwar Abstraction',
    'Emphasis on Color Field pioneers',
    'Works by significant women artists',
    'Secondary market blue-chip examples',
    'Large-scale works suited to corporate installation'
  ];
  focusPoints.forEach(point => {
    doc.text('•', margin, currentY);
    doc.text(point, margin + 15, currentY);
    currentY += 20;
  });

  currentY += 20;
  addLine(currentY);
  currentY += 30;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1f2937');
  doc.text('TIMING & AVAILABILITY', margin, currentY);
  currentY += 25;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#374151');
  const timingLines = doc.splitTextToSize(proposalIntro.timing, contentWidth);
  doc.text(timingLines, margin, currentY);

  addPageNumber(2, totalPages);

  // ============================================
  // PAGE 3: PROPOSAL SUMMARY
  // ============================================
  doc.addPage();
  currentY = 60;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1f2937');
  doc.text('PROPOSAL SUMMARY', margin, currentY);
  currentY += 8;
  addLine(currentY);
  currentY += 30;

  // Summary box
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, currentY, contentWidth, 110, 5, 5, 'F');

  currentY += 30;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1f2937');
  doc.text(`Total Works: ${selectedWorks.length}`, margin + 20, currentY);

  currentY += 30;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#374151');
  doc.text(`Primary Market: ${primaryCount} work${primaryCount !== 1 ? 's' : ''}`, margin + 20, currentY);
  currentY += 20;
  doc.text(`Secondary Market: ${secondaryCount} work${secondaryCount !== 1 ? 's' : ''}`, margin + 20, currentY);

  currentY += 35;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#0ea5e9');
  doc.text(`Combined Value: ${formatPriceFull(totalValue)}`, margin + 20, currentY);

  currentY += 50;
  addLine(currentY);
  currentY += 30;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1f2937');
  doc.text('ARTWORK BREAKDOWN', margin, currentY);
  currentY += 30;

  // List each artwork
  selectedWorks.forEach((artwork) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#1f2937');
    doc.text(artwork.artist, margin, currentY);
    currentY += 18;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor('#6b7280');
    doc.text(`${artwork.title}, ${artwork.year}`, margin, currentY);
    currentY += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor('#374151');

    const priceText = artwork.priceFormatted;
    const marketText = `${artwork.market} Market`;

    doc.text(marketText, margin, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(priceText, pageWidth - margin, currentY, { align: 'right' });

    currentY += 30;
  });

  currentY += 10;
  addLine(currentY);
  currentY += 25;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1f2937');
  doc.text('TOTAL PROPOSAL VALUE', margin, currentY);
  doc.setTextColor('#0ea5e9');
  doc.text(formatPriceFull(totalValue), pageWidth - margin, currentY, { align: 'right' });

  addPageNumber(3, totalPages);

  // ============================================
  // ARTWORK PAGES (1 per artwork)
  // ============================================
  for (let i = 0; i < selectedWorks.length; i++) {
    const artwork = selectedWorks[i];
    doc.addPage();
    currentY = 50;

    // Image with aspect ratio preservation
    const containerHeight = 280;
    const containerWidth = contentWidth;

    if (imageCache[artwork.id]) {
      try {
        // Get image dimensions to calculate aspect ratio
        const img = new Image();
        img.src = imageCache[artwork.id];

        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        const imgAspectRatio = img.width / img.height;
        const containerAspectRatio = containerWidth / containerHeight;

        let finalWidth, finalHeight, offsetX, offsetY;

        if (imgAspectRatio > containerAspectRatio) {
          // Image is wider than container - fit to width
          finalWidth = containerWidth;
          finalHeight = containerWidth / imgAspectRatio;
          offsetX = 0;
          offsetY = (containerHeight - finalHeight) / 2;
        } else {
          // Image is taller than container - fit to height
          finalHeight = containerHeight;
          finalWidth = containerHeight * imgAspectRatio;
          offsetX = (containerWidth - finalWidth) / 2;
          offsetY = 0;
        }

        doc.addImage(imageCache[artwork.id], 'JPEG', margin + offsetX, currentY + offsetY, finalWidth, finalHeight);
      } catch (error) {
        console.warn(`Could not add image to PDF: ${artwork.title}`, error);
        // Fallback to placeholder
        doc.setFillColor(243, 244, 246);
        doc.roundedRect(margin, currentY, contentWidth, containerHeight, 5, 5, 'F');
        doc.setFontSize(12);
        doc.setTextColor('#9ca3af');
        doc.text('[Artwork Image]', pageWidth / 2, currentY + containerHeight / 2, { align: 'center' });
        doc.setTextColor('#000000');
      }
    } else {
      // Placeholder if image failed to load
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(margin, currentY, contentWidth, containerHeight, 5, 5, 'F');
      doc.setFontSize(12);
      doc.setTextColor('#9ca3af');
      doc.text('[Artwork Image]', pageWidth / 2, currentY + containerHeight / 2, { align: 'center' });
      doc.setTextColor('#000000');
    }

    currentY += containerHeight + 30;

    // Artist name
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#1f2937');
    doc.text(artwork.artist, margin, currentY);
    currentY += 25;

    // Title and year
    doc.setFontSize(16);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor('#6b7280');
    doc.text(`${artwork.title}, ${artwork.year}`, margin, currentY);
    currentY += 15;
    addLine(currentY);
    currentY += 25;

    // Details grid
    const col1X = margin;
    const col2X = margin + 250;

    // Medium
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#9ca3af');
    doc.text('MEDIUM', col1X, currentY);
    doc.text('DIMENSIONS', col2X, currentY);
    currentY += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#374151');
    doc.text(artwork.medium, col1X, currentY);
    doc.text(artwork.dimensions, col2X, currentY);
    currentY += 25;

    // Market and Price
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#9ca3af');
    doc.text('MARKET', col1X, currentY);
    doc.text('PRICE', col2X, currentY);
    currentY += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#374151');
    doc.text(artwork.market, col1X, currentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#0ea5e9');
    doc.text(artwork.priceFormatted, col2X, currentY);

    currentY += 25;
    addLine(currentY);
    currentY += 20;

    // Description
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#374151');
    const descLines = doc.splitTextToSize(artwork.description, contentWidth);
    doc.text(descLines, margin, currentY);
    currentY += (descLines.length * 16) + 15;

    // Significance
    if (artwork.significance) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor('#6b7280');
      const sigLines = doc.splitTextToSize(artwork.significance, contentWidth);
      doc.text(sigLines, margin, currentY);
      currentY += (sigLines.length * 16) + 20;
    }

    addLine(currentY);
    currentY += 20;

    // Provenance
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#1f2937');
    doc.text('Provenance', margin, currentY);
    currentY += 18;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#374151');
    artwork.provenance.forEach(item => {
      doc.text('•  ' + item, margin, currentY);
      currentY += 15;
    });

    currentY += 10;

    // Exhibitions
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#1f2937');
    doc.text('Selected Exhibitions', margin, currentY);
    currentY += 18;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#374151');
    artwork.exhibition.forEach(item => {
      doc.text('•  ' + item, margin, currentY);
      currentY += 15;
    });

    addPageNumber(4 + i, totalPages);
  }

  // ============================================
  // TERMS & CONDITIONS PAGE
  // ============================================
  doc.addPage();
  currentY = 60;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1f2937');
  doc.text('TERMS & CONDITIONS', margin, currentY);
  currentY += 8;
  addLine(currentY);
  currentY += 25;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#4b5563');

  const termsLines = doc.splitTextToSize(defaultTerms, contentWidth);
  doc.text(termsLines, margin, currentY);

  addPageNumber(4 + selectedWorks.length, totalPages);

  // ============================================
  // CONTACT & CLOSING PAGE
  // ============================================
  doc.addPage();
  currentY = 200;

  addLine(currentY);
  currentY += 50;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor('#374151');
  addCenteredText('Thank you for considering this', currentY, 13, 'italic');
  currentY += 20;
  addCenteredText('carefully curated selection.', currentY, 13, 'italic');
  currentY += 35;
  addCenteredText('We look forward to working with', currentY, 13, 'italic');
  currentY += 20;
  addCenteredText('you to build your collection.', currentY, 13, 'italic');

  currentY += 50;
  addLine(currentY);
  currentY += 50;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor('#1f2937');
  addCenteredText(galleryInfo.name.toUpperCase(), currentY, 16, 'bold');
  currentY += 22;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor('#6b7280');
  addCenteredText(galleryInfo.tagline, currentY, 11, 'normal');
  currentY += 35;

  doc.setTextColor('#374151');
  addCenteredText(galleryInfo.address, currentY, 10, 'normal');
  currentY += 18;
  addCenteredText(galleryInfo.phone, currentY, 10, 'normal');
  currentY += 18;
  addCenteredText(galleryInfo.email, currentY, 10, 'normal');
  currentY += 18;
  addCenteredText(galleryInfo.website, currentY, 10, 'normal');

  currentY += 40;
  addLine(currentY);
  currentY += 35;

  doc.setTextColor('#1f2937');
  addCenteredText('Your Art Advisor', currentY, 11, 'normal');
  currentY += 25;

  doc.setFont('helvetica', 'bold');
  addCenteredText(galleryInfo.contact.name, currentY, 12, 'bold');
  currentY += 18;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#6b7280');
  addCenteredText(galleryInfo.contact.role, currentY, 10, 'normal');
  currentY += 18;
  addCenteredText(galleryInfo.contact.email, currentY, 10, 'normal');
  currentY += 18;
  addCenteredText(galleryInfo.contact.phone, currentY, 10, 'normal');

  currentY += 50;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor('#9ca3af');
  addCenteredText('Private and confidential.', currentY, 9, 'italic');
  currentY += 15;
  addCenteredText(`Prepared exclusively for ${client.name}.`, currentY, 9, 'italic');

  addPageNumber(5 + selectedWorks.length, totalPages);

  // Save the PDF
  const filename = `${client.name.replace(' ', '_')}_Proposal_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);

  return filename;
}
