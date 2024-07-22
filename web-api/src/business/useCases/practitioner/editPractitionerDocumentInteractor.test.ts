import { InvalidEntityError, UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { editPractitionerDocumentInteractor } from './editPractitionerDocumentInteractor';
import {
  mockAdmissionsClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('editPractitionerDocumentInteractor', () => {
  const barNumber = 'PT4785';
  const mockDocumentMetadata = {
    categoryName: 'Application',
    categoryType: 'Application',
    description: 'bird is the word',
    fileName: 'testFile.pdf',
    location: undefined,
    practitionerDocumentFileId: 'ad69486a-2489-4eb1-bee6-bdb6cc0257b4',
  } as any;

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
    await expect(
      editPractitionerDocumentInteractor(
        applicationContext,
        {
          barNumber,
          documentMetadata: mockDocumentMetadata,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a validation error if the practitioner document has the wrong type', async () => {
    await expect(
      editPractitionerDocumentInteractor(
        applicationContext,
        {
          barNumber,
          documentMetadata: { ...mockDocumentMetadata, categoryType: 'GG' },
        },
        mockAdmissionsClerkUser,
      ),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should throw a validation error if the practitioner document is missing information', async () => {
    await expect(
      editPractitionerDocumentInteractor(
        applicationContext,
        {
          barNumber,
          documentMetadata: { ...mockDocumentMetadata, fileName: undefined },
        },
        mockAdmissionsClerkUser,
      ),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should update a practitioner document', async () => {
    const results = await editPractitionerDocumentInteractor(
      applicationContext,
      {
        barNumber,
        documentMetadata: mockDocumentMetadata,
      },
      mockAdmissionsClerkUser,
    );
    expect(results).toMatchObject({ ...mockDocumentMetadata });
  });
});
