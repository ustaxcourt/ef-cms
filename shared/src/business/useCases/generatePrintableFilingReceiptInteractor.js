const { Case } = require('../entities/cases/Case');
const { DocketEntry } = require('../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');

const getDocumentInfo = ({ applicationContext, documentData }) => {
  const document = new DocketEntry(documentData, {
    applicationContext,
  });

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

/**
 * generatePrintableFilingReceiptInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case the documents were filed in
 * @param {object} providers.documentsFiled object containing the docketNumber and documents for the filing receipt to be generated
 * @returns {string} url for the generated document on the storage client
 */
exports.generatePrintableFilingReceiptInteractor = async ({
  applicationContext,
  docketNumber,
  documentsFiled,
}) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseRecord, { applicationContext }).validate();

  const primaryDocument = getDocumentInfo({
    applicationContext,
    documentData: documentsFiled,
  });

  const primaryDocumentRecord = caseEntity.docketEntries.find(
    doc => doc.documentId === documentsFiled.primaryDocumentId,
  );
  primaryDocument.filedBy = primaryDocumentRecord.filedBy;

  const filingReceiptDocumentParams = { document: primaryDocument };

  if (documentsFiled.hasSupportingDocuments) {
    filingReceiptDocumentParams.supportingDocuments = documentsFiled.supportingDocuments.map(
      doc => getDocumentInfo({ applicationContext, documentData: doc }),
    );
  }

  if (documentsFiled.secondaryDocumentFile) {
    filingReceiptDocumentParams.secondaryDocument = getDocumentInfo({
      applicationContext,
      documentData: documentsFiled.secondaryDocument,
    });
  }

  if (documentsFiled.hasSecondarySupportingDocuments) {
    filingReceiptDocumentParams.secondarySupportingDocuments = documentsFiled.secondarySupportingDocuments.map(
      doc => getDocumentInfo({ applicationContext, documentData: doc }),
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
