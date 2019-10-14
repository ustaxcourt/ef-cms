const {
  completeDocketEntryQCInteractor,
} = require('./completeDocketEntryQCInteractor');

describe('completeDocketEntryQCInteractor', () => {
  let applicationContext;

  it('should throw an error if not authorized', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Olivia Jade',
            role: 'seniorattorney',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getPersistenceGateway: () => ({}),
      };
      await completeDocketEntryQCInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });
});
