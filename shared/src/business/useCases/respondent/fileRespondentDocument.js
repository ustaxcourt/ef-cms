const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
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
  workItemsToAdd = [],
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

  console.log('documents', documents);
  console.log('caseToUpdate.documents ', caseToUpdate.documents);

  //validate the pdf
  if (!documents.length || documents.length > 1) {
    throw new UnprocessableEntityError(
      `${documentType} document cannot be null or invalid or more than one`,
    );
  }
  const documentId = documents[0].documentId;

  attachDocumentToCase({
    userId,
    documentId,
    caseToUpdate,
    documentType,
  });

  console.log(caseToUpdate.documents);

  const user = await getUser({
    token: userId,
  });

  workItemsToAdd.forEach(
    item =>
      (item.document = {
        documentId,
        documentType,
      }),
  );

  attachWorkItemsToCase({
    caseToUpdate,
    workItemsToAdd,
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
