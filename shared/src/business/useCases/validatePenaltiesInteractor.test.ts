import { PENALTY_TYPES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { validatePenaltiesInteractor } from './validatePenaltiesInteractor';

describe('validatePenaltiesInteractor', () => {
  it('should not return validation erros when the penalty is valid', () => {
    const mockPenalty = {
      name: 'Penalty 1(IRS)',
      penaltyAmount: 100.0,
      penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
      statisticId: applicationContext.getUniqueId(),
    };

    const errors = validatePenaltiesInteractor(applicationContext, {
      rawPenalty: mockPenalty,
    });

    expect(errors).toEqual(null);
  });

  it('should return validation errors when the penalty is NOT valid', () => {
    const invalidMockPenalty = {
      name: 5, // must be a string to be valid
      penaltyAmount: '', // invalid due to expecting a numerical input
      penaltyType: undefined, // must have a penalty type,
      statisticId: undefined, // must be passed in when instantiating to be valid
    };

    const errors = validatePenaltiesInteractor(applicationContext, {
      rawPenalty: invalidMockPenalty,
    });

    expect(errors).toEqual({
      name: 'Penalty name is required.',
      penaltyAmount: 'Enter penalty amount.',
      penaltyType: 'Penalty type is required.',
      statisticId: 'Statistic ID is required.',
    });
  });
});
