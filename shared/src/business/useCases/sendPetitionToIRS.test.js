const assert = require('assert');
const sinon = require('sinon');
const { sendPetitionToIRS } = require('./sendPetitionToIRS');
const { getCase } = require('./getCase');
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

  applicationContext = {
    getPersistenceGateway: () => {
      return {
        getCaseByCaseId: () => Promise.resolve(caseRecord),
        saveCase: () => Promise.resolve(caseRecord),
      };
    },
    environment: { stage: 'local' },
    irsGateway: {
      sendToIRS: () => Promise.resolve(),
    },
    getUseCases: () => ({ getCase }),
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
    expect(error.message).toContain('Unauthorized for send to IRS');
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
    expect(error.message).toContain('Invalid for send to IRS');
  });

  it('case not found if caseId does not exist', async () => {
    caseRecord.documents = documents;
    // const date = '2018-12-04T18:27:13.370Z';
    // const stub = sinon.stub().resolves(date);
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(null),
        };
      },
      environment: { stage: 'local' },
      getUseCases: () => ({ getCase }),
    };
    let error;
    try {
      await sendPetitionToIRS({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        userId: 'petitionsclerk',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
    expect(error.message).toContain(
      'Case c54ba5a9-b37b-479d-9201-067ec6e335ba was not found',
    );
  });

  it('calls the irs gateway', async () => {
    caseRecord.documents = documents;
    let savedCaseRecord = Object.assign(caseRecord);
    const date = '2018-12-04T18:27:13.370Z';
    const stub = sinon.stub().resolves(date);
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(caseRecord),
          saveCase: () => Promise.resolve(savedCaseRecord),
        };
      },
      environment: { stage: 'local' },
      irsGateway: {
        sendToIRS: stub,
      },
      getUseCases: () => ({ getCase }),
    };

    const irsSendDate = await sendPetitionToIRS({
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userId: 'petitionsclerk',
      applicationContext,
    });
    assert.ok(irsSendDate);
    assert.equal(irsSendDate, date);
    assert.ok(stub.called);
  });

  it('handles error from the irs gateway', async () => {
    caseRecord.documents = documents;
    let savedCaseRecord = Object.assign(caseRecord);
    const stub = sinon.stub().throws(new Error('blech'));
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(caseRecord),
          saveCase: () => Promise.resolve(savedCaseRecord),
        };
      },
      environment: { stage: 'local' },
      irsGateway: {
        sendToIRS: stub,
      },
      getUseCases: () => ({ getCase }),
    };
    let error;
    try {
      await sendPetitionToIRS({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        userId: 'petitionsclerk',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
    expect(error.message).toContain(
      'error sending c54ba5a9-b37b-479d-9201-067ec6e335ba to IRS: blech',
    );
  });

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(omit(caseRecord, 'documents')),
        };
      },
      environment: { stage: 'local' },
      irsGateway: {
        sendToIRS: () => {},
      },
      getUseCases: () => ({ getCase }),
    };
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
    expect(error.message).toContain('The entity was invalid');
  });

  it('throws an error if the irs gateway returns an invalid date', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(caseRecord),
        };
      },
      environment: { stage: 'local' },
      irsGateway: {
        sendToIRS: () => 'a',
      },
      getUseCases: () => ({ getCase }),
    };
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
    expect(error.message).toContain('Invalid for send to IRS');
  });
});
