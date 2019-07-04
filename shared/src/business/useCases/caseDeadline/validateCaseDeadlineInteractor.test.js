const {
  validateCaseDeadlineInteractor,
} = require('./validateCaseDeadlineInteractor');
const { CaseDeadline } = require('../../entities/CaseDeadline');

describe('validateCaseDeadlineInteractor', () => {
  it('returns the expected errors object on an empty case deadline', () => {
    const errors = validateCaseDeadlineInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseDeadline,
        }),
      },
      caseDeadline: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(CaseDeadline.errorToMessageMap),
    );
  });
});
