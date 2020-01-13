const {
  addServedStampToDocument,
} = require('../../useCases/courtIssuedDocument/addServedStampToDocument');
const { formatDateString } = require('../../utilities/DateHandler');
const { PDFDocument } = require('pdf-lib');

/**
 * serveDocumentOnParties
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.caseId the optional caseId filter
 * @returns {Array} the pending items found
 */
exports.serveDocumentOnParties = async ({
  applicationContext,
  caseEntity,
  documentEntity,
  servedParties,
}) => {
  let paperServicePdfUrl;

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentEntity.documentId,
    })
    .promise();

  const serviceStampDate = formatDateString(documentEntity.servedAt, 'MMDDYY');

  const newPdfData = await addServedStampToDocument({
    pdfData,
    serviceStampText: `Served ${serviceStampDate}`,
  });

  applicationContext.logger.time('Saving S3 Document');
  await applicationContext.getPersistenceGateway().saveDocument({
    applicationContext,
    document: newPdfData,
    documentId: documentEntity.documentId,
  });
  applicationContext.logger.timeEnd('Saving S3 Document');

  const destinations = servedParties.electronic.map(party => ({
    email: party.email,
    templateData: {
      caseCaption: caseEntity.caseCaption,
      docketNumber: caseEntity.docketNumber,
      documentName: documentEntity.documentTitle,
      loginUrl: `https://ui-${process.env.STAGE}.${process.env.EFCMS_DOMAIN}`,
      name: party.name,
      serviceDate: formatDateString(documentEntity.servedAt, 'MMDDYYYY'),
      serviceTime: formatDateString(documentEntity.servedAt, 'TIME'),
    },
  }));

  if (destinations.length > 0) {
    await applicationContext.getDispatchers().sendBulkTemplatedEmail({
      applicationContext,
      defaultTemplateData: {
        caseCaption: 'undefined',
        docketNumber: 'undefined',
        documentName: 'undefined',
        loginUrl: 'undefined',
        name: 'undefined',
        serviceDate: 'undefined',
        serviceTime: 'undefined',
      },
      destinations,
      templateName: process.env.EMAIL_SERVED_TEMPLATE,
    });
  }

  if (servedParties.paper.length > 0) {
    const noticeDoc = await PDFDocument.load(newPdfData);
    const addressPages = [];
    let newPdfDoc = await PDFDocument.create();

    for (let party of servedParties.paper) {
      addressPages.push(
        await applicationContext
          .getUseCaseHelpers()
          .generatePaperServiceAddressPagePdf({
            applicationContext,
            contactData: party,
            docketNumberWithSuffix: `${
              caseEntity.docketNumber
            }${caseEntity.docketNumberSuffix || ''}`,
          }),
      );
    }

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

    const paperServicePdfData = await newPdfDoc.save();

    const paperServicePdfId = applicationContext.getUniqueId();

    applicationContext.logger.time('Saving S3 Document');
    await applicationContext.getPersistenceGateway().saveDocument({
      applicationContext,
      document: paperServicePdfData,
      documentId: paperServicePdfId,
      useTempBucket: true,
    });
    applicationContext.logger.timeEnd('Saving S3 Document');

    const {
      url,
    } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      applicationContext,
      documentId: paperServicePdfId,
      useTempBucket: true,
    });

    paperServicePdfUrl = url;
  }
  return paperServicePdfUrl;
};
