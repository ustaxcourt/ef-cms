const {
  orderAdvancedSearchInteractor,
} = require('./orderAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('orderAdvancedSearchInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'petitionsclerk',
    });
  });

  it('returns an unauthorized error on petitioner user role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});
    await expect(
      orderAdvancedSearchInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns empty array if no search params are passed in', async () => {
    const results = await orderAdvancedSearchInteractor({
      applicationContext,
    });

    expect(results).toEqual([]);
  });
});
