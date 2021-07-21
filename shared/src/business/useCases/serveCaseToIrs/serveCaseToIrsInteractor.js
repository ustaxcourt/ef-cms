const {
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_MAP,
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { PETITIONS_SECTION } = require('../../entities/EntityConstants');
const { remove } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

const addDocketEntryForPaymentStatus = ({
  applicationContext,
  caseEntity,
  user,
}) => {
  if (caseEntity.petitionPaymentStatus === PAYMENT_STATUS.PAID) {
    caseEntity.addDocketEntry(
      new DocketEntry(
        {
          documentTitle: 'Filing Fee Paid',
          documentType: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
          eventCode: MINUTE_ENTRIES_MAP.filingFeePaid.eventCode,
          filingDate: caseEntity.petitionPaymentDate,
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          processingStatus: 'complete',
          userId: user.userId,
        },
        { applicationContext },
      ),
    );
  } else if (caseEntity.petitionPaymentStatus === PAYMENT_STATUS.WAIVED) {
    caseEntity.addDocketEntry(
      new DocketEntry(
        {
          documentTitle: 'Filing Fee Waived',
          documentType: MINUTE_ENTRIES_MAP.filingFeeWaived.documentType,
          eventCode: MINUTE_ENTRIES_MAP.filingFeeWaived.eventCode,
          filingDate: caseEntity.petitionPaymentWaivedDate,
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          processingStatus: 'complete',
          userId: user.userId,
        },
        { applicationContext },
      ),
    );
  }
};
exports.addDocketEntryForPaymentStatus = addDocketEntryForPaymentStatus;

const addDocketEntries = ({ caseEntity }) => {
  const initialDocumentTypesListRequiringDocketEntry = Object.values(
    INITIAL_DOCUMENT_TYPES_MAP,
  );

  remove(
    initialDocumentTypesListRequiringDocketEntry,
    doc =>
      doc === INITIAL_DOCUMENT_TYPES.petition.documentType ||
      doc === INITIAL_DOCUMENT_TYPES.stin.documentType,
  );

  for (let documentType of initialDocumentTypesListRequiringDocketEntry) {
    const foundDocketEntry = caseEntity.docketEntries.find(
      caseDocument => caseDocument.documentType === documentType,
    );

    if (foundDocketEntry) {
      foundDocketEntry.isOnDocketRecord = true;
      caseEntity.updateDocketEntry(foundDocketEntry);
    }
  }
};

const createPetitionWorkItems = async ({
  applicationContext,
  caseEntity,
  user,
}) => {
  const petitionDocument = caseEntity.docketEntries.find(
    doc => doc.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
  );
  const initializeCaseWorkItem = petitionDocument.workItem;

  initializeCaseWorkItem.docketEntry.servedAt = petitionDocument.servedAt;
  initializeCaseWorkItem.caseTitle = Case.getCaseTitle(caseEntity.caseCaption);
  initializeCaseWorkItem.docketNumberWithSuffix =
    caseEntity.docketNumberWithSuffix;

  initializeCaseWorkItem.setAsCompleted({
    message: 'Served to IRS',
    user,
  });

  await applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
    applicationContext,
    section: PETITIONS_SECTION,
    userId: user.userId,
    workItem: initializeCaseWorkItem.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().updateWorkItem({
    applicationContext,
    workItemToUpdate: initializeCaseWorkItem.validate().toRawObject(),
  });
};

const generateNoticeOfReceipt = async ({ applicationContext, caseEntity }) => {
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

  const { docketNumberWithSuffix, preferredTrialCity, receivedAt } = caseEntity;

  let pdfData = await applicationContext
    .getDocumentGenerators()
    .noticeOfReceiptOfPetition({
      applicationContext,
      data: {
        address: caseEntity.petitioners[0],
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        preferredTrialCity,
        receivedAtFormatted: applicationContext
          .getUtilities()
          .formatDateString(receivedAt, 'MMMM D, YYYY'),
        servedDate: applicationContext
          .getUtilities()
          .formatDateString(caseEntity.getIrsSendDate(), 'MMMM D, YYYY'),
      },
    });

  const contactSecondary = caseEntity.petitioners[1];
  if (contactSecondary) {
    const dataWithNoticeAttached = await generatePaperNoticeForContactSecondary(
      {
        applicationContext,
        caseCaptionExtension,
        caseEntity,
        caseTitle,
        contactSecondary,
        docketNumberWithSuffix,
        pdfData,
        preferredTrialCity,
        receivedAt,
      },
    );
    if (dataWithNoticeAttached) {
      pdfData = dataWithNoticeAttached;
    }
  }

  const caseConfirmationPdfName =
    caseEntity.getCaseConfirmationGeneratedPdfFileName();

  await applicationContext.getUtilities().uploadToS3({
    applicationContext,
    caseConfirmationPdfName,
    pdfData,
  });

  let urlToReturn;

  if (caseEntity.isPaper) {
    ({ url: urlToReturn } = await applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl({
        applicationContext,
        key: caseConfirmationPdfName,
        useTempBucket: false,
      }));
  }

  return urlToReturn;
};

const createCoversheetsForServedEntries = async ({
  applicationContext,
  caseEntity,
}) => {
  for (const doc of caseEntity.docketEntries) {
    if (doc.isFileAttached) {
      const updatedDocketEntry = await applicationContext
        .getUseCases()
        .addCoversheetInteractor(applicationContext, {
          caseEntity,
          docketEntryId: doc.docketEntryId,
          docketNumber: caseEntity.docketNumber,
          replaceCoversheet: !caseEntity.isPaper,
          useInitialData: !caseEntity.isPaper,
        });

      caseEntity.updateDocketEntry(updatedDocketEntry);
    }
  }
};

const generatePaperNoticeForContactSecondary = async ({
  applicationContext,
  caseCaptionExtension,
  caseEntity,
  caseTitle,
  contactSecondary,
  docketNumberWithSuffix,
  pdfData,
  preferredTrialCity,
  receivedAt,
}) => {
  const contactInformationDiff = applicationContext
    .getUtilities()
    .getAddressPhoneDiff({
      newData: caseEntity.petitioners[0],
      oldData: contactSecondary,
    });

  const addressFields = [
    'country',
    'countryType',
    'address1',
    'address2',
    'address3',
    'city',
    'state',
    'postalCode',
  ];

  const contactAddressesAreDifferent = Object.keys(contactInformationDiff).some(
    field => addressFields.includes(field),
  );

  if (!contactAddressesAreDifferent) {
    return;
  }

  const secondaryPdfData = await applicationContext
    .getDocumentGenerators()
    .noticeOfReceiptOfPetition({
      applicationContext,
      data: {
        address: contactSecondary,
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        preferredTrialCity,
        receivedAtFormatted: applicationContext
          .getUtilities()
          .formatDateString(receivedAt, 'MMMM D, YYYY'),
        servedDate: applicationContext
          .getUtilities()
          .formatDateString(caseEntity.getIrsSendDate(), 'MMMM D, YYYY'),
      },
    });

  const { PDFDocument } = await applicationContext.getPdfLib();
  const pdfDoc = await PDFDocument.load(pdfData);
  const secondaryPdfDoc = await PDFDocument.load(secondaryPdfData);
  const coverPageDocumentPages = await pdfDoc.copyPages(
    secondaryPdfDoc,
    secondaryPdfDoc.getPageIndices(),
  );
  pdfDoc.insertPage(1, coverPageDocumentPages[0]);

  const pdfDataBuffer = await pdfDoc.save();
  return Buffer.from(pdfDataBuffer);
};

/**
 * serveCaseToIrsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Buffer} paper service pdf if the case is a paper case
 */
exports.serveCaseToIrsInteractor = async (
  applicationContext,
  { docketNumber },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SERVE_PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let caseEntity = new Case(caseToBatch, { applicationContext });

  caseEntity.markAsSentToIRS();

  if (caseEntity.isPaper) {
    addDocketEntries({ caseEntity });
  }

  await createCoversheetsForServedEntries({
    applicationContext,
    caseEntity,
  });

  addDocketEntryForPaymentStatus({
    applicationContext,
    caseEntity,
    user,
  });

  caseEntity
    .updateCaseCaptionDocketRecord({ applicationContext })
    .updateDocketNumberRecord({ applicationContext })
    .validate();

  for (const initialDocumentTypeKey of Object.keys(INITIAL_DOCUMENT_TYPES)) {
    await applicationContext.getUtilities().serveCaseDocument({
      applicationContext,
      caseEntity,
      initialDocumentTypeKey,
    });
  }

  await createPetitionWorkItems({
    applicationContext,
    caseEntity,
    user,
  });

  const urlToReturn = await generateNoticeOfReceipt({
    applicationContext,
    caseEntity,
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });

  return urlToReturn;
};
