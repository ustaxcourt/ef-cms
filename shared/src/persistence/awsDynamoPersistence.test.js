const client = require('ef-cms-shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { getRecordViaMapping } = require('./dynamo/helpers/getRecordViaMapping');
const { incrementCounter } = require('./dynamo/helpers/incrementCounter');
const { stripWorkItems } = require('./dynamo/helpers/stripWorkItems');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

describe('awsDynamoPersistence', function() {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: 'New',
    });
    sinon.stub(client, 'put').resolves({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: 'New',
    });
    sinon.stub(client, 'delete').resolves({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: 'New',
    });
    sinon.stub(client, 'batchGet').resolves([
      {
        caseId: '123',
        pk: '123',
        sk: '123',
        status: 'New',
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

  describe('getRecordViaMapping', () => {
    it('should map respondent to active case', async () => {
      const key = '5678';
      const type = '234';
      const isVersioned = undefined;
      await getRecordViaMapping({
        applicationContext,
        isVersioned,
        key,
        type,
      });

      expect(client.get.getCall(0).args[0].Key.sk).not.toEqual('0');
    });
  });

  describe('incrementCounter', () => {
    it('should invoke the correct client updateConsistence method using the correct pk and sk', async () => {
      await incrementCounter({
        applicationContext,
        key: 'docketNumberCounter',
      });
      const year = new Date().getFullYear().toString();

      expect(client.updateConsistent.getCall(0).args[0].Key.pk).toEqual(
        `docketNumberCounter-${year}`,
      );
      expect(client.updateConsistent.getCall(0).args[0].Key.sk).toEqual(
        `docketNumberCounter-${year}`,
      );
    });
  });

  describe('stripWorkItems', () => {
    it('does nothing if no cases are provided', () => {
      let result = stripWorkItems(undefined, false);
      expect(result).toBeUndefined();
    });

    it('removes the workItems if not authorized', async () => {
      let caseRecord = { caseId: 1, workItems: [{ workItemId: 1 }] };
      stripWorkItems(caseRecord, false);
      expect(caseRecord.workItems).toBeUndefined();
    });

    it('does not remove the workItems if authorized', async () => {
      let caseRecord = { caseId: 1, workItems: [{ workItemId: 1 }] };
      stripWorkItems(caseRecord, true);
      expect(caseRecord.workItems).toBeDefined();
    });

    it('removes the workItems on a collection if not authorized', async () => {
      let caseRecord = [
        { caseId: 1, workItems: [{ workItemId: 1 }] },
        { caseId: 2, workItems: [{ workItemId: 2 }] },
      ];
      stripWorkItems(caseRecord, false);
      expect(caseRecord[0].workItems).toBeUndefined();
      expect(caseRecord[1].workItems).toBeUndefined();
    });

    it('does not remove the workItems on a collection if authorized', async () => {
      let caseRecord = [
        { caseId: 1, workItems: [{ workItemId: 1 }] },
        { caseId: 2, workItems: [{ workItemId: 2 }] },
      ];
      stripWorkItems(caseRecord, true);
      expect(caseRecord[0].workItems).toBeDefined();
      expect(caseRecord[1].workItems).toBeDefined();
    });
  });
});
