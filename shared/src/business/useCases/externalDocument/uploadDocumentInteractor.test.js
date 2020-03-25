const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { uploadDocumentInteractor } = require('./uploadDocumentInteractor');
const { User } = require('../../entities/User');

describe('uploadDocumentInteractor', () => {
  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'other',
      userId: 'other',
    });

    await expect(
      uploadDocumentInteractor({
        applicationContext,
        documentFiles: [
          {
            primary: 'something',
          },
        ],
        documentMetadata: {},
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('runs successfully with no errors with a valid user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });

    await expect(
      uploadDocumentInteractor({
        applicationContext,
        documentFiles: {
          primary: 'something',
        },
        documentMetadata: {},
        progressFunctions: {
          primary: 'something',
        },
      }),
    ).resolves.not.toThrow();
  });

  it('runs successfully with no errors with all data and valid user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });

    await expect(
      uploadDocumentInteractor({
        applicationContext,
        documentFiles: {
          primary: 'something',
          primarySupporting0: 'something3',
          secondary: 'something2',
          secondarySupporting0: 'something4',
        },
        documentMetadata: {
          hasSecondarySupportingDocuments: true,
          hasSupportingDocuments: true,
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

  it('runs successfully with no errors with all data and valid user who is a docketclerk', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.docketClerk,
      userId: 'docketclerk',
    });

    await expect(
      uploadDocumentInteractor({
        applicationContext,
        documentFiles: {
          primary: 'something',
          primarySupporting0: 'something3',
          secondary: 'something2',
          secondarySupporting0: 'something4',
        },
        documentMetadata: {},
        progressFunctions: {
          primary: 'something',
          primarySupporting0: 'something3',
          secondary: 'something2',
          secondarySupporting0: 'something4',
        },
      }),
    ).resolves.not.toThrow();
  });
});
