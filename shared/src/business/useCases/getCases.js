const User = require('../entities/User');

exports.getCases = async ({ userId, status, applicationContext }) => {
  const user = new User({userId});

  switch (user.role) {
    case 'petitioner':
      return await applicationContext
        .getUseCases()
        .getCasesByUser({ userId, applicationContext });
    case 'irsattorney':
      return await applicationContext.getUseCases().getCasesByIRSAttorney({
        irsAttorneyId: user.barNumber,
        applicationContext,
      });
      break;
    case 'internal':
      if (status) {
        return await applicationContext
          .getUseCases()
          .getCasesByStatus({ status, userId, applicationContext });
      }
      break;
    default:
      return;
  }
};
