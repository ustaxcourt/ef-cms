import { InvalidEntityError, UnauthorizedError } from '@web-api/errors/errors';
import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { createPractitionerDocumentInteractor } from './createPractitionerDocumentInteractor';
jest.mock('../users/generateChangeOfAddress');

describe('updatePractitionerUserInteractor', () => {
  let testUser;
  const mockDocumentMetadata = {
    categoryName: 'Application',
    categoryType: 'Application',
    description: 'hubba bubba bubble gum',
    fileName: 'application.pdf',
    location: undefined,
    practitionerDocumentFileId: '07044afe-641b-4d75-a84f-0698870b7650',
  } as any;

  beforeEach(() => {
    testUser = {
      role: ROLES.admissionsClerk,
      userId: 'admissionsclerk',
    };

    applicationContext.getCurrentUser.mockImplementation(() => testUser);
  });

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
    testUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      createPractitionerDocumentInteractor(applicationContext, {
        barNumber: 'pt1234',
        documentMetadata: mockDocumentMetadata,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a validation error if the practitioner document has the wrong type', async () => {
    await expect(
      createPractitionerDocumentInteractor(applicationContext, {
        barNumber: 'pt1234',
        documentMetadata: { ...mockDocumentMetadata, categoryType: 'GG' },
      }),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should create a new practitioner document', async () => {
    const results = await createPractitionerDocumentInteractor(
      applicationContext,
      {
        barNumber: 'pt1234',
        documentMetadata: mockDocumentMetadata,
      },
    );
    expect(results).toMatchObject({ ...mockDocumentMetadata });
  });
});
