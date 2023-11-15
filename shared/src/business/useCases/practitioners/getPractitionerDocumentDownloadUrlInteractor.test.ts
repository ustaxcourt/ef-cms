import { ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getPractitionerDocumentDownloadUrlInteractor } from './getPractitionerDocumentDownloadUrlInteractor';

describe('getPractitionerDocumentDownloadUrlInteractor', () => {
  let testUser;
  const mockDocumentMetadata = {
    categoryName: 'Application',
    categoryType: 'Application',
    description: 'hubba bubba bubble gum',
    fileName: 'application.pdf',
    location: undefined,
    practitionerDocumentFileId: '07044afe-641b-4d75-a84f-0698870b7650',
  } as any;

  const mockPractitioner = { barNumber: 'PT1234' };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerDocumentByFileId.mockReturnValue({
        fileName: 'SomeFile.pdf',
      });
  });

  it('should throw an unauthorized error when the user does not have permission to download the practitioner documentation file', async () => {
    testUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    applicationContext.getCurrentUser.mockImplementation(() => testUser);

    await expect(
      getPractitionerDocumentDownloadUrlInteractor(applicationContext, {
        barNumber: mockPractitioner.barNumber,
        practitionerDocumentFileId:
          mockDocumentMetadata.practitionerDocumentFileId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should not throw an unauthorized error when the user has permission to download the practitioner documentation file', async () => {
    testUser = {
      role: ROLES.admissionsClerk,
      userId: 'admissionsclerk',
    };

    applicationContext.getCurrentUser.mockImplementation(() => testUser);

    const results = await getPractitionerDocumentDownloadUrlInteractor(
      applicationContext,
      {
        barNumber: mockPractitioner.barNumber,
        practitionerDocumentFileId:
          mockDocumentMetadata.practitionerDocumentFileId,
      },
    );
    expect(results).toMatchObject({
      url: expect.any(String),
    });
  });
});
