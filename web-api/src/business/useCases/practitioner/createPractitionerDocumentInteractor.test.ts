import { InvalidEntityError, UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createPractitionerDocumentInteractor } from './createPractitionerDocumentInteractor';
import {
  mockAdmissionsClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
jest.mock('@web-api/business/useCases/user/generateChangeOfAddress');

describe('updatePractitionerUserInteractor', () => {
  const mockDocumentMetadata = {
    categoryName: 'Application',
    categoryType: 'Application',
    description: 'hubba bubba bubble gum',
    fileName: 'application.pdf',
    location: undefined,
    practitionerDocumentFileId: '07044afe-641b-4d75-a84f-0698870b7650',
  } as any;

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
    await expect(
      createPractitionerDocumentInteractor(
        applicationContext,
        {
          barNumber: 'pt1234',
          documentMetadata: mockDocumentMetadata,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a validation error if the practitioner document has the wrong type', async () => {
    await expect(
      createPractitionerDocumentInteractor(
        applicationContext,
        {
          barNumber: 'pt1234',
          documentMetadata: { ...mockDocumentMetadata, categoryType: 'GG' },
        },
        mockAdmissionsClerkUser,
      ),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should create a new practitioner document', async () => {
    const results = await createPractitionerDocumentInteractor(
      applicationContext,
      {
        barNumber: 'pt1234',
        documentMetadata: mockDocumentMetadata,
      },
      mockAdmissionsClerkUser,
    );
    expect(results).toMatchObject({ ...mockDocumentMetadata });
  });
});
