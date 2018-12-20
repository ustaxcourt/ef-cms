const {
  isAuthorized,
  FILE_STIPULATED_DECISION,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const Message = require('../../entities/Message');
const WorkItem = require('../../entities/WorkItem');
const Document = require('../../entities/Document');
const User = require('../../entities/User');

exports.fileStipulatedDecision = async ({
  userId,
  caseToUpdate,
  document,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_STIPULATED_DECISION)) {
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
    documentType: Case.documentTypes.stipulatedDecision,
  });

  const workItem = new WorkItem({
    sentBy: userId,
    caseId: caseToUpdate.caseId,
    document: {
      documentId: documentEntity.documentId,
      documentType: documentEntity.documentType,
      createdAt: documentEntity.createdAt,
    },
    assigneeId: 'docketclerk',
    docketNumber: caseToUpdate.docketNumber,
    assigneeName: 'Docket Clerk',
    caseTitle: `${
      caseToUpdate.petitioners[0].name
    } v. Commissioner of Internal Revenue, Respondent`,
    caseStatus: caseToUpdate.status,
  });
  delete workItem.createdAt; // persistence layer won't save the workItem unless createdAt is null.... this is bad design
  const message = new Message({
    message: `Stipulated Decision submitted`,
    sentBy: 'Respondent',
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
