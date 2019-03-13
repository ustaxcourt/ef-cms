const Case = require('../entities/Case');
const WorkItem = require('../entities/WorkItem');
const Message = require('../entities/Message');
const Document = require('../entities/Document');
const { DOCKET_SECTION } = require('../entities/WorkQueue');
const { capitalize } = require('lodash');

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
    createdAt: new Date().toISOString(),
    message: `A ${document.documentType} filed by ${capitalize(
      user.role,
    )} is ready for review.`,
    sentBy: user.name,
    userId: user.userId,
  });

  workItem.addMessage(message);
  documentEntity.addWorkItem(workItem);
  caseEntity.addDocument(documentEntity);

  if (user.role === 'respondent') {
    caseEntity.attachRespondent({
      user,
    });
  }

  await applicationContext.getPersistenceGateway().saveCase({
    applicationContext,
    caseToSave: caseEntity.validate().toRawObject(),
  });
};
