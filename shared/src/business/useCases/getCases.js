const User = require('../entities/User');
const { UnauthorizedError } = require('../../errors/errors');

exports.getCases = async ({ userId, status, applicationContext }) => {
  let user;
  try {
    user = new User({ userId });
  } catch (err) {
    throw new UnauthorizedError('Unauthorized');
  }

  switch (user.role) {
    case 'taxpayer':
      return await applicationContext
        .getUseCases()
        .getCasesByUser({ userId, applicationContext });
    case 'irsattorney':
      return await applicationContext.getUseCases().getCasesForRespondent({
        irsAttorneyId: user.barNumber,
        applicationContext,
      });
    case 'petitionsclerk':
    case 'intakeclerk':
      if (!status) status = 'new';
      return await applicationContext
        .getUseCases()
        .getCasesByStatus({ status, userId, applicationContext });
    default:
      return;
  }
};
