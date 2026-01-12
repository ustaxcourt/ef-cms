import '@web-api/persistence/postgres/practitionerDocuments/mocks.jest';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPractitionerDocumentDownloadUrlInteractor } from './getPractitionerDocumentDownloadUrlInteractor';
import {
  mockAdmissionsClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getPractitionerDocumentByFileId as getPractitionerDocumentByFileIdMock } from '@web-api/persistence/postgres/practitionerDocuments/getPractitionerDocumentByFileId';
import { RawPractitionerDocument } from '@shared/business/entities/PractitionerDocument';

describe('getPractitionerDocumentDownloadUrlInteractor', () => {
  const mockDocumentMetadata = {
    categoryName: 'Application',
    categoryType: 'Application',
    description: 'hubba bubba bubble gum',
    fileName: 'application.pdf',
    location: undefined,
    practitionerDocumentFileId: '07044afe-641b-4d75-a84f-0698870b7650',
  } as any;

  const mockPractitioner = { barNumber: 'PT1234' };

  const getPractitionerDocumentByFileId = jest.mocked(
    getPractitionerDocumentByFileIdMock,
  );

  beforeAll(() => {
    getPractitionerDocumentByFileId.mockResolvedValue({
      fileName: 'SomeFile.pdf',
    } as RawPractitionerDocument);
  });

  it('should throw an unauthorized error when the user does not have permission to download the practitioner documentation file', async () => {
    await expect(
      getPractitionerDocumentDownloadUrlInteractor(
        applicationContext,
        {
          barNumber: mockPractitioner.barNumber,
          practitionerDocumentFileId:
            mockDocumentMetadata.practitionerDocumentFileId,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should not throw an unauthorized error when the user has permission to download the practitioner documentation file', async () => {
    const results = await getPractitionerDocumentDownloadUrlInteractor(
      applicationContext,
      {
        barNumber: mockPractitioner.barNumber,
        practitionerDocumentFileId:
          mockDocumentMetadata.practitionerDocumentFileId,
      },
      mockAdmissionsClerkUser,
    );
    expect(results).toMatchObject({
      url: expect.any(String),
    });
  });
});
