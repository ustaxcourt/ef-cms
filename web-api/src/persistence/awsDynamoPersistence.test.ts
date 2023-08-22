import { applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { incrementCounter } from './dynamo/helpers/incrementCounter';
import { updateConsistent } from './dynamodbClientService';
jest.mock('@web-api/persistence/dynamodbClientService');

describe('awsDynamoPersistence', function () {
  beforeEach(() => {
    (updateConsistent as jest.Mock).mockReturnValue({ id: 1 });
  });

  describe('incrementCounter', () => {
    it('should invoke the correct client updateConsistence method using the correct pk and sk', async () => {
      await incrementCounter({
        applicationContext,
        key: 'docketNumberCounter',
      });
      const { year } = applicationContext
        .getUtilities()
        .getMonthDayYearInETObj();

      expect((updateConsistent as jest.Mock).mock.calls[0][0].Key.pk).toEqual(
        `docketNumberCounter-${year}`,
      );
      expect((updateConsistent as jest.Mock).mock.calls[0][0].Key.sk).toEqual(
        `docketNumberCounter-${year}`,
      );
    });
  });
});
