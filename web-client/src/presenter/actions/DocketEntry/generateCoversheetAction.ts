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

  const coversheetBuffer = await applicationContext
    .getUseCases()
    .getCoversheetInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });

  //get pdflib
  const { PDFDocument } = await applicationContext.getPdfLib();

  console.log('coversheetBuffer', coversheetBuffer);
  console.log('fileBuffer', fileBuffer);
  const coverPageDocument = await PDFDocument.load(coversheetBuffer);
  const pdfDoc = await PDFDocument.load(fileBuffer);

  const coverPageDocumentPages = await pdfDoc.copyPages(
    coverPageDocument,
    coverPageDocument.getPageIndices(),
  );

  pdfDoc.insertPage(0, coverPageDocumentPages[0]);

  const newPdfData = await pdfDoc.save();
  const updatedFile = new File(
    [newPdfData as BlobPart],
    `${docketEntryId}.pdf`,
    {
      type: 'application/pdf',
    },
  );
  // const numberOfPages = pdfDoc.getPageCount();

  console.log('GONNA START TO SAVE AGAIN!!!!!!!!!');

  await applicationContext
    .getUseCases()
    .uploadDocumentInteractor(applicationContext, {
      documentFile: updatedFile,
      key: docketEntryId,
      onUploadProgress: () => {},
    });
  console.log('completed START TO SAVE AGAIN!!!!!!!!!');

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
