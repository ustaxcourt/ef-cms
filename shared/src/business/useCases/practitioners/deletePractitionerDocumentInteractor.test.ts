import { ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { deletePractitionerDocumentInteractor } from './deletePractitionerDocumentInteractor';

describe('deletePractitionerDocumentInteractor', () => {
  const testUser = {
    role: ROLES.admissionsClerk,
    userId: 'admissionsclerk',
  };
  const practitionerDocumentFileId = '3da3e303-5da9-4b8b-99a5-d4b65c449619';
  const barNumber = 'PT76543';

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(testUser);
  });

  it('should throw an unauthorized error when the user does not have permission to update practitioner documents', async () => {
    const testPetitionerUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };
    applicationContext.getCurrentUser.mockReturnValueOnce(testPetitionerUser);

    await expect(
      deletePractitionerDocumentInteractor(applicationContext, {
        barNumber,
        practitionerDocumentFileId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should delete the practitioner document from persistence', async () => {
    await deletePractitionerDocumentInteractor(applicationContext, {
      barNumber,
      practitionerDocumentFileId,
    });
    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFile.mock
        .calls[0][0],
    ).toMatchObject({
      key: practitionerDocumentFileId,
    });
  });

  it('should delete the practitioner document from the DB', async () => {
    await deletePractitionerDocumentInteractor(applicationContext, {
      barNumber,
      practitionerDocumentFileId,
    });
    expect(
      applicationContext.getPersistenceGateway().deletePractitionerDocument.mock
        .calls[0][0],
    ).toMatchObject({ barNumber, practitionerDocumentFileId });
  });
});
