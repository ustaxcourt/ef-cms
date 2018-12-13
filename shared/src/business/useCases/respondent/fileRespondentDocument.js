const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const { getUser } = require('../utilities/getUser');
const { uploadFileToS3 } = require('../utilities/uploadFileToS3');

const attachDocumentToCase = ({
  caseToUpdate,
  documentType,
  documentId,
  userId,
}) => {
  const stipulatedDecisionDocumentMetadata = {
    documentType,
    documentId,
    userId: userId,
    createdAt: new Date().toISOString(),
  };

  Object.assign(caseToUpdate, {
    documents: [...caseToUpdate.documents, stipulatedDecisionDocumentMetadata],
  });

  return stipulatedDecisionDocumentMetadata;
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
  workItemsToAdd = [],
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

  workItemsToAdd.forEach(item => (item.documentId = documentId));

  attachWorkItemsToCase({
    caseToUpdate,
    workItemsToAdd,
  });

  attachDocumentToCase({
    userId,
    documentId,
    caseToUpdate,
    documentType,
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
