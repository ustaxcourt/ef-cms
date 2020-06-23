const createApplicationContext = require('../../../src/applicationContext');

exports.handler = async event => {
  const applicationContext = createApplicationContext();

  const { email, name, sub: userId } = event.request.userAttributes;

  await applicationContext.getUseCases().createPetitionerAccountInteractor({
    applicationContext,
    email,
    name,
    userId,
  });

  return event;
};
