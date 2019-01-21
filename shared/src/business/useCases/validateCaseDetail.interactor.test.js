const { validateCaseDetail } = require('./validateCaseDetail.interactor');

describe('validate case detail', () => {
  it('returns an object containing all errors', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        caseTitle: 'abc',
        docketNumber: '101-18',
        documents: [{}],
        petitioners: [
          {
            name: 'john doe',
          },
        ],
      },
    });
    expect(errors).toBeFalsy();
  });

  it('returns the expected errors when passed bad date objects', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        irsNoticeDate: 'aa',
        payGovDate: '12',
      },
    });
    expect(errors).toBeTruthy();
    expect(errors.irsNoticeDate).toBeTruthy();
    expect(errors.payGovDate).toBeTruthy();
  });
});
