const chai = require('chai');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');
const expect = require('chai').expect;
const sinon = require('sinon');

const { incrementCounter, stripWorkItems } = require('./awsDynamoPersistence');

chai.use(require('chai-string'));

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

  describe('incrementCounter', () => {
    it('should invoke the correct client updateConsistence method using the correct pk and sk', async () => {
      await incrementCounter({ applicationContext });
      const year = new Date().getFullYear().toString();

      expect(client.updateConsistent.getCall(0).args[0].Key.pk).to.equal(
        `docketNumberCounter-${year}`,
      );
      expect(client.updateConsistent.getCall(0).args[0].Key.sk).to.equal(
        `docketNumberCounter-${year}`,
      );
    });
  });

  describe('stripWorkItems', () => {
    it('removes the workItems if not authorized', async () => {
      let caseRecord = { caseId: 1, workItems: [{ workItemId: 1 }] };
      stripWorkItems(caseRecord, false);
      expect(caseRecord.workItems).to.be.undefined;
    });

    it('does not remove the workItems if authorized', async () => {
      let caseRecord = { caseId: 1, workItems: [{ workItemId: 1 }] };
      stripWorkItems(caseRecord, true);
      expect(caseRecord.workItems).to.not.be.undefined;
    });

    it('removes the workItems on a collection if not authorized', async () => {
      let caseRecord = [
        { caseId: 1, workItems: [{ workItemId: 1 }] },
        { caseId: 2, workItems: [{ workItemId: 2 }] },
      ];
      stripWorkItems(caseRecord, false);
      expect(caseRecord[0].workItems).to.be.undefined;
      expect(caseRecord[1].workItems).to.be.undefined;
    });

    it('does not remove the workItems on a collection if authorized', async () => {
      let caseRecord = [
        { caseId: 1, workItems: [{ workItemId: 1 }] },
        { caseId: 2, workItems: [{ workItemId: 2 }] },
      ];
      stripWorkItems(caseRecord, true);
      expect(caseRecord[0].workItems).to.not.be.undefined;
      expect(caseRecord[1].workItems).to.not.be.undefined;
    });
  });
});
