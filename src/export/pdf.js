import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Letter @ 96 DPI = 816 × 1056 px. jsPDF uses pt: 612 × 792.
export async function exportPdf(node, { width, height, filename }) {
  const canvas = await html2canvas(node, {
    width, height,
    windowWidth: width, windowHeight: height,
    scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false,
  });
  const img = canvas.toDataURL('image/png');
  const doc = new jsPDF({ unit: 'pt', format: 'letter', orientation: 'portrait' });
  doc.addImage(img, 'PNG', 0, 0, 612, 792);
  doc.save(filename);
}
