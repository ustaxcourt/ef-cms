const User = require('../entities/User');
const { UnauthorizedError } = require('../../errors/errors');
const Case = require('../entities/Case');

exports.getCases = async ({ userId, status, applicationContext }) => {
  let user;
  try {
    user = new User({ userId });
  } catch (err) {
    throw new UnauthorizedError('Unauthorized');
  }
  let cases;
  switch (user.role) {
    case 'taxpayer':
      cases = await applicationContext
        .getUseCases()
        .getCasesByUser({ userId, applicationContext });
      break;
    case 'respondent':
      cases = await applicationContext.getUseCases().getCasesForRespondent({
        respondentId: user.barNumber,
        applicationContext,
      });
      break;
    case 'petitionsclerk':
    case 'intakeclerk':
      if (!status) status = 'new';
      cases = await applicationContext
        .getUseCases()
        .getCasesByStatus({ status, userId, applicationContext });
      break;
    default:
      return;
  }
  return Case.validateRawCollection(cases);
};
