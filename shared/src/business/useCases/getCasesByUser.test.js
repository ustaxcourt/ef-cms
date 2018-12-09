const assert = require('assert');
const sinon = require('sinon');
const { getCasesByUser } = require('./getCasesByUser');
const { omit } = require('lodash');

describe('Send petition to IRS', () => {
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

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCasesByUser: () =>
            Promise.resolve([omit(caseRecord, 'documents')]),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCasesByUser({
        userId: 'petitionsclerk',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });
});
