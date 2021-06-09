exports.getCropBox = page => {
  const sizeCropBox = page.getCropBox();

  return {
    pageHeight: sizeCropBox.height,
    pageWidth: sizeCropBox.width,
    x: sizeCropBox.x || 0,
    y: sizeCropBox.y || 0,
  };
};
