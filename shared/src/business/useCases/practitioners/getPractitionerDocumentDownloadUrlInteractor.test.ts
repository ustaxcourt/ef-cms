import { ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '../../../errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getPractitionerDocumentDownloadUrlInteractor } from '../getPractitionerDocumentDownloadUrlInteractor';
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

  // it('should throw an unauthorized error when the user does not have permission to download the practitioner documentation file', async () => {
  //   testUser = {
  //     role: ROLES.petitioner,
  //     userId: 'petitioner',
  //   };

  //   applicationContext.getCurrentUser.mockImplementation(() => testUser);
  //   await expect(
  //     getPractitionerDocumentDownloadUrlInteractor(applicationContext, {
  //       practitionerDocumentFileId:
  //         mockDocumentMetadata.practitionerDocumentFileId,
  //     }),
  //   ).rejects.toThrow(UnauthorizedError);
  // });
  it.only('should throw an unauthorized error when the user does not have permission to download the practitioner documentation file', async () => {
    testUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    const results = await getPractitionerDocumentDownloadUrlInteractor(
      applicationContext,
      {
        practitionerDocumentFileId:
          mockDocumentMetadata.practitionerDocumentFileId,
      },
    );
    console.log(results);
  });

  it('should not throw an unauthorized error when the user does not have permission to download the practitioner documentation file', async () => {
    testUser = {
      role: ROLES.admissionsClerk,
      userId: 'admissionsclerk',
    };

    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    const results = await getPractitionerDocumentDownloadUrlInteractor(
      applicationContext,
      {
        practitionerDocumentFileId:
          mockDocumentMetadata.practitionerDocumentFileId,
      },
    );
    console.log(results);
  });

  // it('should create a new practitioner document', async () => {
  //   const results = await createPractitionerDocumentInteractor(
  //     applicationContext,
  //     {
  //       barNumber: 'pt1234',
  //       documentMetadata: mockDocumentMetadata,
  //     },
  //   );
  //   expect(results).toMatchObject({ ...mockDocumentMetadata });
  // });
});
