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

  const { PDFDocument } = await applicationContext.getPdfLib();

  const coverPageDocument = await PDFDocument.load(
    new Uint8Array(coversheetData.pdfData.data),
  );
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

  await applicationContext
    .getUseCases()
    .uploadDocumentInteractor(applicationContext, {
      documentFile: updatedFile,
      key: docketEntryId,
      onUploadProgress: () => {},
    });

  await applicationContext
    .getUseCases()
    .updateDocketEntriesPostCoversheetInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
      updatedDocketEntryData: {
        consolidatedCases: coversheetData.consolidatedCases,
        numberOfPages,
      },
    });
};
