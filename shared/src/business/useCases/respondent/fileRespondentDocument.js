const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const WorkItem = require('../../entities/WorkItem');
const { getUser } = require('../utilities/getUser');
const { uploadFileToS3 } = require('../utilities/uploadFileToS3');

const attachDocumentToCase = ({
  caseToUpdate,
  documentType,
  documentId,
  userId,
}) => {
  const documentMetadata = {
    documentType,
    documentId,
    userId: userId,
    filedBy: 'Respondent',
    createdAt: new Date().toISOString(),
  };

  Object.assign(caseToUpdate, {
    documents: [...caseToUpdate.documents, documentMetadata],
  });

  return documentMetadata;
};

const attachRespondentToCase = ({ user, caseToUpdate }) => {
  const respondent = {
    ...user,
    respondentId: user.userId,
  };

  Object.assign(caseToUpdate, { respondent });
};

const attachWorkItemsToCase = ({ workItemsToAdd, caseToUpdate }) => {
  Object.assign(caseToUpdate, {
    workItems: [...(caseToUpdate.workItems || []), ...workItemsToAdd],
  });
};

exports.fileRespondentDocument = async ({
  userId,
  caseToUpdate,
  document,
  documentType,
  rawWorkItemsToAdd = [],
  applicationContext,
}) => {
  //validate the pdf
  if (!document) {
    throw new UnprocessableEntityError(
      `${documentType} document cannot be null or invalid`,
    );
  }

  const user = await getUser({
    token: userId,
  });

  const documentId = await uploadFileToS3({
    applicationContext,
    document,
  });

  const documentMetadata = attachDocumentToCase({
    userId,
    documentId,
    caseToUpdate,
    documentType,
  });

  const workItemsToAdd = rawWorkItemsToAdd.map(
    item =>
      new WorkItem({
        ...item,
        document: documentMetadata,
      }),
  );
  WorkItem.validateCollection(workItemsToAdd);

  attachWorkItemsToCase({
    caseToUpdate,
    workItemsToAdd: workItemsToAdd.map(item => item.toJSON()),
  });

  if (!caseToUpdate.respondent) {
    attachRespondentToCase({
      user,
      caseToUpdate,
    });
  }

  const caseToUpdateRaw = new Case(caseToUpdate)
    .validateWithError(new UnprocessableEntityError())
    .toJSON();

  await applicationContext.getPersistenceGateway().saveCase({
    userId: user.userId,
    caseToUpdate: caseToUpdateRaw,
    applicationContext,
  });

  return caseToUpdate;
};
