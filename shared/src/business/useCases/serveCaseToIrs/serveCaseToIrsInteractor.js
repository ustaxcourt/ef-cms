const {
  COUNTRY_TYPES,
  PETITIONS_SECTION,
} = require('../../entities/EntityConstants');
const {
  INITIAL_DOCUMENT_TYPES,
  PAYMENT_STATUS,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { UnauthorizedError } = require('../../../errors/errors');

exports.addDocketEntryForPaymentStatus = ({
  applicationContext,
  caseEntity,
}) => {
  if (caseEntity.petitionPaymentStatus === PAYMENT_STATUS.PAID) {
    caseEntity.addDocketRecord(
      new DocketRecord(
        {
          description: 'Filing Fee Paid',
          eventCode: 'FEE',
          filingDate: caseEntity.petitionPaymentDate,
        },
        { applicationContext },
      ),
    );
  } else if (caseEntity.petitionPaymentStatus === PAYMENT_STATUS.WAIVED) {
    caseEntity.addDocketRecord(
      new DocketRecord(
        {
          description: 'Filing Fee Waived',
          eventCode: 'FEEW',
          filingDate: caseEntity.petitionPaymentWaivedDate,
        },
        { applicationContext },
      ),
    );
  }
};

exports.deleteStinIfAvailable = async ({ applicationContext, caseEntity }) => {
  const stinDocument = caseEntity.documents.find(
    document =>
      document.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
  );

  if (stinDocument) {
    await applicationContext.getPersistenceGateway().deleteDocument({
      applicationContext,
      key: stinDocument.documentId,
    });

    return stinDocument.documentId;
  }
};

/**
 * serveCaseToIrsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @returns {Buffer} paper service pdf if the case is a paper case
 */
exports.serveCaseToIrsInteractor = async ({ applicationContext, caseId }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId: caseId,
    });

  const caseEntity = new Case(caseToBatch, { applicationContext });

  caseEntity.markAsSentToIRS();

  for (const initialDocumentTypeKey of Object.keys(INITIAL_DOCUMENT_TYPES)) {
    const initialDocumentType = INITIAL_DOCUMENT_TYPES[initialDocumentTypeKey];

    const initialDocument = caseEntity.documents.find(
      document => document.documentType === initialDocumentType.documentType,
    );

    if (initialDocument) {
      initialDocument.setAsServed([
        {
          name: 'IRS',
          role: 'irsSuperuser',
        },
      ]);
      caseEntity.updateDocument(initialDocument);

      if (
        initialDocument.documentType ===
        INITIAL_DOCUMENT_TYPES.petition.documentType
      ) {
        await applicationContext
          .getUseCaseHelpers()
          .sendIrsSuperuserPetitionEmail({
            applicationContext,
            caseEntity,
            documentEntity: initialDocument,
          });
      } else {
        await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
          applicationContext,
          caseEntity,
          documentEntity: initialDocument,
          servedParties: {
            //IRS superuser is served every document by default, so we don't need to explicitly include them as a party here
            electronic: [],
          },
        });
      }
    }
  }

  exports.addDocketEntryForPaymentStatus({ applicationContext, caseEntity });

  caseEntity
    .updateCaseCaptionDocketRecord({ applicationContext })
    .updateDocketNumberRecord({ applicationContext })
    .validate();

  //This functionality will probably change soon
  //  deletedStinDocumentId = await exports.deleteStinIfAvailable({
  //   applicationContext,
  //   caseEntity,
  // });
  // caseEntity.documents = caseEntity.documents.filter(
  //   item => item.documentId !== deletedStinDocumentId,
  // );

  const petitionDocument = caseEntity.documents.find(
    document =>
      document.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
  );

  const initializeCaseWorkItem = petitionDocument.workItems.find(
    workItem => workItem.isInitializeCase,
  );

  initializeCaseWorkItem.document.servedAt = petitionDocument.servedAt;
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

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  for (const doc of caseEntity.documents) {
    await applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      caseId: caseEntity.caseId,
      documentId: doc.documentId,
      replaceCoversheet: !caseEntity.isPaper,
      useInitialData: !caseEntity.isPaper,
    });
  }

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);
  const { docketNumberWithSuffix, preferredTrialCity, receivedAt } = caseEntity;

  const address = {
    ...caseEntity.contactPrimary,
    countryName:
      caseEntity.contactPrimary.countryType !== COUNTRY_TYPES.DOMESTIC
        ? caseEntity.contactPrimary.country
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
          .formatDateString(caseEntity.getIrsSendDate(), 'MMMM D, YYYY'),
      },
    });

  const caseConfirmationPdfName = caseEntity.getCaseConfirmationGeneratedPdfFileName();

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

  if (caseEntity.isPaper) {
    const {
      url,
    } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      applicationContext,
      documentId: caseConfirmationPdfName,
      useTempBucket: false,
    });

    return url;
  }
};
