const {
  fileRespondentDocument,
} = require('./fileRespondentDocumentInteractor');

describe('fileRespondentDocument', () => {
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
          role: 'petitioner',
          userId: 'taxpayer',
        };
      },
      getPersistenceGateway: () => ({
        saveCase: async () => null,
        uploadDocument: async () => caseRecord,
      }),
      getUseCases: () => ({
        createDocument: () => null,
      }),
    };
    let error;
    try {
      await fileRespondentDocument({
        applicationContext,
        caseToUpdate: {},
        document: {},
        documentType: 'Answer',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('runs successfully with no errors on good data and valid user', async () => {
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
          saveCase: async () => null,
          uploadDocument: async () => caseRecord,
        }),
        getUseCases: () => ({
          createDocument: () => null,
        }),
      };
      await fileRespondentDocument({
        applicationContext,
        caseToUpdate: {},
        document: {},
        documentType: 'Answer',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });
});
