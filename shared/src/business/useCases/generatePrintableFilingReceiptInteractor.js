const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');

/**
 * generatePrintableFilingReceiptInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case the documents were filed in
 * @param {object} providers.documentsFiled object containing the caseId and documents for the filing receipt to be generated
 * @returns {string} url for the generated document on the storage client
 */
exports.generatePrintableFilingReceiptInteractor = async ({
  applicationContext,
  caseId,
  documentsFiled,
}) => {
  const caseSource = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseSource, { applicationContext }).validate();

  const getDocumentInfo = documentData => {
    const document = new Document(documentData, {
      applicationContext,
    });
    document.generateFiledBy(caseEntity);
    return {
      attachments: document.attachments,
      certificateOfService: document.certificateOfService,
      certificateOfServiceDate: document.certificateOfServiceDate,
      documentTitle: document.documentTitle,
      filedBy: document.filedBy,
      objections: document.objections,
      receivedAt: document.receivedAt,
    };
  };
  const primaryDocument = getDocumentInfo(documentsFiled);

  const filingReceiptDocumentParams = { document: primaryDocument };

  if (documentsFiled.hasSupportingDocuments) {
    filingReceiptDocumentParams.supportingDocuments = documentsFiled.supportingDocuments.map(
      getDocumentInfo,
    );
  }

  if (documentsFiled.secondaryDocumentFile) {
    filingReceiptDocumentParams.secondaryDocument = getDocumentInfo(
      documentsFiled.secondaryDocument,
    );
  }

  if (documentsFiled.hasSecondarySupportingDocuments) {
    filingReceiptDocumentParams.secondarySupportingDocuments = documentsFiled.secondarySupportingDocuments.map(
      getDocumentInfo,
    );
  }

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

  const pdf = await applicationContext.getDocumentGenerators().receiptOfFiling({
    applicationContext,
    data: {
      caseCaptionExtension,
      caseTitle,
      docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
      filedAt: applicationContext
        .getUtilities()
        .formatDateString(primaryDocument.receivedAt, 'DATE_TIME_TZ'),
      filedBy: primaryDocument.filedBy,
      ...filingReceiptDocumentParams,
    },
  });

  const documentId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: pdf,
    documentId,
    useTempBucket: true,
  });

  const {
    url,
  } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    documentId,
    useTempBucket: true,
  });

  return url;
};
