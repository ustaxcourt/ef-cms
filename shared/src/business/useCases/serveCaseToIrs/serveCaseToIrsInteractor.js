const {
  COUNTRY_TYPES,
  PETITIONS_SECTION,
} = require('../../entities/EntityConstants');
const {
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_MAP,
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { remove } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

exports.addDocketEntryForPaymentStatus = ({
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

exports.deleteStinIfAvailable = async ({ applicationContext, caseEntity }) => {
  const stinDocument = caseEntity.docketEntries.find(
    document =>
      document.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
  );

  if (stinDocument) {
    await applicationContext.getPersistenceGateway().deleteDocumentFromS3({
      applicationContext,
      key: stinDocument.docketEntryId,
    });

    return stinDocument.docketEntryId;
  }
};

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

/**
 * serveCaseToIrsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Buffer} paper service pdf if the case is a paper case
 */
exports.serveCaseToIrsInteractor = async ({
  applicationContext,
  docketNumber,
}) => {
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

  const caseEntity = new Case(caseToBatch, { applicationContext });

  caseEntity.markAsSentToIRS();

  for (const initialDocumentTypeKey of Object.keys(INITIAL_DOCUMENT_TYPES)) {
    const initialDocumentType = INITIAL_DOCUMENT_TYPES[initialDocumentTypeKey];

    const initialDocketEntry = caseEntity.docketEntries.find(
      document => document.documentType === initialDocumentType.documentType,
    );

    if (initialDocketEntry) {
      initialDocketEntry.setAsServed([
        {
          name: 'IRS',
          role: ROLES.irsSuperuser,
        },
      ]);
      caseEntity.updateDocketEntry(initialDocketEntry);

      if (
        initialDocketEntry.documentType ===
        INITIAL_DOCUMENT_TYPES.petition.documentType
      ) {
        await applicationContext
          .getUseCaseHelpers()
          .sendIrsSuperuserPetitionEmail({
            applicationContext,
            caseEntity,
            docketEntryEntity: initialDocketEntry,
          });
      } else {
        await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
          applicationContext,
          caseEntity,
          docketEntryEntity: initialDocketEntry,
          servedParties: {
            //IRS superuser is served every document by default, so we don't need to explicitly include them as a party here
            electronic: [],
          },
        });
      }
    }
  }

  exports.addDocketEntryForPaymentStatus({
    applicationContext,
    caseEntity,
    user,
  });

  caseEntity
    .updateCaseCaptionDocketRecord({ applicationContext })
    .updateDocketNumberRecord({ applicationContext })
    .validate();

  //This functionality will probably change soon
  //  deletedStinDocketEntryId = await exports.deleteStinIfAvailable({
  //   applicationContext,
  //   caseEntity,
  // });
  // caseEntity.docketEntries = caseEntity.docketEntries.filter(
  //   item => item.docketEntryId !== deletedStinDocketEntryId,
  // );

  const petitionDocument = caseEntity.docketEntries.find(
    document =>
      document.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
  );
  const initializeCaseWorkItem = petitionDocument.workItem;

  initializeCaseWorkItem.docketEntry.servedAt = petitionDocument.servedAt;
  initializeCaseWorkItem.caseTitle = Case.getCaseTitle(caseEntity.caseCaption);
  initializeCaseWorkItem.docketNumberWithSuffix =
    caseEntity.docketNumberWithSuffix;

  await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
    applicationContext,
    workItem: initializeCaseWorkItem.validate().toRawObject(),
  });

  initializeCaseWorkItem.setAsCompleted({
    message: 'Served to IRS',
    user: user,
  });

  await applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
    applicationContext,
    section: PETITIONS_SECTION,
    userId: user.userId,
    workItem: initializeCaseWorkItem,
  });

  await applicationContext.getPersistenceGateway().updateWorkItem({
    applicationContext,
    workItemToUpdate: initializeCaseWorkItem,
  });
  const caseWithServedDocketEntryInformation = await applicationContext
    .getPersistenceGateway()
    .updateCase({ applicationContext, caseToUpdate: caseEntity });

  const caseEntityToUpdate = new Case(caseWithServedDocketEntryInformation, {
    applicationContext,
  });

  for (const doc of caseEntityToUpdate.docketEntries) {
    if (doc.isFileAttached) {
      await applicationContext.getUseCases().addCoversheetInteractor({
        applicationContext,
        docketEntryId: doc.docketEntryId,
        docketNumber: caseEntityToUpdate.docketNumber,
        replaceCoversheet: !caseEntityToUpdate.isPaper,
        useInitialData: !caseEntityToUpdate.isPaper,
      });

      doc.numberOfPages = await applicationContext
        .getUseCaseHelpers()
        .countPagesInDocument({
          applicationContext,
          docketEntryId: doc.docketEntryId,
        });
    }
  }

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(
    caseEntityToUpdate,
  );
  const {
    docketNumberWithSuffix,
    preferredTrialCity,
    receivedAt,
  } = caseEntityToUpdate;

  const address = {
    ...caseEntityToUpdate.contactPrimary,
    countryName:
      caseEntityToUpdate.contactPrimary.countryType !== COUNTRY_TYPES.DOMESTIC
        ? caseEntityToUpdate.contactPrimary.country
        : '',
  };

  const pdfData = await applicationContext
    .getDocumentGenerators()
    .noticeOfReceiptOfPetition({
      applicationContext,
      data: {
        address,
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        preferredTrialCity,
        receivedAtFormatted: applicationContext
          .getUtilities()
          .formatDateString(receivedAt, 'MMMM D, YYYY'),
        servedDate: applicationContext
          .getUtilities()
          .formatDateString(
            caseEntityToUpdate.getIrsSendDate(),
            'MMMM D, YYYY',
          ),
      },
    });

  const caseConfirmationPdfName = caseEntityToUpdate.getCaseConfirmationGeneratedPdfFileName();

  await new Promise(resolve => {
    const documentsBucket = applicationContext.getDocumentsBucketName();
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: pdfData,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: caseConfirmationPdfName,
    };

    s3Client.upload(params, resolve);
  });

  let urlToReturn;

  if (caseEntityToUpdate.isPaper) {
    addDocketEntries({ caseEntity: caseEntityToUpdate });

    ({
      url: urlToReturn,
    } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      applicationContext,
      key: caseConfirmationPdfName,
      useTempBucket: false,
    }));
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntityToUpdate.validate().toRawObject(),
  });

  return urlToReturn;
};
