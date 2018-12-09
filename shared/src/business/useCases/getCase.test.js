const assert = require('assert');
const { getCase } = require('./getCase');

const documents = [
  {
    documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    documentType: 'a',
    createdAt: '2018-11-21T20:49:28.192Z',
    userId: 'taxpayer',
    validated: true,
    reviewDate: '2018-11-21T20:49:28.192Z',
    reviewUser: 'petitionsclerk',
  },
  {
    documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    documentType: 'b',
    createdAt: '2018-11-21T20:49:28.192Z',
    userId: 'taxpayer',
    validated: true,
    reviewDate: '2018-11-21T20:49:28.192Z',
    reviewUser: 'petitionsclerk',
  },
  {
    documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    documentType: 'c',
    createdAt: '2018-11-21T20:49:28.192Z',
    userId: 'taxpayer',
    validated: true,
    reviewDate: '2018-11-21T20:49:28.192Z',
    reviewUser: 'petitionsclerk',
  },
];

describe('Get case', () => {
  let applicationContext;

  beforeEach(() => {});

  it('Success case by case id', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () =>
            Promise.resolve({
              docketNumber: '00101-18',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              documents,
            }),
        };
      },
      environment: { stage: 'local' },
    };
    const caseRecord = await getCase({
      userId: 'petitionsclerk',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      applicationContext,
    });
    assert.equal(caseRecord.caseId, 'c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('failure case by case id', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(null),
        };
      },
      environment: { stage: 'local' },
    };
    try {
      await getCase({
        userId: 'petitionsclerk',
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        applicationContext,
      });
    } catch (error) {
      assert.equal(
        error.message,
        'Case c54ba5a9-b37b-479d-9201-067ec6e335bb was not found.',
      );
    }
  });

  it('success case by docket number', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: () => {
          return Promise.resolve({
            docketNumber: '00101-00',
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            documents,
          });
        },
      }),
      environment: { stage: 'local' },
    };
    const caseRecord = await getCase({
      userId: 'petitionsclerk',
      caseId: '00101-00',
      applicationContext,
    });
    assert.equal(caseRecord.caseId, 'c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('failure case by docket number', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: () =>
          Promise.resolve({
            docketNumber: '00101-00',
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            documents,
          }),
      }),
      environment: { stage: 'local' },
    };
    try {
      await getCase({
        userId: 'petitionsclerk',
        caseId: '00-11111',
        applicationContext,
      });
    } catch (error) {
      assert.equal(error.message, 'Case 00-11111 was not found.');
    }
  });

  it('failure case by invalid user', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: () =>
          Promise.resolve([
            {
              docketNumber: '00101-00',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              documents,
            },
          ]),
      }),
      environment: { stage: 'local' },
    };
    try {
      await getCase({
        userId: 'someone',
        caseId: '00101-00',
        applicationContext,
      });
    } catch (error) {
      assert.equal(error.message, 'Unauthorized');
    }
  });
});
