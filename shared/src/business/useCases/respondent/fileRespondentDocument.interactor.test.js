const {
  fileRespondentDocument,
} = require('./fileRespondentDocument.interactor');

describe('fileRespondentDocument', () => {
  let applicationContext;

  let caseRecord = {
    userId: 'taxpayer',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    createdAt: '',
  };

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        uploadDocument: async () => caseRecord,
        saveCase: async () => null,
      }),
      getUseCases: () => ({
        associateRespondentDocumentToCase: () => null,
      }),
      environment: { stage: 'local' },
    };
    let error;
    try {
      await fileRespondentDocument({
        userId: 'taxpayer',
        caseToUpdate: {},
        document: {},
        documentType: 'Answer',
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('runs successfully with no errors on good data and valid user', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        uploadDocument: async () => caseRecord,
        saveCase: async () => null,
      }),
      getUseCases: () => ({
        associateRespondentDocumentToCase: () => null,
      }),
      environment: { stage: 'local' },
    };
    await fileRespondentDocument({
      userId: 'respondent',
      caseToUpdate: {},
      document: {},
      documentType: 'Answer',
      applicationContext,
    });
  });
});
