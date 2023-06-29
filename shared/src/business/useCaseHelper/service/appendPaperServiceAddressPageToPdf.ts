export const appendPaperServiceAddressPageToPdf = async ({
  applicationContext,
  caseEntity,
  newPdfDoc,
  noticeDoc,
  servedParties,
}) => {
  const addressPages = await getAddressPages({
    applicationContext,
    caseEntity,
    servedParties,
  });

  await copyToNewPdf({
    addressPages,
    applicationContext,
    newPdfDoc,
    noticeDoc,
  });
};

export const getAddressPages = async ({
  applicationContext,
  caseEntity,
  servedParties,
}) => {
  const addressPages = [];
  for (let party of servedParties.paper) {
    addressPages.push(
      await applicationContext.getDocumentGenerators().addressLabelCoverSheet({
        applicationContext,
        data: {
          ...party,
          docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
        },
      }),
    );
  }
  return addressPages;
};

export const copyToNewPdf = async ({
  addressPages,
  applicationContext,
  newPdfDoc,
  noticeDoc,
}) => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  for (let addressPage of addressPages) {
    const addressPageDoc = await PDFDocument.load(addressPage);
    let copiedPages = await newPdfDoc.copyPages(
      addressPageDoc,
      addressPageDoc.getPageIndices(),
    );
    copiedPages.forEach(page => {
      newPdfDoc.addPage(page);
    });

    copiedPages = await newPdfDoc.copyPages(
      noticeDoc,
      noticeDoc.getPageIndices(),
    );
    copiedPages.forEach(page => {
      newPdfDoc.addPage(page);
    });
  }
};
