import {
  PRACTITIONER_DOCUMENT_TYPES_MAP,
  ROLES,
} from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getPractitionerDocumentInteractor } from './getPractitionerDocumentInteractor';

describe('getPractitionerDocumentInteractor', () => {
  const testUser = {
    role: ROLES.admissionsClerk,
    userId: 'admissionsclerk',
  };
  const barNumber = 'PT4785';
  const practitionerDocumentFileId = '14c373ff-3335-400d-8b39-3e4053072512';
  const practitionerDocument = {
    categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
    categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
    fileName: 'testPdf.pdf',
  };

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(testUser);
    applicationContext
      .getPersistenceGateway()
      .getPractitionerDocumentByFileId.mockReturnValue(practitionerDocument);
  });

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
    const testPetitionerUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };
    applicationContext.getCurrentUser.mockReturnValueOnce(testPetitionerUser);

    await expect(
      getPractitionerDocumentInteractor(applicationContext, {
        barNumber,
        practitionerDocumentFileId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should retrieve the practitioner document from persistence', async () => {
    const results = await getPractitionerDocumentInteractor(
      applicationContext,
      {
        barNumber,
        practitionerDocumentFileId,
      },
    );

    expect(
      applicationContext.getPersistenceGateway().getPractitionerDocumentByFileId
        .mock.calls[0][0],
    ).toMatchObject({ barNumber, fileId: practitionerDocumentFileId });
    expect(results).toMatchObject(practitionerDocument);
  });
});
