const assert = require('assert');
const createCase = require('./createCase');

describe('Create case', () => {
  let applicationContext;
  let documents = [
    {
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
    },
    {
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
    },
  ];

  beforeEach(() => {});

  it('Success', async () => {
    applicationContext = {
      persistence: {
        createCase: () =>
          Promise.resolve({ caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' }),
      },
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00000-00'),
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
      persistence: {
        createCase: () => Promise.reject(new Error('problem')),
      },
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00000-00'),
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
});
