import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  getFromDeployTable,
  updateConsistent,
} from '../../dynamodbClientService';
import { getLimiterByKey, incrementKeyCount, setExpiresAt } from './store';

jest.mock('../../dynamodbClientService', () => ({
  getFromDeployTable: jest
    .fn()
    .mockReturnValue({ maxInvocations: 5, windowTime: 1000 }),
  updateConsistent: jest.fn().mockReturnValue({ id: 1 }),
}));

describe('incrementKeyCount', () => {
  it('should try to add one to the id', async () => {
    await incrementKeyCount({
      applicationContext,
      key: 'limiter',
    });

    expect((updateConsistent as jest.Mock).mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: { '#id': 'id' },
      ExpressionAttributeValues: {
        ':value': 1,
      },
      Key: {
        pk: 'limiter',
        sk: 'limiter',
      },
      UpdateExpression: 'ADD #id :value',
    });
  });
});

describe('setExpiresAt', () => {
  it('should set expiresAt to the value passed in and reset the id back to 1', async () => {
    await setExpiresAt({
      applicationContext,
      expiresAt: '123',
      key: 'limiter',
    });

    expect((updateConsistent as jest.Mock).mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: {
        '#expiresAt': 'expiresAt',
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': 1,
        ':value': '123',
      },
      Key: {
        pk: 'limiter',
        sk: 'limiter',
      },
      UpdateExpression: 'SET #expiresAt = :value, #id = :id',
    });
  });
});

describe('getLimiterByKey', () => {
  it('should call getFromDeployTable with the correct key', async () => {
    const result = await getLimiterByKey({
      applicationContext,
      key: 'advanced-document-search',
    });
    expect((getFromDeployTable as jest.Mock).mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'advanced-document-search',
        sk: 'advanced-document-search',
      },
    });

    expect(result).toMatchObject({
      maxInvocations: 5,
      windowTime: 1000,
    });
  });
});
