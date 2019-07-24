const {
  uploadExternalDocumentsInteractor,
} = require('./uploadExternalDocumentsInteractor');
const { UnauthorizedError } = require('../../../errors/errors');

describe('uploadExternalDocumentsInteractor', () => {
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
    role: 'petitioner',
    userId: 'taxpayer',
  };

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'seniorattorney',
          userId: 'seniorattorney',
        };
      },
      getPersistenceGateway: () => ({
        uploadDocument: async () => caseRecord,
      }),
      getUseCases: () => ({
        fileExternalDocumentInteractor: () => {},
      }),
    };
    let error;
    try {
      await uploadExternalDocumentsInteractor({
        applicationContext,
        documentFiles: ['something'],
        documentMetadata: {},
        onUploadProgresses: [() => null],
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('runs successfully with no errors with minimum data and valid user', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            role: 'respondent',
            userId: 'respondent',
          };
        },
        getPersistenceGateway: () => ({
          uploadDocument: async () => caseRecord,
        }),
        getUseCases: () => ({
          fileExternalDocumentInteractor: () => {},
        }),
      };
      await uploadExternalDocumentsInteractor({
        applicationContext,
        documentFiles: ['something'],
        documentMetadata: {},
        onUploadProgresses: [() => null],
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
            role: 'respondent',
            userId: 'respondent',
          };
        },
        getPersistenceGateway: () => ({
          uploadDocument: async () => caseRecord,
        }),
        getUseCases: () => ({
          fileExternalDocumentInteractor: () => {},
        }),
      };
      const docIds = await uploadExternalDocumentsInteractor({
        applicationContext,
        documentFiles: ['something', 'something2', undefined, 'something4'],
        documentMetadata: {},
        onUploadProgresses: [() => null, () => null, null, () => null],
      });
      expect(docIds[2]).toBeUndefined();
      expect(docIds.length).toEqual(4);
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });
});
