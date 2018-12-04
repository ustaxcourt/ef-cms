const assert = require('assert');

const { sendPetitionToIRS } = require('./sendPetitionToIRS');

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
    documents: null,
    createdAt: '',
  };

  applicationContext = {
    persistence: {
      getCaseByCaseId: () => Promise.resolve(caseRecord),
      saveCase: () => Promise.resolve(caseRecord),
    },
    environment: { stage: 'local' },
    irsGateway: {
      sendToIRS: () => Promise.resolve(),
    },
  };

  it('throws unauthorized error if user is unauthorized', async () => {
    let error;
    try {
      await sendPetitionToIRS({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'someuser',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    assert.equal(error.message, 'Unauthorized for send to IRS');
  });

  it('throws invalid entity error if user is invalid', async () => {
    let error;
    try {
      await sendPetitionToIRS({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'petitionsclerk',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    assert.equal(error.message, 'Invalid for send to IRS');
  });

  it('calls the irs gateway', async () => {
    caseRecord.documents = documents;
    let savedCaseRecord = Object.assign(caseRecord);
    savedCaseRecord.irsSendDate = new Date();
    applicationContext = {
      persistence: {
        getCaseByCaseId: () => Promise.resolve(caseRecord),
        saveCase: () => Promise.resolve(savedCaseRecord),
      },
      environment: { stage: 'local' },
      irsGateway: {
        sendToIRS: () => Promise.resolve(),
      },
    };
    const sentCase = await sendPetitionToIRS({
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userId: 'petitionsclerk',
      applicationContext,
    });
    assert.ok(sentCase.irsSendDate);
  });
});
