import html2canvas from 'html2canvas';

export async function exportPng(node, { width, height, filename }) {
  const canvas = await html2canvas(node, {
    width, height,
    windowWidth: width, windowHeight: height,
    scale: 1, backgroundColor: null, useCORS: true, logging: false,
  });
  const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
  download(blob, filename);
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
