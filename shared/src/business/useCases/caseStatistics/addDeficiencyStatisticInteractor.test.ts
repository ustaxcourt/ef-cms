import { MOCK_CASE } from '../../../test/mockCase';
import { ROLES } from '../../entities/EntityConstants';
import { addDeficiencyStatisticInteractor } from './addDeficiencyStatisticInteractor';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('addDeficiencyStatisticInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));
  });

  it('should throw an error if the user is unauthorized to update case statistics', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      addDeficiencyStatisticInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      } as any),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should call updateCase with the updated case statistics and return the updated case', async () => {
    const statistic = {
      determinationDeficiencyAmount: 123,
      determinationTotalPenalties: 456,
      irsDeficiencyAmount: 789,
      irsTotalPenalties: 1.1,
      penalties: [
        {
          name: 'Penalty 1 (IRS)',
          penaltyAmount: 100.0,
          penaltyType:
            applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
        },
        {
          name: 'Penalty 2 (IRS)',
          penaltyAmount: 200.0,
          penaltyType:
            applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
        },
      ],
      year: 2012,
      yearOrPeriod: 'Year',
    };

    const result = await addDeficiencyStatisticInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      ...statistic,
    } as any);

    expect(result).toMatchObject({
      statistics: [statistic],
    });
  });
});
