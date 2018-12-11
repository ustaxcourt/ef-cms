const assert = require('assert');
const { createCase } = require('./createCase.interactor');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');

describe('Create case', () => {
  let applicationContext;
  let documents = MOCK_DOCUMENTS;

  beforeEach(() => {});

  it('Success', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          createCase: () =>
            Promise.resolve({
              docketNumber: '00101-18',
              documents,
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            }),
        };
      },
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
    };
    const caseRecord = await createCase({
      userid: 'taxpayer',
      documents: documents,
      applicationContext,
    });
    assert.equal(caseRecord.caseId, 'c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('failure', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          createCase: () => Promise.reject(new Error('problem')),
        };
      },
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
    };
    try {
      await createCase({
        userid: 'petitionsclerk',
        documents: documents,
        applicationContext,
      });
    } catch (error) {
      assert.equal(error.message, 'problem');
    }
  });

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          createCase: () =>
            Promise.resolve({
              docketNumber: '00101-00',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            }),
        };
      },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await createCase({
        userId: 'taxpayer',
        documents,
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });
});
