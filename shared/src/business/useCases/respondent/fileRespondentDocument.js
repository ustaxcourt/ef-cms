const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const { getUser } = require('../utilities/getUser');

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

  caseToUpdate = new Case(caseToUpdate);

  const user = await getUser(userId);

  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document,
    });

  workItemsToAdd.forEach(
    item =>
      (item.document = {
        documentId,
        documentType,
      }),
  );

  caseToUpdate.attachWorkItems({
    workItemsToAdd,
  });

  caseToUpdate.attachDocument({
    userId,
    documentId,
    documentType,
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
    caseToUpdate: caseToUpdateRaw,
    applicationContext,
  });

  return caseToUpdateRaw;
};
