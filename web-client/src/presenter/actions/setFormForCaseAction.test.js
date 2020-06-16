import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setFormForCaseAction } from './setFormForCaseAction';

describe('setFormForCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('splits the irsNoticeDate, receivedAt, petitionPaymentDate, and petitionPaymentWaivedDate for a paper case', async () => {
    const result = await runAction(setFormForCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          irsNoticeDate: '2019-03-01T21:40:46.415Z',
          isPaper: true,
          petitionPaymentDate: '2019-05-01T21:40:46.415Z',
          petitionPaymentWaivedDate: '2019-07-01T21:40:46.415Z',
          receivedAt: '2019-03-01T05:00:00.000Z',
        },
      },
      state: { form: {} },
    });
    expect(result.state.form).toEqual({
      irsDay: '1',
      irsMonth: '3',
      irsYear: '2019',
      paymentDateDay: '1',
      paymentDateMonth: '5',
      paymentDateWaivedDay: '1',
      paymentDateWaivedMonth: '7',
      paymentDateWaivedYear: '2019',
      paymentDateYear: '2019',
      receivedAtDay: '1',
      receivedAtMonth: '3',
      receivedAtYear: '2019',
    });
  });

  it('does not split receivedAt date onto the form for a non-paper case', async () => {
    const result = await runAction(setFormForCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          isPaper: false,
          receivedAt: '2019-03-01T05:00:00.000Z',
        },
      },
      state: { form: {} },
    });
    expect(result.state.form).toEqual({});
  });

  it('retrieves the caseDetail from state if it is not on props', async () => {
    const result = await runAction(setFormForCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsNoticeDate: '2019-03-01T21:40:46.415Z',
          isPaper: false,
        },
        form: {},
      },
    });
    expect(result.state.form).toEqual({
      irsDay: '1',
      irsMonth: '3',
      irsYear: '2019',
    });
  });

  it('splits the lastDateOfPeriod into month/day/year fields for statistics', async () => {
    const statistics = [
      {
        lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
      },
      {
        year: '2012',
      },
      {
        lastDateOfPeriod: 'not a date',
      },
    ];

    const result = await runAction(setFormForCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          statistics,
        },
      },
      state: {
        form: {
          statistics,
        },
      },
    });
    expect(result.state.form.statistics[0]).toMatchObject({
      lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
      lastDateOfPeriodDay: '1',
      lastDateOfPeriodMonth: '3',
      lastDateOfPeriodYear: '2019',
    });
    expect(result.state.form.statistics[1]).toEqual({
      year: '2012',
    });
    expect(result.state.form.statistics[2]).toEqual({
      lastDateOfPeriod: 'not a date',
    });
  });
});
