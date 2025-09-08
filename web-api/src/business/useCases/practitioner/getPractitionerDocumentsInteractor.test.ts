import '@web-api/persistence/postgres/practitionerDocuments/mocks.jest';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPractitionerDocumentsInteractor } from './getPractitionerDocumentsInteractor';
import {
  mockAdmissionsClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getPractitionerDocuments as getPractitionerDocumentsMock } from '@web-api/persistence/postgres/practitionerDocuments/getPractitionerDocuments';
import { RawPractitionerDocument } from '@shared/business/entities/PractitionerDocument';

describe('getPractitionersDocumentsInteractor', () => {
  const getPractitionerDocuments = jest.mocked(getPractitionerDocumentsMock);
  it('throws an unauthorized error exception when user is not an admissions clerk', async () => {
    await expect(
      getPractitionerDocumentsInteractor(
        applicationContext,
        {
          barNumber: 'PT1234',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized for getting practitioner documents');
  });

  it('returns and validates the documents returned from persistence', async () => {
    getPractitionerDocuments.mockResolvedValue([
      {
        categoryName: 'Application',
        categoryType: 'Application',
        description: 'this is a test',
        fileName: 'my-file.pdf',
        practitionerDocumentFileId: '8190d648-e643-4964-988e-141e4e0db861',
        uploadDate: '2019-08-25T05:00:00.000Z',
      } as RawPractitionerDocument,
    ]);

    const documents = await getPractitionerDocumentsInteractor(
      applicationContext,
      {
        barNumber: 'PT1234',
      },
      mockAdmissionsClerkUser,
    );

    expect(documents.length).toEqual(1);
  });
});
