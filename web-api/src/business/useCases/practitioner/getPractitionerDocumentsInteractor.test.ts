import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPractitionerDocumentsInteractor } from './getPractitionerDocumentsInteractor';

describe('getPractitionersDocumentsInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'admissionsClerk',
    });
  });

  it('throws an unauthorized error exception when user is not an admissions clerk', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      getPractitionerDocumentsInteractor(applicationContext, {
        barNumber: 'PT1234',
      }),
    ).rejects.toThrow('Unauthorized for getting practitioner documents');
  });

  it('returns and validates the documents returned from persistence', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
      userId: 'bob',
    });

    applicationContext
      .getPersistenceGateway()
      .getPractitionerDocuments.mockResolvedValue([
        {
          categoryName: 'Application',
          categoryType: 'Application',
          description: 'this is a test',
          fileName: 'my-file.pdf',
          practitionerDocumentFileId: '8190d648-e643-4964-988e-141e4e0db861',
          uploadDate: '2019-08-25T05:00:00.000Z',
        },
      ]);

    const documents = await getPractitionerDocumentsInteractor(
      applicationContext,
      {
        barNumber: 'PT1234',
      },
    );

    expect(documents.length).toEqual(1);
  });
});
