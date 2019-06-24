import { CASE_CAPTION_POSTFIX } from '../../../../shared/src/business/entities/Case';
import { applicationContext } from '../../applicationContext';
import { castToISO } from './getFormCombinedWithCaseDetailAction';
import { getFormCombinedWithCaseDetailAction } from './getFormCombinedWithCaseDetailAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const modules = { presenter };
presenter.providers.applicationContext = applicationContext;

describe('castToISO', () => {
  it('returns an iso string when the date string passed in is valid', () => {
    expect(castToISO(applicationContext, '2010-10-10')).toEqual(
      '2010-10-10T04:00:00.000Z',
    );
  });

  it('returns an iso string when the date string of 2009-01-01 passed in is valid', () => {
    expect(castToISO(applicationContext, '2009-01-01')).toEqual(
      '2009-01-01T05:00:00.000Z',
    );
  });

  it('returns null when the date string passed in is invalid', () => {
    expect(castToISO(applicationContext, 'x-10-10')).toEqual('-1');
  });

  it('returns the same iso string passed in when an iso string is passed in', () => {
    expect(castToISO(applicationContext, '1990-01-01T05:00:00.000Z')).toEqual(
      '1990-01-01T05:00:00.000Z',
    );
  });
});

describe('getFormCombinedWithCaseDetailAction', () => {
  it('should return the expected combined caseDetail after run', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      modules,
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
        constants: {
          CASE_CAPTION_POSTFIX,
        },
        form: {
          irsDay: '01',
          irsMonth: '01',
          irsYear: '2009',
          payGovDay: '01',
          payGovMonth: '01',
          payGovYear: '2009',
          receivedAtDay: '03',
          receivedAtMonth: '03',
          receivedAtYear: '2009',
        },
      },
    });
    expect(results.output).toEqual({
      combinedCaseDetailWithForm: {
        irsNoticeDate: '2009-01-01T05:00:00.000Z',
        payGovDate: '2009-01-01T05:00:00.000Z',
        payGovId: undefined,
        receivedAt: '2009-03-03T05:00:00.000Z',
        yearAmounts: [
          {
            amount: '1',
            year: '2009-01-01T05:00:00.000Z',
          },
          {
            amount: '2',
            year: '2010-01-01T05:00:00.000Z',
          },
          {
            amount: '110322',
            year: '2011-01-01T05:00:00.000Z',
          },
        ],
      },
    });
  });

  it('should leave the dates as -1 if they are invalid', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      modules,
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
        constants: {
          CASE_CAPTION_POSTFIX,
        },
        form: {
          irsDay: '01',
          irsMonth: '01',
          irsYear: 'x',
          payGovDay: '01',
          payGovMonth: '01',
          payGovYear: 'x',
          receivedAtDay: '01',
          receivedAtMonth: '01',
          receivedAtYear: 'x',
        },
      },
    });
    expect(results.output).toEqual({
      combinedCaseDetailWithForm: {
        irsNoticeDate: '-1',
        payGovDate: '-1',
        payGovId: undefined,
        receivedAt: '-1',
        yearAmounts: [
          {
            amount: '1',
            year: '-1',
          },
          {
            amount: '2',
            year: '2010-01-01T05:00:00.000Z',
          },
          {
            amount: '110322',
            year: '2011-01-01T05:00:00.000Z',
          },
        ],
      },
    });
  });

  it('should not delete the date if year is missing', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      modules,

      state: {
        caseDetail: {
          irsNoticeDate: '2018-12-24T05:00:00.000Z',
          payGovDate: '2018-12-24T05:00:00.000Z',
          receivedAt: '2018-12-24T05:00:00.000Z',
          yearAmounts: [],
        },
        constants: {
          CASE_CAPTION_POSTFIX,
        },
        form: {
          irsDay: '24',
          irsMonth: '12',
          irsYear: '',
          payGovDay: '24',
          payGovMonth: '12',
          payGovYear: '',
          receivedAtDay: '24',
          receivedAtMonth: '12',
          receivedAtYear: '',
        },
      },
    });
    expect(results.output).toEqual({
      combinedCaseDetailWithForm: {
        irsNoticeDate: '2018-12-24T05:00:00.000Z',
        payGovDate: '2018-12-24T05:00:00.000Z',
        payGovId: undefined,
        receivedAt: '2018-12-24T05:00:00.000Z',
        yearAmounts: [],
      },
    });
  });
  it('should not delete the date if year and month are missing', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      modules,

      state: {
        caseDetail: {
          irsNoticeDate: null,
          payGovDate: '2018-12-24T05:00:00.000Z',
          receivedAt: '2018-12-24T05:00:00.000Z',
          yearAmounts: [],
        },
        constants: {
          CASE_CAPTION_POSTFIX,
        },
        form: {
          irsDay: '24',
          irsMonth: '',
          irsYear: '',
          payGovDay: '24',
          payGovMonth: '',
          payGovYear: '',
          receivedAtDay: '24',
          receivedAtMonth: '',
          receivedAtYear: '',
        },
      },
    });
    expect(results.output).toEqual({
      combinedCaseDetailWithForm: {
        irsNoticeDate: null,
        payGovDate: '2018-12-24T05:00:00.000Z',
        payGovId: undefined,
        receivedAt: '2018-12-24T05:00:00.000Z',
        yearAmounts: [],
      },
    });
  });

  it('clears the irsNoticeDate and payGovDate and receivedAt to null if it was once defined and the user clears the fields', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      modules,

      state: {
        caseDetail: {
          irsNoticeDate: '2018-12-24T05:00:00.000Z',
          payGovDate: '2018-12-24T05:00:00.000Z',
          receivedAt: '2018-12-24T05:00:00.000Z',
          yearAmounts: [],
        },
        constants: {
          CASE_CAPTION_POSTFIX,
        },
        form: {
          irsDay: '',
          irsMonth: '',
          irsYear: '',
          payGovDay: '',
          payGovMonth: '',
          payGovYear: '',
          receivedAtDay: '',
          receivedAtMonth: '',
          receivedAtYear: '',
        },
      },
    });
    expect(results.output.combinedCaseDetailWithForm.irsNoticeDate).toEqual(
      null,
    );
    expect(results.output.combinedCaseDetailWithForm.payGovDate).toEqual(null);
    expect(results.output.combinedCaseDetailWithForm.receivedAt).toEqual(null);
  });

  it('delets the payGovDate if the user cleared the form', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      modules,

      state: {
        caseDetail: {
          // irsNoticeDate: '2018-12-24T05:00:00.000Z',
          payGovDate: '2018-12-24T05:00:00.000Z',
          yearAmounts: [],
        },
        constants: {
          CASE_CAPTION_POSTFIX,
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
