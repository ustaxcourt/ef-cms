const {
  isAuthorized,
  FILE_GENERIC_DOCUMENT,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const Message = require('../../entities/Message');
const WorkItem = require('../../entities/WorkItem');
const Document = require('../../entities/Document');
const User = require('../../entities/User');

exports.fileGenericDocument = async ({
  userId,
  caseToUpdate,
  documentType,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_GENERIC_DOCUMENT)) {
    throw new UnauthorizedError(`Unauthorized to upload a ${documentType}`);
  }

  const user = new User({ userId });

  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document,
    });

  const caseEntity = new Case(caseToUpdate);
  const documentEntity = new Document({
    userId,
    documentId,
    filedBy: user.name,
    documentType,
  });

  const workItem = new WorkItem({
    sentBy: userId,
    caseId: caseToUpdate.caseId,
    document: {
      documentId: documentEntity.documentId,
      documentType: documentEntity.documentType,
      createdAt: documentEntity.createdAt,
    },
    assigneeId: null,
    docketNumber: caseToUpdate.docketNumber,
    section: 'docket',
    assigneeName: null,
  });
  delete workItem.createdAt; // persistence layer won't save the workItem unless createdAt is null.... this is bad design
  const message = new Message({
    message: `a ${documentType} filed by ${user.role} is ready for review`,
    sentBy: user.name,
    userId,
    createdAt: new Date().toISOString(),
  });
  workItem.addMessage(message);
  delete documentEntity.createdAt; // persistence layer won't save the document unless createdAt is null.... this is bad design
  documentEntity.addWorkItem(workItem);
  caseEntity.addDocument(documentEntity);

  await applicationContext.getUseCases().associateDocumentToCase({
    userId,
    caseToUpdate: caseEntity.validate().toJSON(),
    applicationContext,
  });
};
