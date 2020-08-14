jest.mock('../../../shared/src/persistence/dynamodbClientService');
const client = require('../../../shared/src/persistence/dynamodbClientService');
const {
  applicationContext,
} = require('../business/test/createTestApplicationContext');
const { getRecordViaMapping } = require('./dynamo/helpers/getRecordViaMapping');
const { incrementCounter } = require('./dynamo/helpers/incrementCounter');

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
});
