const {
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_MAP,
} = require('../../entities/EntityConstants');
const { Document } = require('../../entities/Document');

const addNewInitialFilingToCase = ({
  applicationContext,
  authorizedUser,
  caseEntity,
  currentCaseDocument,
  documentType,
}) => {
  const { eventCode } = Object.values(INITIAL_DOCUMENT_TYPES).find(
    dt => dt.documentType === documentType,
  );

  let partySecondary = false;
  if (caseEntity.contactSecondary && caseEntity.contactSecondary.name) {
    partySecondary = true;
  }

  const documentToAdd = new Document(
    {
      ...currentCaseDocument,
      eventCode,
      partyPrimary: true,
      partySecondary,
      userId: authorizedUser.userId,
      ...caseEntity.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
    },
    { applicationContext },
  );

  caseEntity.documents.push(documentToAdd);
};

const deleteInitialFilingFromCase = async ({
  applicationContext,
  caseEntity,
  originalCaseDocument,
}) => {
  caseEntity.documents = caseEntity.documents.filter(
    item => item.documentId !== originalCaseDocument.documentId,
  );

  await applicationContext.getPersistenceGateway().deleteDocument({
    applicationContext,
    docketNumber: caseEntity.docketNumber,
    documentId: originalCaseDocument.documentId,
  });

  await applicationContext.getPersistenceGateway().deleteDocumentFromS3({
    applicationContext,
    key: originalCaseDocument.documentId,
  });
};

exports.updateInitialFilingDocuments = async ({
  applicationContext,
  authorizedUser,
  caseEntity,
  caseToUpdate,
}) => {
  for (const key of Object.keys(INITIAL_DOCUMENT_TYPES_MAP)) {
    const documentType = INITIAL_DOCUMENT_TYPES_MAP[key];
    const originalCaseDocument = caseEntity.documents.find(
      doc => doc.documentType === documentType,
    );
    const currentCaseDocument = caseToUpdate.documents.find(
      doc => doc.documentType === documentType,
    );

    if (originalCaseDocument && currentCaseDocument) {
      if (originalCaseDocument.documentId !== currentCaseDocument.documentId) {
        addNewInitialFilingToCase({
          applicationContext,
          authorizedUser,
          caseEntity,
          currentCaseDocument,
          documentType,
        });
        await deleteInitialFilingFromCase({
          applicationContext,
          caseEntity,
          originalCaseDocument,
        });
      }
    } else if (!originalCaseDocument && currentCaseDocument) {
      addNewInitialFilingToCase({
        applicationContext,
        authorizedUser,
        caseEntity,
        currentCaseDocument,
        documentType,
      });
    } else if (originalCaseDocument && !currentCaseDocument) {
      await deleteInitialFilingFromCase({
        applicationContext,
        caseEntity,
        originalCaseDocument,
      });
    }
  }
};
