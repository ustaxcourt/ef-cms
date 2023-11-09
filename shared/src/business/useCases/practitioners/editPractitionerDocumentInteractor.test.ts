import { InvalidEntityError, UnauthorizedError } from '@web-api/errors/errors';
import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { editPractitionerDocumentInteractor } from './editPractitionerDocumentInteractor';

describe('editPractitionerDocumentInteractor', () => {
  const testUser = {
    role: ROLES.admissionsClerk,
    userId: 'admissionsclerk',
  };
  const barNumber = 'PT4785';
  const mockDocumentMetadata = {
    categoryName: 'Application',
    categoryType: 'Application',
    description: 'bird is the word',
    fileName: 'testFile.pdf',
    location: undefined,
    practitionerDocumentFileId: 'ad69486a-2489-4eb1-bee6-bdb6cc0257b4',
  } as any;

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(testUser);
  });

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
    const testPetitionerUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };
    applicationContext.getCurrentUser.mockReturnValueOnce(testPetitionerUser);

    await expect(
      editPractitionerDocumentInteractor(applicationContext, {
        barNumber,
        documentMetadata: mockDocumentMetadata,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a validation error if the practitioner document has the wrong type', async () => {
    await expect(
      editPractitionerDocumentInteractor(applicationContext, {
        barNumber,
        documentMetadata: { ...mockDocumentMetadata, categoryType: 'GG' },
      }),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should throw a validation error if the practitioner document is missing information', async () => {
    await expect(
      editPractitionerDocumentInteractor(applicationContext, {
        barNumber,
        documentMetadata: { ...mockDocumentMetadata, fileName: undefined },
      }),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should update a practitioner document', async () => {
    const results = await editPractitionerDocumentInteractor(
      applicationContext,
      {
        barNumber,
        documentMetadata: mockDocumentMetadata,
      },
    );
    expect(results).toMatchObject({ ...mockDocumentMetadata });
  });
});
