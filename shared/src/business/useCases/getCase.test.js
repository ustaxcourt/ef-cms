const assert = require('assert');
const { getCase } = require('./getCase');

describe('Get case', () => {
  let applicationContext;

  beforeEach(() => {});

  it('Success case by case id', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () =>
            Promise.resolve({ caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' }),
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
      getPersistenceGateway: () => {
        return {
          getCaseByDocketNumber: () => {
            return Promise.resolve({
              docketNumber: '00000-00',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            });
          },
        };
      },
      environment: { stage: 'local' },
    };
    const caseRecord = await getCase({
      userId: 'petitionsclerk',
      caseId: '00000-00',
      applicationContext,
    });
    assert.equal(caseRecord.caseId, 'c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('failure case by docket number', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByDocketNumber: () =>
            Promise.resolve({
              docketNumber: '00000-00',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            }),
        };
      },
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
      getPersistenceGateway: () => {
        return {
          getCaseByDocketNumber: () =>
            Promise.resolve([
              {
                docketNumber: '00000-00',
                caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              },
            ]),
        };
      },
      environment: { stage: 'local' },
    };
    try {
      await getCase({
        userId: 'someone',
        caseId: '00000-00',
        applicationContext,
      });
    } catch (error) {
      assert.equal(error.message, 'Unauthorized');
    }
  });
});
