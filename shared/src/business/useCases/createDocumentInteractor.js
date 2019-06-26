const { capitalize } = require('lodash');
const { Case } = require('../entities/cases/Case');
const { DOCKET_SECTION } = require('../entities/WorkQueue');
const { Document } = require('../entities/Document');
const { Message } = require('../entities/Message');
const { WorkItem } = require('../entities/WorkItem');

exports.createDocument = async ({ applicationContext, caseId, document }) => {
  const user = applicationContext.getCurrentUser();

  const documentEntity = new Document({
    userId: user.userId,
    ...document,
    filedBy: user.name,
  });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate);

  const workItem = new WorkItem({
    assigneeId: null,
    assigneeName: null,
    caseId: caseId,
    caseStatus: caseToUpdate.status,
    docketNumber: caseToUpdate.docketNumber,
    docketNumberSuffix: caseToUpdate.docketNumberSuffix,
    document: {
      ...documentEntity.toRawObject(),
      createdAt: documentEntity.createdAt,
    },
    section: DOCKET_SECTION,
    sentBy: user.userId,
  });

  const message = new Message({
    from: user.name,
    fromUserId: user.userId,
    message: `${document.documentType} filed by ${capitalize(
      user.role,
    )} is ready for review.`,
  });

  workItem.addMessage(message);
  documentEntity.addWorkItem(workItem);
  caseEntity.addDocument(documentEntity);

  if (user.role === 'respondent') {
    caseEntity.attachRespondent({
      user,
    });
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
    applicationContext,
    workItem: workItem.validate().toRawObject(),
  });
};
