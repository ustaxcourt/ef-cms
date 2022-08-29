const {
  validateSearchDeadlinesInteractor,
} = require('./validateSearchDeadlinesInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('validateSearchDeadlinesInteractor', () => {
  it('returns the expected errors object on an empty statistic', () => {
    const errors = validateSearchDeadlinesInteractor(applicationContext, {
      deadlineSearch: {},
    });

    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  it('returns null when there are no errors', () => {
    const result = validateSearchDeadlinesInteractor(applicationContext, {
      deadlineSearch: {
        endDate: '01/02/2020',
        startDate: '01/01/2020',
      },
    });

    expect(result).toEqual(null);
  });
});
