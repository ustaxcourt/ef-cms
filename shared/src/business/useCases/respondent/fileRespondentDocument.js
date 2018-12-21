const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
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

  //validate the pdf
  if (!documents.length || documents.length > 1) {
    throw new UnprocessableEntityError(
      `document cannot be null or invalid or more than one`,
    );
  }

  caseToUpdate = new Case(caseToUpdate);

  const user = await getUser(userId);

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
