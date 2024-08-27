import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPractitionerDocumentInteractor } from './getPractitionerDocumentInteractor';
import {
  mockAdmissionsClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getPractitionerDocumentInteractor', () => {
  const barNumber = 'PT4785';
  const practitionerDocumentFileId = '14c373ff-3335-400d-8b39-3e4053072512';
  const practitionerDocument = {
    categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
    categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
    fileName: 'testPdf.pdf',
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerDocumentByFileId.mockReturnValue(practitionerDocument);
  });

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
    await expect(
      getPractitionerDocumentInteractor(
        applicationContext,
        {
          barNumber,
          practitionerDocumentFileId,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should retrieve the practitioner document from persistence', async () => {
    const results = await getPractitionerDocumentInteractor(
      applicationContext,
      {
        barNumber,
        practitionerDocumentFileId,
      },
      mockAdmissionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getPractitionerDocumentByFileId
        .mock.calls[0][0],
    ).toMatchObject({ barNumber, fileId: practitionerDocumentFileId });
    expect(results).toMatchObject(practitionerDocument);
  });
});
