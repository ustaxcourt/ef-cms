const {
  removePetitionerFromCaseInteractor,
} = require('./removePetitionerFromCaseInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('removePetitionerFromCaseInteractor', () => {
  it('should throw an unauthorized error when the current user does not have permission to edit petitioners', async () => {
    await expect(
      removePetitionerFromCaseInteractor(applicationContext, {
        contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('');
  });
});
