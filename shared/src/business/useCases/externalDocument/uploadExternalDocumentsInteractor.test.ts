import { applicationContext } from '../../test/createTestApplicationContext';
import {
  mockIrsPractitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { uploadExternalDocumentsInteractor } from './uploadExternalDocumentsInteractor';

describe('uploadExternalDocumentsInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .fileExternalDocumentInteractor.mockReturnValue({});
  });

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    await expect(
      uploadExternalDocumentsInteractor(
        applicationContext,
        {
          documentFiles: {
            primary: {
              stuff: 'hi',
            },
          },
          documentMetadata: {},
          fileUploadProgressMap: {
            primary: () => {},
          },
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('runs successfully with no errors with minimum data and valid user', async () => {
    const result = await uploadExternalDocumentsInteractor(
      applicationContext,
      {
        documentFiles: {
          primary: 'something',
        },
        documentMetadata: {
          primaryDocumentFile: {},
        },
        fileUploadProgressMap: {
          primary: () => {},
        },
      },
      mockIrsPractitionerUser,
    );
    expect(result).toMatchObject({
      caseDetail: expect.anything(),
      docketEntryIdsAdded: expect.any(Array),
    });
  });

  it('runs successfully with no errors with all data and valid user', async () => {
    await expect(
      uploadExternalDocumentsInteractor(
        applicationContext,
        {
          documentFiles: {
            primary: 'something',
            primarySupporting0: 'something3',
            secondary: 'something2',
            secondarySupporting0: 'something4',
          },
          documentMetadata: {
            hasSecondarySupportingDocuments: true,
            hasSupportingDocuments: true,
            primaryDocumentFile: {},
            secondaryDocument: {},
            secondarySupportingDocuments: [{ supportingDocument: 'something' }],
            supportingDocuments: [{ supportingDocument: 'something' }],
          },
          fileUploadProgressMap: {
            primary: () => 'something',
            primarySupporting0: () => 'something3',
            secondary: () => 'something2',
            secondarySupporting0: () => 'something4',
          },
        },
        mockIrsPractitionerUser,
      ),
    ).resolves.not.toThrow();
  });

  it('runs successfully with no errors with all data and valid user who is a practitioner', async () => {
    await expect(
      uploadExternalDocumentsInteractor(
        applicationContext,
        {
          documentFiles: {
            primary: 'something',
            primarySupporting0: 'something3',
            secondary: 'something2',
            secondarySupporting0: 'something4',
          },
          documentMetadata: {
            primaryDocumentFile: {},
            secondaryDocument: {},
          },
          fileUploadProgressMap: {
            primary: 'something',
            primarySupporting0: 'something3',
            secondary: 'something2',
            secondarySupporting0: 'something4',
          },
        },
        mockIrsPractitionerUser,
      ),
    ).resolves.not.toThrow();
  });
});
