/**
 * Copies pages from source PDF and appends to the target PDF
 *
 * @param {object} copyFrom source pdf to copy pages from
 * @param {object} copyInto target pdf to append pages to
 */
export const copyPagesAndAppendToTargetPdf = async ({ copyFrom, copyInto }) => {
  const pagesToCopy = await copyInto.copyPages(
    copyFrom,
    copyFrom.getPageIndices(),
  );

  pagesToCopy.forEach(page => {
    copyInto.addPage(page);
  });
};
