const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-string'));
const sinon = require('sinon');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');

const {
  getCaseByDocketNumber,
  createCase,
  getCaseByCaseId,
  saveCase,
  incrementCounter,
  getCasesByUser,
  getCasesForRespondent,
  getCasesByStatus,
} = require('./awsDynamoPersistence');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

describe('awsDynamoPersistence', function() {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'new',
    });
    sinon.stub(client, 'put').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'new',
    });
    sinon.stub(client, 'delete').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'new',
    });
    sinon.stub(client, 'batchGet').resolves([
      {
        pk: '123',
        sk: '123',
        caseId: '123',
        status: 'new',
      },
    ]);
    sinon.stub(client, 'query').resolves([
      {
        pk: '123',
        sk: '123',
      },
    ]);
    sinon.stub(client, 'batchWrite').resolves(null);
    sinon.stub(client, 'updateConsistent').resolves(null);
  });

  afterEach(() => {
    client.get.restore();
    client.delete.restore();
    client.put.restore();
    client.query.restore();
    client.batchGet.restore();
    client.batchWrite.restore();
    client.updateConsistent.restore();
  });

  describe('getCaseByCaseId', async () => {
    it('should strip out the internal keys used for persistence before returning', async () => {
      const result = await getCaseByCaseId({
        caseId: '123',
        applicationContext,
      });
      expect(result).to.deep.equal({
        caseId: '123',
        status: 'new',
      });
    });

    it('should return null if nothing is returned from the client get request', async () => {
      client.get.resolves(null);
      const result = await getCaseByCaseId({
        caseId: '123',
        applicationContext,
      });
      expect(result).to.be.null;
    });
  });

  describe('getCaseByDocketNumber', () => {
    it('should strip the pk and sk from the case', async () => {
      const result = await getCaseByDocketNumber({
        pk: '123',
        sk: '123',
        docketNumber: '00101-18',
        applicationContext,
      });
      expect(result).to.deep.equal({ caseId: '123', status: 'new' });
    });

    it('should return null if no mapping records are returned from the query', async () => {
      client.query.resolves([]);
      const result = await getCaseByDocketNumber({
        pk: '123',
        sk: '123',
        docketNumber: '00101-18',
        applicationContext,
      });
      expect(result).to.be.null;
    });
  });

  describe('saveCase', () => {
    it('should strip the pk and sk from the returned case', async () => {
      const result = await saveCase({
        caseToSave: {
          caseId: '123',
          status: 'new',
        },
        applicationContext,
      });
      expect(result).to.deep.equal({ caseId: '123', status: 'new' });
    });

    it('should attempt to delete and put a new status mapping if the status changes', async () => {
      await saveCase({
        caseToSave: {
          caseId: '123',
          status: 'general',
        },
        applicationContext,
      });
      expect(client.delete.getCall(0).args[0].key.pk).to.equal(
        'new|case-status',
      );
      expect(client.delete.getCall(0).args[0].key.sk).to.equal('123');
      expect(client.put.getCall(0).args[0].Item.pk).to.equal(
        'general|case-status',
      );
      expect(client.put.getCall(0).args[0].Item.sk).to.equal('123');
    });
  });

  describe('incrementCounter', () => {
    it('should invoke the correct client updateConsistence method using the correct pk and sk', async () => {
      await incrementCounter({ applicationContext });
      expect(client.updateConsistent.getCall(0).args[0].Key.pk).to.equal(
        'docketNumberCounter',
      );
      expect(client.updateConsistent.getCall(0).args[0].Key.sk).to.equal(
        'docketNumberCounter',
      );
    });
  });

  describe('createCase', () => {
    let params;
    let items;
    const CASE_ID = '123';
    const DOCKET_NUMBER = 'abc';
    const USER_ID = 'taxpayer';
    const CASE_RECORD = {
      caseId: CASE_ID,
      docketNumber: DOCKET_NUMBER,
      userId: USER_ID,
    };

    beforeEach(async () => {
      await createCase({
        caseRecord: CASE_RECORD,
        applicationContext,
      });
      params = client.batchWrite.getCall(0).args[0];
      items = params.items;
    });

    it('should persist a docket number mapping record as an item', async () => {
      expect(items).to.deep.include({
        pk: CASE_ID,
        sk: CASE_ID,
        ...CASE_RECORD,
      });
    });

    it('should persist a new status mapping record as an item', async () => {
      expect(items).to.deep.include({
        pk: `${DOCKET_NUMBER}|case`,
        sk: CASE_ID,
      });
    });

    it('should persist a user id to case mappipng record as an item', async () => {
      expect(items).to.deep.include({
        pk: `new|case-status`,
        sk: CASE_ID,
      });
    });

    it('should persist a case record as an item', async () => {
      expect(items).to.deep.include({
        pk: `${USER_ID}|case`,
        sk: CASE_ID,
      });
    });
  });

  describe('getCasesByUser', () => {
    it('should strip the pk and sk from the results', async () => {
      const result = await getCasesByUser({
        userId: 'taxpayer',
        applicationContext,
      });
      expect(result).to.deep.equal([{ caseId: '123', status: 'new' }]);
    });
    it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
      await getCasesByUser({
        userId: 'taxpayer',
        applicationContext,
      });
      expect(client.batchGet.getCall(0).args[0].keys).to.deep.equal([
        { pk: '123', sk: '123' },
      ]);
    });
  });

  describe('getCasesForRespondent', () => {
    it('should strip the pk and sk from the results', async () => {
      const result = await getCasesForRespondent({
        respondentId: 'taxpayer',
        applicationContext,
      });
      expect(result).to.deep.equal([{ caseId: '123', status: 'new' }]);
    });
    it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
      await getCasesForRespondent({
        respondentId: 'taxpayer',
        applicationContext,
      });
      expect(client.batchGet.getCall(0).args[0].keys).to.deep.equal([
        { pk: '123', sk: '123' },
      ]);
    });
  });

  describe('getCasesByStatus', () => {
    it('should strip the pk and sk from the results', async () => {
      const result = await getCasesByStatus({
        status: 'new',
        applicationContext,
      });
      expect(result).to.deep.equal([{ caseId: '123', status: 'new' }]);
    });
    it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
      await getCasesByStatus({
        status: 'new',
        applicationContext,
      });
      expect(client.batchGet.getCall(0).args[0].keys).to.deep.equal([
        { pk: '123', sk: '123' },
      ]);
    });
  });
});
