import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { incrementCounter } from './incrementCounter';
import { updateConsistent } from '../../dynamodbClientService';

jest.mock('../../dynamodbClientService', () => ({
  updateConsistent: jest.fn().mockReturnValue({ id: 1 }),
}));

describe('incrementCounter', () => {
  it('should update the docketNumber counter for the provided year', async () => {
    await incrementCounter({
      applicationContext,
      key: '3',
      year: '2029',
    });

    expect((updateConsistent as jest.Mock).mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: { '#id': 'id' },
      ExpressionAttributeValues: {
        ':value': 1,
      },
      Key: {
        pk: '3-2029',
        sk: '3-2029',
      },
    });
  });

  it('should update the docketNumber counter for the current year when one is not provided', async () => {
    const { year: currentYear } = applicationContext
      .getUtilities()
      .getMonthDayYearInETObj();

    await incrementCounter({
      applicationContext,
      key: '4',
    });

    expect((updateConsistent as jest.Mock).mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: { '#id': 'id' },
      ExpressionAttributeValues: {
        ':value': 1,
      },
      Key: {
        pk: `4-${currentYear}`,
        sk: `4-${currentYear}`,
      },
    });
  });
});
