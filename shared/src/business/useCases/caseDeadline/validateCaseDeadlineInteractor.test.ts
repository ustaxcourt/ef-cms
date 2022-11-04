import { CaseDeadline } from '../../entities/CaseDeadline';
import { applicationContext } from '../../test/createTestApplicationContext';
import { validateCaseDeadlineInteractor } from './validateCaseDeadlineInteractor';

describe('validateCaseDeadlineInteractor', () => {
  it('returns the expected errors object on an empty case deadline', () => {
    const errors = validateCaseDeadlineInteractor(applicationContext, {
      caseDeadline: {} as any,
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(CaseDeadline.VALIDATION_ERROR_MESSAGES),
    );
  });

  it('returns null when there are no errors', () => {
    const mockCaseDeadline = {
      associatedJudge: 'Buch',
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      deadlineDate: '2019-03-01T21:42:29.073Z',
      description: 'hello world',
      docketNumber: '123-20',
    };

    const errors = validateCaseDeadlineInteractor(applicationContext, {
      caseDeadline: mockCaseDeadline as any,
    });

    expect(errors).toEqual(null);
  });
});
