jest.mock('../../../shared/src/persistence/dynamodbClientService');
const client = require('../../../shared/src/persistence/dynamodbClientService');
const {
  applicationContext,
} = require('../business/test/createTestApplicationContext');
const { getRecordViaMapping } = require('./dynamo/helpers/getRecordViaMapping');
const { incrementCounter } = require('./dynamo/helpers/incrementCounter');
const { stripWorkItems } = require('./dynamo/helpers/stripWorkItems');

describe('awsDynamoPersistence', function () {
  beforeEach(() => {
    client.query = jest.fn().mockReturnValue([
      {
        pk: '123',
        sk: '123',
      },
    ]);
  });

  describe('getRecordViaMapping', () => {
    it('should map respondent to active case', async () => {
      await getRecordViaMapping({
        applicationContext,
        pk: '234|5678',
        prefix: 'something',
      });

      expect(client.get.mock.calls[0][0].Key.sk).not.toEqual('0');
    });
  });

  describe('incrementCounter', () => {
    it('should invoke the correct client updateConsistence method using the correct pk and sk', async () => {
      await incrementCounter({
        applicationContext,
        key: 'docketNumberCounter',
      });
      const year = new Date().getFullYear().toString();

      expect(client.updateConsistent.mock.calls[0][0].Key.pk).toEqual(
        `docketNumberCounter-${year}`,
      );
      expect(client.updateConsistent.mock.calls[0][0].Key.sk).toEqual(
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
