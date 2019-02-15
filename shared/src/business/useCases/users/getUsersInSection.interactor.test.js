const { getUsersInSection } = require('./getUsersInSection.interactor');

describe('getUsersInSection', () => {
  beforeEach(() => {});

  it('should not allow users without GET_USERS_IN_SECTION permission to access the use case', async () => {
    let error;
    try {
      await getUsersInSection({
        section: 'docket',
        applicationContext: {
          getCurrentUser: () => ({
            role: 'petitioner',
          }),
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
