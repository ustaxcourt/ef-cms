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
    filedBy: user.role,
  });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      caseId,
      applicationContext,
    });

  const caseEntity = new Case(caseToUpdate);

  const workItem = new WorkItem({
    sentBy: user.userId,
    caseId: caseId,
    document: {
      ...documentEntity.toRawObject(),
      createdAt: documentEntity.createdAt,
    },
    caseStatus: caseToUpdate.status,
    assigneeId: null,
    docketNumber: caseToUpdate.docketNumber,
    docketNumberSuffix: caseToUpdate.docketNumberSuffix,
    section: DOCKET_SECTION,
    assigneeName: null,
  });

  const message = new Message({
    message: `A ${document.documentType} filed by ${capitalize(
      user.role,
    )} is ready for review.`,
    sentBy: user.name,
    userId: user.userId,
    createdAt: new Date().toISOString(),
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
    caseToSave: caseEntity.validate().toRawObject(),
    applicationContext,
  });
};
