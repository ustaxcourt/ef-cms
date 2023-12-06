import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getInternalUsers } from './getInternalUsers';

jest.mock('../../dynamodbClientService', () => ({
  batchGet: jest.fn().mockReturnValue([
    {
      pk: 'user|petitionsclerk1',
      sk: 'user|petitionsclerk1',
      userId: 'petitionsclerk1',
    },
    {
      pk: 'user|docketclerk1',
      sk: 'user|docketclerk1',
      userId: 'docketclerk1',
    },
    {
      pk: 'user|adc1',
      sk: 'user|adc1',
      userId: 'adc1',
    },
  ]),
  query: jest.fn().mockReturnValue([
    {
      pk: 'section|petitions',
      sk: 'user|petitionsclerk1',
      userId: 'petitionsclerk1',
    },
    {
      pk: 'section|docket',
      sk: 'user|docketclerk1',
      userId: 'docketclerk1',
    },
    {
      pk: 'section|adc',
      sk: 'user|adc1',
      userId: 'adc1',
    },
  ]),
}));

describe('getInternalUsers', () => {
  it('should get the internal users', async () => {
    const result = await getInternalUsers({
      applicationContext,
    });
    expect(result.length).toEqual(9);
  });
});
