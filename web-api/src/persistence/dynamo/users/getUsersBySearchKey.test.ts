import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { batchGet, query } from '../../dynamodbClientService';
import { getUsersBySearchKey } from './getUsersBySearchKey';

jest.mock('../../dynamodbClientService');

const batchGetMock = batchGet as jest.Mock;
const queryMock = query as jest.Mock;

queryMock.mockReturnValue([
  {
    pk: 'Test Practitioner|privatePractitioner',
    sk: 'user|9805d1ab-18d0-43ec-bafb-654e83405416',
  },
]);

describe('getUsersBySearchKey', () => {
  beforeEach(() => {
    batchGetMock.mockImplementation(() => {
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
    });
  });

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
