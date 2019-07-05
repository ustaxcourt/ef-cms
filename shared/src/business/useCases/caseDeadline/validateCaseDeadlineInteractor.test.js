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

  it('returns the null when there are no errors', () => {
    const mockCaseDeadline = {
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      deadlineDate: '2019-03-01T21:42:29.073Z',
      description: 'hello world',
    };

    const errors = validateCaseDeadlineInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseDeadline,
        }),
      },
      caseDeadline: mockCaseDeadline,
    });

    expect(errors).toEqual(null);
  });
});
