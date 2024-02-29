import { application } from 'express';
import { state } from '@web-client/presenter/app.cerebral';

async function getDocketEntryFileBuffer(
  applicationContext,
  docketNumber: string,
  docketEntryId: string,
) {
  const { url } = await applicationContext
    .getUseCases()
    .getDocumentDownloadUrlInteractor(applicationContext, {
      docketNumber,
      key: docketEntryId,
    });

  const httpClient = applicationContext.getHttpClient();
  const response = await httpClient.get(url, {
    responseType: 'arraybuffer',
  });
  return response.data;
}

export const generateCoversheetAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const { docketEntryId } = props;

  const fileBuffer = await getDocketEntryFileBuffer(
    applicationContext,
    docketNumber,
    docketEntryId,
  );

  const coversheetData = await applicationContext
    .getUseCases()
    .getCoversheetInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });

  //get pdflib
  const { PDFDocument } = await applicationContext.getPdfLib();

  console.log('coversheetData', coversheetData);
  console.log('fileBuffer', fileBuffer);
  const coverPageDocument = await PDFDocument.load(coversheetData.pdfData);
  const pdfDoc = await PDFDocument.load(fileBuffer);

  const coverPageDocumentPages = await pdfDoc.copyPages(
    coverPageDocument,
    coverPageDocument.getPageIndices(),
  );

  pdfDoc.insertPage(0, coverPageDocumentPages[0]);

  const newPdfData = await pdfDoc.save();
  const numberOfPages = pdfDoc.getPageCount();

  const updatedFile = new File(
    [newPdfData as BlobPart],
    `${docketEntryId}.pdf`,
    {
      type: 'application/pdf',
    },
  );

  console.log('GONNA START TO SAVE AGAIN!!!!!!!!!');

  await applicationContext
    .getUseCases()
    .uploadDocumentInteractor(applicationContext, {
      documentFile: updatedFile,
      key: docketEntryId,
      onUploadProgress: () => {},
    });
  console.log('completed START TO SAVE AGAIN!!!!!!!!!');

  await applicationContext.getUseCases.updateDocketEntriesInteractor(
    application,
    {
      docketEntryId,
      docketNumber,
      updatedDocketEntryData: {
        consolidatedCases: coversheetData.consolidatedCases,
        numberOfPages,
      },
    },
  );

  //append coversheet
  //upload updated file to S3

  //create new enpoint to update docket entry with new page count and set process to complete

  // await applicationContext
  //   .getUseCases()
  //   .addCoversheetInteractor(applicationContext, {
  //     docketEntryId,
  //     docketNumber,
  //   });
};
