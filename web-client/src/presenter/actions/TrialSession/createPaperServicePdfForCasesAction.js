/**
 * fix
 */
export const createPaperServicePdfForCasesAction = async ({
  applicationContext,
  props,
}) => {
  //props.pdfsArray from previous action
  //make calls to new or existing endpoint to append pages and create paper service pdf
  let { calendaredCasePdfDataArray } = props;
  const { PDFDocument } = await applicationContext.getPdfLib();
  const paperServiceDocumentsPdf = await PDFDocument.create();
  const user = applicationContext.getCurrentUser();

  for (let index = 0; index < calendaredCasePdfDataArray.length; index++) {
    const calendaredCasePdf = await PDFDocument.load(
      calendaredCasePdfDataArray[index],
    );
    await applicationContext.getUtilities().copyPagesAndAppendToTargetPdf({
      copyFrom: calendaredCasePdf,
      copyInto: paperServiceDocumentsPdf,
    });
  }

  const { docketEntryId, hasPaper, url } = await applicationContext
    .getUseCaseHelpers()
    .savePaperServicePdf({
      applicationContext,
      document: paperServiceDocumentsPdf,
    });

  if (url) {
    applicationContext.logger.info(
      `generated the printable paper service pdf at ${url}`,
      {
        url,
      },
    );
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'notice_generation_complete',
      docketEntryId,
      hasPaper,
      pdfUrl: url || null,
    },
    userId: user.userId,
  });
};
