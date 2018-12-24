const Case = require('../../entities/Case');
const Message = require('../../entities/Message');
const WorkItem = require('../../entities/WorkItem');
const Document = require('../../entities/Document');
const User = require('../../entities/User');

const {
  isAuthorized,
  FILE_ANSWER,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.fileAnswer = async ({
  userId,
  caseToUpdate,
  document,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_ANSWER)) {
    throw new UnauthorizedError('Unauthorized to upload a stipulated decision');
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
    documentType: Case.documentTypes.answer,
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
    message: `a ${Case.documentTypes.answer} filed by ${
      user.role
    } is ready for review`,
    sentBy: user.name,
    userId,
    createdAt: new Date().toISOString(),
  });
  workItem.addMessage(message);
  delete documentEntity.createdAt; // persistence layer won't save the document unless createdAt is null.... this is bad design
  documentEntity.addWorkItem(workItem);
  caseEntity.addDocument(documentEntity);

  await applicationContext.getUseCases().associateRespondentDocumentToCase({
    userId,
    caseToUpdate: caseEntity.validate().toJSON(),
    applicationContext,
  });
};
