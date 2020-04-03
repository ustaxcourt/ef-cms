import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { castToISO } from './getCaseDetailFormWithComputedDatesAction';
import { getCaseDetailFormWithComputedDatesAction } from './getCaseDetailFormWithComputedDatesAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

const modules = { presenter };

describe('castToISO', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });
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

  it('returns an iso string for 01-01-2009 when the date string of 2009 is passed in', () => {
    expect(castToISO(applicationContext, '2009')).toEqual(
      '2009-01-01T05:00:00.000Z',
    );
  });

  it('returns null when the date string passed in is invalid', () => {
    expect(castToISO(applicationContext, 'x-10-10')).toEqual('-1');
  });

  it('returns null when the date string passed in is an empty string', () => {
    expect(castToISO(applicationContext, '')).toEqual(null);
  });

  it('returns the same iso string passed in when an iso string is passed in', () => {
    expect(castToISO(applicationContext, '1990-01-01T05:00:00.000Z')).toEqual(
      '1990-01-01T05:00:00.000Z',
    );
  });
});

describe('getCaseDetailFormWithComputedDatesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });
  it('should return the expected combined caseDetail after run', async () => {
    const results = await runAction(getCaseDetailFormWithComputedDatesAction, {
      modules,
      state: {
        constants: {
          CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
        },
        form: {
          irsDay: '01',
          irsMonth: '01',
          irsYear: '2009',
          paymentDateDay: '01',
          paymentDateMonth: '01',
          paymentDateWaivedDay: '01',
          paymentDateWaivedMonth: '01',
          paymentDateWaivedYear: '2009',
          paymentDateYear: '2009',
          receivedAtDay: '03',
          receivedAtMonth: '03',
          receivedAtYear: '2009',
        },
      },
    });
    expect(results.output).toEqual({
      formWithComputedDates: {
        irsNoticeDate: '2009-01-01T05:00:00.000Z',
        petitionPaymentDate: '2009-01-01T05:00:00.000Z',
        petitionPaymentWaivedDate: '2009-01-01T05:00:00.000Z',
        receivedAt: '2009-03-03T05:00:00.000Z',
      },
    });
  });

  it('should leave the dates as -1 if they are invalid', async () => {
    const results = await runAction(getCaseDetailFormWithComputedDatesAction, {
      modules,
      state: {
        constants: {
          CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
        },
        form: {
          irsDay: '01',
          irsMonth: '01',
          irsYear: 'x',
          paymentDateDay: '01',
          paymentDateMonth: '01',
          paymentDateWaivedDay: '01',
          paymentDateWaivedMonth: '01',
          paymentDateWaivedYear: 'x',
          paymentDateYear: 'x',
          receivedAtDay: '01',
          receivedAtMonth: '01',
          receivedAtYear: 'x',
        },
      },
    });
    expect(results.output).toEqual({
      formWithComputedDates: {
        irsNoticeDate: '-1',
        petitionPaymentDate: '-1',
        petitionPaymentWaivedDate: '-1',
        receivedAt: '-1',
      },
    });
  });

  it('should delete the date if year is missing', async () => {
    const results = await runAction(getCaseDetailFormWithComputedDatesAction, {
      modules,

      state: {
        constants: {
          CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
        },
        form: {
          irsDay: '24',
          irsMonth: '12',
          irsNoticeDate: '2018-12-24T05:00:00.000Z',
          irsYear: '',
          paymentDateDay: '24',
          paymentDateMonth: '12',
          paymentDateWaivedDay: '24',
          paymentDateWaivedMonth: '12',
          paymentDateWaivedYear: '',
          paymentDateYear: '',
          petitionPaymentDate: '2018-12-24T05:00:00.000Z',
          petitionPaymentWaivedDate: '2018-12-24T05:00:00.000Z',
          receivedAt: '2018-12-24T05:00:00.000Z',
          receivedAtDay: '24',
          receivedAtMonth: '12',
          receivedAtYear: '',
        },
      },
    });
    expect(results.output).toEqual({
      formWithComputedDates: {
        irsNoticeDate: null,
        petitionPaymentDate: null,
        petitionPaymentWaivedDate: null,
        receivedAt: null,
      },
    });
  });

  it('should delete the date if year and month are missing', async () => {
    const results = await runAction(getCaseDetailFormWithComputedDatesAction, {
      modules,

      state: {
        constants: {
          CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
        },
        form: {
          irsDay: '24',
          irsMonth: '',
          irsNoticeDate: null,
          irsYear: '',
          paymentDateDay: '24',
          paymentDateMonth: '',
          paymentDateWaivedDay: '24',
          paymentDateWaivedMonth: '',
          paymentDateWaivedYear: '',
          paymentDateYear: '',
          petitionPaymentDate: '2018-12-24T05:00:00.000Z',
          petitionPaymentWaivedDate: '2018-12-24T05:00:00.000Z',
          receivedAt: '2018-12-24T05:00:00.000Z',
          receivedAtDay: '24',
          receivedAtMonth: '',
          receivedAtYear: '',
        },
      },
    });
    expect(results.output).toEqual({
      formWithComputedDates: {
        irsNoticeDate: null,
        petitionPaymentDate: null,
        petitionPaymentWaivedDate: null,
        receivedAt: null,
      },
    });
  });

  it('clears the irsNoticeDate and petitionPaymentDate and receivedAt to null if it was once defined and the user clears the fields', async () => {
    const results = await runAction(getCaseDetailFormWithComputedDatesAction, {
      modules,

      state: {
        constants: {
          CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
        },
        form: {
          irsDay: '',
          irsMonth: '',
          irsNoticeDate: '2018-12-24T05:00:00.000Z',
          irsYear: '',
          paymentDateDay: '',
          paymentDateMonth: '',
          paymentDateWaivedDay: '',
          paymentDateWaivedMonth: '',
          paymentDateWaivedYear: '',
          paymentDateYear: '',
          petitionPaymentDate: '2018-12-24T05:00:00.000Z',
          petitionPaymentWaivedDate: '2018-12-24T05:00:00.000Z',
          receivedAt: '2018-12-24T05:00:00.000Z',
          receivedAtDay: '',
          receivedAtMonth: '',
          receivedAtYear: '',
        },
      },
    });
    expect(results.output.formWithComputedDates.irsNoticeDate).toEqual(null);
    expect(results.output.formWithComputedDates.petitionPaymentDate).toEqual(
      null,
    );
    expect(
      results.output.formWithComputedDates.petitionPaymentWaivedDate,
    ).toEqual(null);
    expect(results.output.formWithComputedDates.receivedAt).toEqual(null);
  });

  it('deletes the petitionPaymentDate if the user cleared the form', async () => {
    const results = await runAction(getCaseDetailFormWithComputedDatesAction, {
      modules,

      state: {
        constants: {
          CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
        },
        form: {
          // irsNoticeDate: '2018-12-24T05:00:00.000Z',
          irsDay: '12',
          irsMonth: '12',
          irsYear: 'notayear',
          paymentDateDay: '',
          paymentDateMonth: '',
          paymentDateYear: '',
          petitionPaymentDate: '2018-12-24T05:00:00.000Z',
        },
      },
    });
    expect(results.output.formWithComputedDates.irsNoticeDate).toEqual('-1');
    expect(results.output.formWithComputedDates.petitionPaymentDate).toEqual(
      null,
    );
  });
});
