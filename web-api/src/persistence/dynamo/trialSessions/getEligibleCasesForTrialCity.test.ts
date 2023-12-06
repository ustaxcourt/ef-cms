import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getEligibleCasesForTrialCity } from './getEligibleCasesForTrialCity';
import { query } from '../../dynamodbClientService';

jest.mock('../../dynamodbClientService');

const mockQuery = query as jest.Mock;

mockQuery.mockReturnValue([
  {
    docketNumber: '101-20',
    pk: 'eligible-for-trial-case-catalog',
    sk: 'WashingtonDistrictofColumbia-R-A-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
  },
]);

describe('getEligibleCasesForTrialCity', () => {
  it('should get the cases for a trial city', async () => {
    const result = await getEligibleCasesForTrialCity({
      applicationContext,
      procedureType: 'Regular',
      trialCity: 'WashingtonDC',
    });
    expect(result).toEqual([
      {
        docketNumber: '101-20',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'WashingtonDistrictofColumbia-R-A-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    ]);
  });
});
