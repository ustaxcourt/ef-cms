import { MOCK_CASE_DEADLINE } from '@shared/test/mockCaseDeadline';
import { applicationContext } from '../../test/createTestApplicationContext';
import { validateCaseDeadlineInteractor } from './validateCaseDeadlineInteractor';

describe('validateCaseDeadlineInteractor', () => {
  it('should return validation error messages when the case deadline is NOT valid', () => {
    const errors = validateCaseDeadlineInteractor(applicationContext, {
      caseDeadline: {
        ...MOCK_CASE_DEADLINE,
        description: undefined as any, // Description is a required string
      },
    });

    expect(errors).toEqual({
      description: 'Enter a description of this deadline',
    });
  });

  it('should return null when the case deadline is valid', () => {
    const errors = validateCaseDeadlineInteractor(applicationContext, {
      caseDeadline: MOCK_CASE_DEADLINE,
    });

    expect(errors).toEqual(null);
  });
});
