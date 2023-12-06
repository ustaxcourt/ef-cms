import { Case } from '../entities/cases/Case';
import { DocketEntry } from '../entities/DocketEntry';
import { getCaseCaptionMeta } from '../utilities/getCaseCaptionMeta';

const getDocumentInfo = ({
  applicationContext,
  documentData,
  petitioners,
}: {
  applicationContext: IApplicationContext;
  documentData: any;
  petitioners?: any[];
}) => {
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
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case the documents were filed in
 * @param {object} providers.documentsFiled object containing the docketNumber and documents for the filing receipt to be generated
 * @param {boolean} providers.fileAcrossConsolidatedGroup flag to determine whether the document should be filed across the consolidated cases group
 * @returns {string} url for the generated document on the storage client
 */
export const generatePrintableFilingReceiptInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    documentsFiled,
    fileAcrossConsolidatedGroup,
  }: {
    docketNumber: string;
    documentsFiled: any;
    fileAcrossConsolidatedGroup: boolean;
  },
) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let caseEntity = new Case(caseRecord, { applicationContext }).validate();

  if (fileAcrossConsolidatedGroup && !caseRecord.leadDocketNumber) {
    throw new Error(
      'you can not file across a consolidated group because this case is not part of one',
    );
  }

  let consolidatedCasesDocketNumbers: string[] = [];

  if (fileAcrossConsolidatedGroup) {
    const leadCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber: caseEntity.leadDocketNumber!,
      });
    consolidatedCasesDocketNumbers = leadCase.consolidatedCases
      .sort((a, b) => a.sortableDocketNumber - b.sortableDocketNumber)
      .map(consolidatedCaseRecord => consolidatedCaseRecord.docketNumber);
    caseEntity = new Case(leadCase, {
      applicationContext,
    }).validate();
  }

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

  const filingReceiptDocumentParams: any = { document: primaryDocument };

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
    } as any);
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
      consolidatedCasesDocketNumbers,
      docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
      fileAcrossConsolidatedGroup,
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
