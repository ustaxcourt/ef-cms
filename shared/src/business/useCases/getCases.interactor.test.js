const { getCases } = require('./getCases.interactor');
const { omit } = require('lodash');

describe('getCases', () => {
  let applicationContext;

  let documents = [
    {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'stin',
    },
    {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'stin',
    },
    {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'stin',
    },
  ];

  let caseRecord = {
    userId: 'userId',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '45678-18',
    documents,
    createdAt: '',
  };

  it('taxpayer - throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => {
        return {
          getCasesByUser: () =>
            Promise.resolve([omit(caseRecord, 'documents')]),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCases({
        userId: 'taxpayer',
        status: 'new',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });

  it('respondent - throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => {
        return {
          getCasesForRespondent: () =>
            Promise.resolve([omit(caseRecord, 'documents')]),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCases({
        userId: 'respondent',
        status: 'new',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });

  it('petitionsclerk - throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => {
        return {
          getCasesByStatus: () =>
            Promise.resolve([omit(caseRecord, 'documents')]),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCases({
        userId: 'petitionsclerk',
        status: 'new',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });

  it('intakeclerk - throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => {
        return {
          getCasesByStatus: () =>
            Promise.resolve([omit(caseRecord, 'documents')]),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCases({
        userId: 'intakeclerk',
        status: 'new',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });

  it('unauthorized user - throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => {
        return {
          getCasesByStatus: () =>
            Promise.resolve([omit(caseRecord, 'documents')]),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCases({
        userId: 'baduser',
        status: 'new',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('unauthorized user - getCasesByDocumentId - throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => {
        return {
          getCasesByStatus: () =>
            Promise.resolve([omit(caseRecord, 'documents')]),
          getCasesByDocumentId: () =>
            Promise.resolve([omit(caseRecord, 'documents')]),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCases({
        userId: 'intakeclerk',
        documentId: 'abc',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid ValidationError');
  });
});
