const { Case } = require('../entities/cases/Case');
const { DocketEntry } = require('../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');

/**
 * generatePrintableFilingReceiptInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case the documents were filed in
 * @param {object} providers.documentsFiled object containing the docketNumber and documents for the filing receipt to be generated
 * @returns {string} url for the generated document on the storage client
 */
exports.getDocumentContentsForDocketEntryInteractor = async ({
  applicationContext,
  docketEntryId,
}) => {
  //retrieve docket entry
  //get documentContentsId
  try {
    const documentContentsFile = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: doc.documentContentsId,
        protocol: 'S3',
        useTempBucket: false,
      });

    const documentContentsData = JSON.parse(documentContentsFile.toString());
    // doc.documentContents = documentContentsData.documentContents;
    if (doc.isDraft) {
      doc.draftOrderState = {
        ...doc.draftOrderState,
        documentContents: documentContentsData.documentContents,
        richText: documentContentsData.richText,
      };
    }
  } catch (e) {
    applicationContext.logger.error(
      `Document contents ${doc.documentContentsId} could not be found in the S3 bucket.`,
    );
  }
};
