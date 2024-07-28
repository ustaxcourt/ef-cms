import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { uploadExternalDocumentsInteractor } from './uploadExternalDocumentsInteractor';

describe('uploadExternalDocumentsInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .fileExternalDocumentInteractor.mockReturnValue({});
  });

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });

    await expect(
      uploadExternalDocumentsInteractor(applicationContext, {
        documentFiles: {
          primary: {
            stuff: 'hi',
          },
        },
        documentMetadata: {},
        fileUploadProgressMap: {
          primary: {
            file: undefined,
            uploadProgress: () => {},
          },
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('runs successfully with no errors with minimum data and valid user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: 'irsPractitioner',
    });

    const result = await uploadExternalDocumentsInteractor(applicationContext, {
      documentFiles: {
        primary: 'something',
      },
      documentMetadata: {
        primaryDocumentFile: {},
      },
      fileUploadProgressMap: {
        primary: {
          file: undefined,
          uploadProgress: () => {},
        },
      },
    });
    expect(result).toMatchObject({
      caseDetail: expect.anything(),
      docketEntryIdsAdded: expect.any(Array),
    });
  });

  it('runs successfully with no errors with all data and valid user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: 'irsPractitioner',
    });

    await expect(
      uploadExternalDocumentsInteractor(applicationContext, {
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
          primary: {
            file: undefined,
            uploadProgress: () => 'something',
          },
          primarySupporting0: {
            file: undefined,
            uploadProgress: () => 'something3',
          },
          secondary: {
            file: undefined,
            uploadProgress: () => 'something2',
          },
          secondarySupporting0: {
            file: undefined,
            uploadProgress: () => 'something4',
          },
        },
      }),
    ).resolves.not.toThrow();
  });

  it('runs successfully with no errors with all data and valid user who is a practitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: 'irsPractitioner',
    });

    await expect(
      uploadExternalDocumentsInteractor(applicationContext, {
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
          primary: {
            file: undefined,
            uploadProgress: () => 'something',
          },
          primarySupporting0: {
            file: undefined,
            uploadProgress: () => 'something3',
          },
          secondary: {
            file: undefined,
            uploadProgress: () => 'something2',
          },
          secondarySupporting0: {
            file: undefined,
            uploadProgress: () => 'something4',
          },
        },
      }),
    ).resolves.not.toThrow();
  });
});
