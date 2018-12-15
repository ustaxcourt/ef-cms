const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const WorkItem = require('../../entities/WorkItem');
const { getUser } = require('../utilities/getUser');
// const { uploadFileToS3 } = require('../utilities/uploadFileToS3');

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
  documentType,
  rawWorkItemsToAdd = [],
  applicationContext,
}) => {
  //find the new document - documentType will be undefined
  const documents = caseToUpdate.documents.filter(
    document => document.documentType === undefined,
  );

  //remove the empty document from the caseToUpdate
  caseToUpdate.documents = caseToUpdate.documents.filter(
    document => document.documentType !== undefined,
  );

  //validate the pdf
  if (!documents.length || documents.length > 1) {
    throw new UnprocessableEntityError(
      `${documentType} document cannot be null or invalid or more than one`,
    );
  }
  const documentId = documents[0].documentId;

  const documentMetadata = attachDocumentToCase({
    userId,
    documentId,
    caseToUpdate,
    documentType,
  });

  const user = await getUser({
    token: userId,
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
    caseToSave: caseToUpdateRaw,
    applicationContext,
  });

  return caseToUpdate;
};
