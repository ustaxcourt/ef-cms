const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  uploadExternalDocumentsInteractor,
} = require('./uploadExternalDocumentsInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('uploadExternalDocumentsInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .fileExternalDocumentForConsolidatedInteractor.mockReturnValue({});
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
        documentFiles: [
          {
            primary: 'something',
          },
        ],
        documentMetadata: {},
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
      progressFunctions: {
        primary: 'something',
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
        progressFunctions: {
          primary: 'something',
          primarySupporting0: 'something3',
          secondary: 'something2',
          secondarySupporting0: 'something4',
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
        progressFunctions: {
          primary: 'something',
          primarySupporting0: 'something3',
          secondary: 'something2',
          secondarySupporting0: 'something4',
        },
      }),
    ).resolves.not.toThrow();
  });

  it('should call fileExternalDocumentForConsolidatedInteractor when a leadDocketNumber is provided', async () => {
    await uploadExternalDocumentsInteractor(applicationContext, {
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
      leadDocketNumber: '123-20',
      progressFunctions: {
        primary: 'something',
        primarySupporting0: 'something3',
        secondary: 'something2',
        secondarySupporting0: 'something4',
      },
    });

    expect(
      applicationContext.getUseCases().fileExternalDocumentInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases()
        .fileExternalDocumentForConsolidatedInteractor,
    ).toHaveBeenCalled();
  });
});
