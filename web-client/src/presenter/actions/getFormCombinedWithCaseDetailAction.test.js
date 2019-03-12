import { runAction } from 'cerebral/test';
import { getFormCombinedWithCaseDetailAction } from './getFormCombinedWithCaseDetailAction';
import { castToISO } from './getFormCombinedWithCaseDetailAction';

describe('castToISO', () => {
  it('returns an iso string when the date string passed in is valid', () => {
    expect(castToISO('2010-10-10')).toEqual('2010-10-10T00:00:00.000Z');
  });

  it('returns an iso string when the date string of 2009-01-01 passed in is valid', () => {
    expect(castToISO('2009-01-01')).toEqual('2009-01-01T00:00:00.000Z');
  });

  it('returns null when the date string passed in is invalid', () => {
    expect(castToISO('x-10-10')).toEqual('-1');
  });

  it('returns the same iso string passed in when an iso string is passed in', () => {
    expect(castToISO('1990-01-01T00:00:00.000Z')).toEqual(
      '1990-01-01T00:00:00.000Z',
    );
  });
});

describe('getFormCombinedWithCaseDetailAction', async () => {
  it('should return the expected combined caseDetail after run', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        caseDetail: {
          yearAmounts: [
            {
              amount: 1,
              year: '2009',
            },
            {
              amount: '2',
              year: '2010',
            },
            {
              amount: '110,322.432',
              year: '2011',
            },
          ],
        },
        form: {
          irsDay: '01',
          irsMonth: '01',
          irsYear: '2009',
          payGovDay: '01',
          payGovMonth: '01',
          payGovYear: '2009',
        },
      },
    });
    expect(results.output).toEqual({
      combinedCaseDetailWithForm: {
        irsNoticeDate: '2009-01-01T00:00:00.000Z',
        payGovDate: '2009-01-01T00:00:00.000Z',
        yearAmounts: [
          {
            amount: '1',
            year: '2009-01-01T00:00:00.000Z',
          },
          {
            amount: '2',
            year: '2010-01-01T00:00:00.000Z',
          },
          {
            amount: '110322',
            year: '2011-01-01T00:00:00.000Z',
          },
        ],
      },
    });
  });

  it('should leave the dates as -1 if they are invalid', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        caseDetail: {
          yearAmounts: [
            {
              amount: 1,
              year: 'x',
            },
            {
              amount: '2',
              year: '2010',
            },
            {
              amount: '110,322.432',
              year: '2011',
            },
          ],
        },
        form: {
          irsDay: '01',
          irsMonth: '01',
          irsYear: 'x',
          payGovDay: '01',
          payGovMonth: '01',
          payGovYear: 'x',
        },
      },
    });
    expect(results.output).toEqual({
      combinedCaseDetailWithForm: {
        irsNoticeDate: '-1',
        payGovDate: '-1',
        yearAmounts: [
          {
            amount: '1',
            year: '-1',
          },
          {
            amount: '2',
            year: '2010-01-01T00:00:00.000Z',
          },
          {
            amount: '110322',
            year: '2011-01-01T00:00:00.000Z',
          },
        ],
      },
    });
  });

  it('should not delete the date if year is missing', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        caseDetail: {
          irsNoticeDate: '2018-12-24T00:00:00.000Z',
          payGovDate: '2018-12-24T00:00:00.000Z',
          yearAmounts: [],
        },
        form: {
          irsDay: '24',
          irsMonth: '12',
          irsYear: '',
          payGovDay: '24',
          payGovMonth: '12',
          payGovYear: '',
        },
      },
    });
    expect(results.output).toEqual({
      combinedCaseDetailWithForm: {
        irsNoticeDate: '2018-12-24T00:00:00.000Z',
        payGovDate: '2018-12-24T00:00:00.000Z',
        payGovId: undefined,
        yearAmounts: [],
      },
    });
  });
  it('should not delete the date if year and month are missing', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        caseDetail: {
          irsNoticeDate: null,
          payGovDate: '2018-12-24T00:00:00.000Z',
          yearAmounts: [],
        },
        form: {
          irsDay: '24',
          irsMonth: '',
          irsYear: '',
          payGovDay: '24',
          payGovMonth: '12',
          payGovYear: '',
        },
      },
    });
    expect(results.output).toEqual({
      combinedCaseDetailWithForm: {
        irsNoticeDate: null,
        payGovDate: '2018-12-24T00:00:00.000Z',
        payGovId: undefined,
        yearAmounts: [],
      },
    });
  });

  it('clears the irsNoticeDate and payGovDate to null if it was once defined and the user clears the fields', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        caseDetail: {
          irsNoticeDate: '2018-12-24T00:00:00.000Z',
          payGovDate: '2018-12-24T00:00:00.000Z',
          yearAmounts: [],
        },
        form: {
          irsDay: '',
          irsMonth: '',
          irsYear: '',
          payGovDay: '',
          payGovMonth: '',
          payGovYear: '',
        },
      },
    });
    expect(results.output.combinedCaseDetailWithForm.irsNoticeDate).toEqual(
      null,
    );
    expect(results.output.combinedCaseDetailWithForm.payGovDate).toEqual(null);
  });

  it('delets the payGovDate if the user cleared the form', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        caseDetail: {
          // irsNoticeDate: '2018-12-24T00:00:00.000Z',
          payGovDate: '2018-12-24T00:00:00.000Z',
          yearAmounts: [],
        },
        form: {
          irsDay: '12',
          irsMonth: '12',
          irsYear: 'notayear',
          payGovDay: '',
          payGovMonth: '',
          payGovYear: '',
        },
      },
    });
    expect(results.output.combinedCaseDetailWithForm.irsNoticeDate).toEqual(
      '-1',
    );
    // expect(results.output.combinedCaseDetailWithForm.payGovDate).toEqual(null);
  });
});
