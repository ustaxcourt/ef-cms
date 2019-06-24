const generatePdfUrlFactory = pdfLib => {
  return domElement => {
    const pdf = new pdfLib('p', 'pt', 'letter');
    pdf.canvas.height = 72 * 11;
    pdf.canvas.width = 72 * 8.5;
    const [fromLeft, fromTop] = [15, 0];

    pdf.fromHTML(domElement, fromLeft, fromTop, {
      height: 500, // ?
      width: pdf.canvas.width - 72,
    });

    return pdf.output('datauristring');
  };
};

exports.generatePdfUrlFactory = generatePdfUrlFactory;
