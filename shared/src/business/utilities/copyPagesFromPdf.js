const copyPagesFromPdf = async ({ copyFrom, copyInto }) => {
  let pagesToCopy = await copyInto.copyPages(
    copyFrom,
    copyFrom.getPageIndices(),
  );
  console.log('pagesToCopy BEFORE ', pagesToCopy);

  pagesToCopy.forEach(page => {
    copyInto.addPage(page);
  });

  console.log('pagesToCopy AFTER ', pagesToCopy);
};

module.exports = { copyPagesFromPdf };
