const { getCasesByStatus } = require('./getCasesByStatus.interactor');
const { omit } = require('lodash');

describe('getCasesByStatus', () => {
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

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCasesByStatus: () =>
            Promise.resolve([omit(caseRecord, 'documents')]),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCasesByStatus({
        userId: 'petitionsclerk',
        status: 'new',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The Case entity was invalid ValidationError: child \"documents\" fails because [\"documents\" must contain at least 1 items]');
  });

  it('throws an error if the user is unauthorized', async () => {
    let error;
    try {
      await getCasesByStatus({
        userId: 'baduser',
        applicationContext: null,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized for getCasesByStatus');
  });
});
