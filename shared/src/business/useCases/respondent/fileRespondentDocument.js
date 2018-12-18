const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const WorkItem = require('../../entities/WorkItem');
const { getUser } = require('../utilities/getUser');

exports.fileRespondentDocument = async ({
  userId,
  caseToUpdate,
  applicationContext,
}) => {
  //find the new document - documentType will be undefined
  const documents = (caseToUpdate.documents || []).filter(
    document => document.createdAt === undefined,
  );

  //remove the empty document from the caseToUpdate
  caseToUpdate.documents = (caseToUpdate.documents || []).filter(
    document => document.createdAt !== undefined,
  );

  //find the new workItems - workItemId will be undefined
  const workItems = (caseToUpdate.workItems || []).filter(
    workItem => workItem.workItemId === undefined,
  );

  //remove the empty workItem from the caseToUpdate
  caseToUpdate.workItems = (caseToUpdate.workItems || []).filter(
    workItem => workItem.workItemId !== undefined,
  );

  //validate the pdf
  if (!documents.length || documents.length > 1) {
    throw new UnprocessableEntityError(
      `document cannot be null or invalid or more than one`,
    );
  }

  const { documentId, documentType } = documents[0];

  caseToUpdate = new Case(caseToUpdate);

  const documentMetadata = caseToUpdate.attachDocument({
    userId,
    documentId,
    documentType,
  });

  const user = await getUser(userId);

  const workItemsToAdd = workItems.map(
    item =>
      new WorkItem({
        ...item,
        document: documentMetadata,
      }),
  );

  WorkItem.validateCollection(workItemsToAdd);

  caseToUpdate.attachWorkItems({
    workItemsToAdd: workItemsToAdd.map(item => item.toJSON()),
  });

  if (!caseToUpdate.respondent) {
    caseToUpdate.attachRespondent({
      user,
    });
  }

  const caseToUpdateRaw = caseToUpdate
    .validateWithError(new UnprocessableEntityError())
    .toJSON();

  await applicationContext.getPersistenceGateway().saveCase({
    userId: user.userId,
    caseToSave: caseToUpdateRaw,
    applicationContext,
  });

  return caseToUpdateRaw;
};
