const assert = require('assert');
const { updateCase } = require('./updateCase');
const { omit } = require('lodash');

const MOCK_CASE = {
  userId: 'userId',
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  docketNumber: '56789-18',
  status: 'new',
  createdAt: new Date().toISOString(),
  documents: [
    {
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      userId: 'taxpayer',
    },
    {
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      userId: 'taxpayer',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      userId: 'taxpayer',
    },
  ],
};

describe('updateCase', () => {
  let applicationContext;

  it('should throw an error if the persistence layer returns an invalid Case', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: () => Promise.resolve(omit(MOCK_CASE, 'documents')),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await updateCase({
        caseId: MOCK_CASE.caseId,
        caseJson: MOCK_CASE,
        userId: 'petitionsclerk',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
    assert.ok(error.message.startsWith('The entity was invalid'));
  });

  it('should throw an error if the caseJson passed in is an invalid case', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: () => Promise.resolve(MOCK_CASE),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await updateCase({
        caseId: MOCK_CASE.caseId,
        caseJson: omit(MOCK_CASE, 'documents'),
        userId: 'petitionsclerk',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
    assert.ok(error.message.startsWith('The entity was invalid'));
  });
});
