const {
  appendAmendedPetitionFormInteractor,
} = require('./appendAmendedPetitionFormInteractor');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { ROLES } = require('../../entities/EntityConstants');

describe('appendAmendedPetitionFormInteractor', () => {
  it('should throw an error when the user is not authorized to modify docket entries', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '432',
    });

    await expect(
      appendAmendedPetitionFormInteractor(applicationContext, {}),
    ).rejects.toThrow('Unauthorized');
  });

  //
  it('should use the provided docketEntryId to retrieve the file from s3', async () => {});
});
