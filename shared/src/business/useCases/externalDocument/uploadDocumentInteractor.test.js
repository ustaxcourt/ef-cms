const { uploadDocumentInteractor } = require('./uploadDocumentInteractor');
const { User } = require('../../entities/User');

describe('uploadDocumentInteractor', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '45678-18',
    documents: [
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
    ],
    role: User.ROLES.petitioner,
    userId: 'petitioner',
  };

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'other',
          userId: 'other',
        };
      },
      getPersistenceGateway: () => ({
        uploadDocument: async () => caseRecord,
      }),
    };
    let error;
    try {
      await uploadDocumentInteractor({
        applicationContext,
        documentFiles: [
          {
            primary: 'something',
          },
        ],
        documentMetadata: {},
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });

  it('runs successfully with no errors with minimum data and valid user', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            role: User.ROLES.petitionsClerk,
            userId: 'petitionsclerk',
          };
        },
        getPersistenceGateway: () => ({
          uploadDocument: async () => caseRecord,
        }),
      };
      await uploadDocumentInteractor({
        applicationContext,
        documentFiles: {
          primary: 'something',
        },
        documentMetadata: {},
        progressFunctions: {
          primary: 'something',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });

  it('runs successfully with no errors with all data and valid user', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            role: User.ROLES.petitionsClerk,
            userId: 'petitionsclerk',
          };
        },
        getPersistenceGateway: () => ({
          uploadDocument: async () => caseRecord,
        }),
      };
      await uploadDocumentInteractor({
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
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });

  it('runs successfully with no errors with all data and valid user who is a docketclerk', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            role: User.ROLES.docketClerk,
            userId: 'docketclerk',
          };
        },
        getPersistenceGateway: () => ({
          uploadDocument: async () => caseRecord,
        }),
      };
      await uploadDocumentInteractor({
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
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });
});
