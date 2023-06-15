import { validateSearchDeadlinesInteractor } from './validateSearchDeadlinesInteractor';

describe('validateSearchDeadlinesInteractor', () => {
  it('returns the expected errors object on an empty statistic', () => {
    const errors = validateSearchDeadlinesInteractor({
      deadlineSearch: {},
    });

    expect(Object.keys(errors!).length).toBeGreaterThan(0);
  });

  it('returns null when there are no errors', () => {
    const result = validateSearchDeadlinesInteractor({
      deadlineSearch: {
        endDate: '01/02/2020',
        startDate: '01/01/2020',
      },
    });

    expect(result).toEqual(null);
  });
});
