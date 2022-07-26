const copyPagesFromPdf = async ({ copyFrom, copyInto }) => {
  let pagesToCopy = await copyInto.copyPages(
    copyFrom,
    copyFrom.getPageIndices(),
  );

  pagesToCopy.forEach(page => {
    copyInto.addPage(page);
  });

  console.log('pagesToCopy', pagesToCopy);
};

module.exports = { copyPagesFromPdf };
