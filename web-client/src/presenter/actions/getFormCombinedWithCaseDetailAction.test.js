import { runAction } from 'cerebral/test';
import getFormCombinedWithCaseDetailAction from './getFormCombinedWithCaseDetailAction';
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
        form: {
          irsYear: '2009',
          irsMonth: '01',
          irsDay: '01',
          payGovYear: '2009',
          payGovMonth: '01',
          payGovDay: '01',
        },
        caseDetail: {
          yearAmounts: [
            {
              year: '2009',
              amount: 1,
            },
            {
              year: '2010',
              amount: '2',
            },
            {
              year: '2011',
              amount: '110,322.432',
            },
          ],
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

  it('should leave the dates as blank if they are invalid', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        form: {
          irsYear: 'x',
          irsMonth: '01',
          irsDay: '01',
          payGovYear: 'x',
          payGovMonth: '01',
          payGovDay: '01',
        },
        caseDetail: {
          yearAmounts: [
            {
              year: 'x',
              amount: 1,
            },
            {
              year: '2010',
              amount: '2',
            },
            {
              year: '2011',
              amount: '110,322.432',
            },
          ],
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

  it('should not delete the date if it was present and partially modified', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        form: {
          irsYear: '',
          irsMonth: '12',
          irsDay: '24',
          payGovYear: '',
          payGovMonth: '12',
          payGovDay: '24',
        },
        caseDetail: {
          irsNoticeDate: '2018-12-24T00:00:00.000Z',
          payGovDate: '2018-12-24T00:00:00.000Z',
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
  it('should not delete the date if it was present and partially modified', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        form: {
          irsYear: '',
          irsMonth: '',
          irsDay: '24',
          payGovYear: '',
          payGovMonth: '12',
          payGovDay: '24',
        },
        caseDetail: {
          irsNoticeDate: null,
          payGovDate: '2018-12-24T00:00:00.000Z',
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

  it('should delete the date if it was present and the user removed it', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        form: {
          irsYear: '',
          irsMonth: '',
          irsDay: '',
          payGovYear: '',
          payGovMonth: '',
          payGovDay: '',
        },
        caseDetail: {
          irsNoticeDate: '2018-12-24T00:00:00.000Z',
          payGovDate: '2018-12-24T00:00:00.000Z',
        },
      },
    });
    expect(results.output.combinedCaseDetailWithForm.irsNoticeDate).toEqual(
      null,
    );
    expect(results.output.combinedCaseDetailWithForm.payGovDate).toEqual(null);
  });

  it('should delete the date if it was present and the user removed it', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        form: {
          irsYear: 'notayear',
          irsMonth: '12',
          irsDay: '12',
          payGovYear: '',
          payGovMonth: '',
          payGovDay: '',
        },
        caseDetail: {
          // irsNoticeDate: '2018-12-24T00:00:00.000Z',
          payGovDate: '2018-12-24T00:00:00.000Z',
        },
      },
    });
    expect(results.output.combinedCaseDetailWithForm.irsNoticeDate).toEqual(
      '-1',
    );
    // expect(results.output.combinedCaseDetailWithForm.payGovDate).toEqual(null);
  });
});
