import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { batchGet, query } from '../../dynamodbClientService';
import { getUsersBySearchKey } from './getUsersBySearchKey';
import { ROLES } from '../../../business/entities/EntityConstants';

jest.mock('../../dynamodbClientService', () => ({
  batchGet: jest.fn().mockImplementation(() => {
    const { ROLES } = require('../../../business/entities/EntityConstants');
    return [
      {
        barNumber: 'PT1234',
        name: 'Test Practitioner',
        pk: 'user|9805d1ab-18d0-43ec-bafb-654e83405416',
        role: ROLES.privatePractitioner,
        section: 'privatePractitioner',
        sk: '9805d1ab-18d0-43ec-bafb-654e83405416',
        userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ];
  }),
  query: jest.fn().mockReturnValue([
    {
      pk: 'Test Practitioner|privatePractitioner',
      sk: 'user|9805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ]),
}));
const queryMock = query as jest.Mock;

describe('getUsersBySearchKey', () => {
  it('should return data as received from persistence', async () => {
    const result = await getUsersBySearchKey({
      applicationContext,
      searchKey: 'Test Practitioner',
      type: 'privatePractitioner',
    });

    expect(result).toEqual([
      {
        barNumber: 'PT1234',
        name: 'Test Practitioner',
        pk: 'user|9805d1ab-18d0-43ec-bafb-654e83405416',
        role: ROLES.privatePractitioner,
        section: 'privatePractitioner',
        sk: '9805d1ab-18d0-43ec-bafb-654e83405416',
        userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });

  it('should return an empty array if no mapping records are returned from the query', async () => {
    queryMock.mockReturnValueOnce([]);
    const result = await getUsersBySearchKey({
      applicationContext,
      searchKey: 'Test Practitioner',
      type: 'privatePractitioner',
    });

    expect(result).toEqual([]);
  });

  it('should convert search key to upper case before calling dynamo', async () => {
    await getUsersBySearchKey({
      applicationContext,
      searchKey: 'pt1234',
      type: 'privatePractitioner',
    });

    expect(queryMock.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':pk': 'privatePractitioner|PT1234',
      },
    });
  });
});
