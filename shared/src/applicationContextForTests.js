const sharedAppContext = require('./sharedAppContext');

module.exports = {
  ...sharedAppContext,
  getCurrentUser: jest.fn(),
  getUniqueId: jest.fn().mockImplementation(sharedAppContext.getUniqueId),
  getUseCases: () => ({
    /* todo */
  }),
};
