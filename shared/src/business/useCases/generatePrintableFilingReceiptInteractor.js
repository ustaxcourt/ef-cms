const { Case } = require('../entities/cases/Case');
const { DocketEntry } = require('../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');

const getDocumentInfo = ({ applicationContext, documentData, petitioners }) => {
  const doc = new DocketEntry(documentData, {
    applicationContext,
    petitioners,
  });

  return {
    attachments: doc.attachments,
    certificateOfService: doc.certificateOfService,
    documentTitle: doc.documentTitle,
    filedBy: doc.filedBy,
    filingDate: doc.filingDate,
    formattedCertificateOfServiceDate: applicationContext
      .getUtilities()
      .formatDateString(doc.certificateOfServiceDate, 'MMDDYY'),
    objections: doc.objections,
    receivedAt: doc.receivedAt,
  };
};

/**
 * generatePrintableFilingReceiptInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case the documents were filed in
 * @param {object} providers.documentsFiled object containing the docketNumber and documents for the filing receipt to be generated
 * @returns {string} url for the generated document on the storage client
 */
exports.generatePrintableFilingReceiptInteractor = async (
  applicationContext,
  { docketNumber, documentsFiled },
) => {
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
    petitioners: caseRecord.petitioners,
  });

  const primaryDocumentRecord = caseEntity.docketEntries.find(
    doc => doc.docketEntryId === documentsFiled.primaryDocumentId,
  );
  primaryDocument.filedBy = primaryDocumentRecord.filedBy;
  primaryDocument.filingDate = primaryDocumentRecord.filingDate;

  const filingReceiptDocumentParams = { document: primaryDocument };

  if (documentsFiled.hasSupportingDocuments) {
    filingReceiptDocumentParams.supportingDocuments =
      documentsFiled.supportingDocuments.map(doc =>
        getDocumentInfo({ applicationContext, documentData: doc }),
      );
  }

  if (documentsFiled.secondaryDocumentFile) {
    filingReceiptDocumentParams.secondaryDocument = getDocumentInfo({
      applicationContext,
      documentData: documentsFiled.secondaryDocument,
    });
  }

  if (documentsFiled.hasSecondarySupportingDocuments) {
    filingReceiptDocumentParams.secondarySupportingDocuments =
      documentsFiled.secondarySupportingDocuments.map(doc =>
        getDocumentInfo({ applicationContext, documentData: doc }),
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
        .formatDateString(primaryDocument.filingDate, 'DATE_TIME_TZ'),
      filedBy: primaryDocument.filedBy,
      ...filingReceiptDocumentParams,
    },
  });

  const key = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: pdf,
    key,
    useTempBucket: true,
  });

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      key,
      useTempBucket: true,
    });

  return url;
};
