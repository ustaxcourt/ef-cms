const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { PETITIONS_SECTION } = require('../../entities/WorkQueue');
const { UnauthorizedError } = require('../../../errors/errors');

exports.addDocketEntryForPaymentStatus = ({
  applicationContext,
  caseEntity,
}) => {
  if (caseEntity.petitionPaymentStatus === Case.PAYMENT_STATUS.PAID) {
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
  } else if (caseEntity.petitionPaymentStatus === Case.PAYMENT_STATUS.WAIVED) {
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
      document.documentType ===
      Document.INITIAL_DOCUMENT_TYPES.stin.documentType,
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

  for (const initialDocumentTypeKey of Object.keys(
    Document.INITIAL_DOCUMENT_TYPES,
  )) {
    const initialDocumentType =
      Document.INITIAL_DOCUMENT_TYPES[initialDocumentTypeKey];

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
        Document.INITIAL_DOCUMENT_TYPES.petition.documentType
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
          servedParties: [
            {
              email: applicationContext.getIrsSuperuserEmail(),
              name: 'IRS',
            },
          ],
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

  caseEntity.markAsSentToIRS();

  const petitionDocument = caseEntity.documents.find(
    document =>
      document.documentType ===
      Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
  );

  const initializeCaseWorkItem = petitionDocument.workItems.find(
    workItem => workItem.isInitializeCase,
  );

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
    });
  }

  const pdfData = await applicationContext
    .getUseCaseHelpers()
    .generateCaseConfirmationPdf({
      applicationContext,
      caseEntity,
    });

  if (caseEntity.isPaper) {
    const paperServicePdfBuffer = Buffer.from(pdfData);

    return paperServicePdfBuffer;
  }
};
