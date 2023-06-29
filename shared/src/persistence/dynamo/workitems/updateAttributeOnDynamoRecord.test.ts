import { CASE_STATUS_TYPES } from '../../../business/entities/EntityConstants';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { update } from '../../dynamodbClientService';
import { updateAttributeOnDynamoRecord } from './updateAttributeOnDynamoRecord';

jest.mock('../../dynamodbClientService', () => ({
  update: jest.fn(),
}));

describe('updateAttributeOnDynamoRecord', () => {
  const recordsToUpdate = [
    {
      attributeKey: 'trialDate',
      attributeValue: '2019-08-25T05:00:00.000Z',
      pk: 'case|pk',
      sk: 'work-item|sk',
    },
    {
      attributeKey: 'caseStatus',
      attributeValue: CASE_STATUS_TYPES.calendared,
      pk: 'case|pk',
      sk: 'work-item|sk',
    },
  ];
  recordsToUpdate.forEach(record => {
    it(`should call client.update with passed in ${record.attributeKey}, attribute value, pk and sk`, async () => {
      await updateAttributeOnDynamoRecord({
        applicationContext,
        attributeKey: record.attributeKey,
        attributeValue: record.attributeValue,
        pk: record.pk,
        sk: record.sk,
      });

      expect((update as jest.Mock).mock.calls[0][0]).toMatchObject({
        ExpressionAttributeNames: {
          [`#${record.attributeKey}`]: `${record.attributeKey}`,
        },
        ExpressionAttributeValues: {
          [`:${record.attributeKey}`]: record.attributeValue,
        },
        Key: {
          pk: record.pk,
          sk: record.sk,
        },
        UpdateExpression: `SET #${record.attributeKey} = :${record.attributeKey}`,
        applicationContext,
      });
    });
  });
});
