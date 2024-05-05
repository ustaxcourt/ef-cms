import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregatePartiesForService } from '../../../../shared/src/business/utilities/aggregatePartiesForService';
import { saveFileAndGenerateUrl } from '../../../../shared/src/business/useCaseHelper/saveFileAndGenerateUrl';

export const serveDocumentAndGetPaperServicePdf = async ({
  applicationContext,
  caseEntities,
  docketEntryId,
  electronicParties,
  stampedPdf,
}: {
  applicationContext: ServerApplicationContext;
  caseEntities: Case[];
  docketEntryId: string;
  stampedPdf?: any;
  electronicParties?: { email: string; name: string }[];
}): Promise<{ pdfUrl: string } | undefined> => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  let originalPdfDoc;

  let newPdfDoc = await PDFDocument.create();

  for (const caseEntity of caseEntities) {
    const servedParties = aggregatePartiesForService(caseEntity);
    if (electronicParties) servedParties.electronic = electronicParties;

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId,
      servedParties,
    });

    if (servedParties.paper.length > 0) {
      if (!originalPdfDoc) {
        let pdfData: GetObjectCommandOutput;
        if (stampedPdf) {
          originalPdfDoc = await PDFDocument.load(stampedPdf);
        } else {
          pdfData = await applicationContext.getStorageClient().getObject({
            Bucket: applicationContext.environment.documentsBucketName,
            Key: docketEntryId,
          });
          originalPdfDoc = await PDFDocument.load(
            pdfData.Body as unknown as ArrayBuffer,
          );
        }
      }
      await applicationContext
        .getUseCaseHelpers()
        .appendPaperServiceAddressPageToPdf({
          applicationContext,
          caseEntity,
          newPdfDoc,
          noticeDoc: originalPdfDoc,
          servedParties,
        });
    }
  }

  if (newPdfDoc.getPageCount() > 0) {
    const paperServicePdfData = await newPdfDoc.save();
    const { url } = await saveFileAndGenerateUrl({
      applicationContext,
      file: paperServicePdfData,
      useTempBucket: true,
    });

    return { pdfUrl: url };
  }
};
