const { UnprocessableEntityError } = require('../../../errors/errors');
const Case = require('../../entities/Case');
const { getUser } = require('../utilities/getUser');

exports.fileRespondentDocument = async ({
  userId,
  caseToUpdate,
  applicationContext,
}) => {
  caseToUpdate = new Case(caseToUpdate);

  const user = await getUser(userId);

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
