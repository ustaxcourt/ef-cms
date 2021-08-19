const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateUserCaseMapping } = require('./updateUserCaseMapping');

describe('updateUserCaseMapping', () => {
  it('should update the user case mapping', async () => {
    const mockUserCaseItem = {
      docketNumber: '123-20',
    };

    const result = await updateUserCaseMapping({
      applicationContext,
      userCaseItem: mockUserCaseItem,
    });

    expect(result).toEqual({
      ...mockUserCaseItem,
      gsi1pk: 'user-case|123-20',
    });
  });
});
