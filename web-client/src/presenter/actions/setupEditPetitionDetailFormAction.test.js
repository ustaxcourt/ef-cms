import { PAYMENT_STATUS } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setupEditPetitionDetailFormAction } from './setupEditPetitionDetailFormAction';

describe('setupEditPetitionDetailFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the payment waived date on the form as month, day, year if payment status is waived', async () => {
    const result = await runAction(setupEditPetitionDetailFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseType: 'some case type',
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
          petitionPaymentWaivedDate: '2019-03-01T21:40:46.415Z',
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Small',
        },
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      caseType: 'some case type',
      paymentDateWaivedDay: '01',
      paymentDateWaivedMonth: '03',
      paymentDateWaivedYear: '2019',
      petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Small',
    });
  });

  it('sets the payment paid date on the form as month, day, year if payment status is paid', async () => {
    const result = await runAction(setupEditPetitionDetailFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          petitionPaymentDate: '2019-03-01T21:40:46.415Z',
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
        },
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      paymentDateDay: '01',
      paymentDateMonth: '03',
      paymentDateYear: '2019',
      petitionPaymentStatus: PAYMENT_STATUS.PAID,
    });
  });

  it('does not set any dates on the form if payment status is unpaid', async () => {
    const result = await runAction(setupEditPetitionDetailFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        },
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
    });
  });

  it('sets the IRS notice date on the form as month, day, year if it is present', async () => {
    const result = await runAction(setupEditPetitionDetailFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsNoticeDate: '2019-03-01T21:40:46.415Z',
        },
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      irsDay: '01',
      irsMonth: '03',
      irsYear: '2019',
    });
  });

  it('sets hasVerifiedIrsNotice on the form from caseDetail', async () => {
    const result = await runAction(setupEditPetitionDetailFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          hasVerifiedIrsNotice: true,
        },
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      hasVerifiedIrsNotice: true,
    });
  });

  it('sets statistics on the form from caseDetail', async () => {
    const result = await runAction(setupEditPetitionDetailFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          statistics: [{ foo: 'bar' }, { bar: 'baz' }],
        },
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      statistics: [{ foo: 'bar' }, { bar: 'baz' }],
    });
  });

  it('sets lastDateOfPeriod date parts on the form for Period statistics', async () => {
    const result = await runAction(setupEditPetitionDetailFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          statistics: [
            {
              irsDeficiencyAmount: '1.00',
              irsTotalPenalties: '23.00',
              lastDateOfPeriod: '2021-05-10T04:00:00.000Z',
              statisticId: '3b85798f-1fc5-4d94-9a33-09705c23cfec',
              yearOrPeriod: 'Period',
            },
          ],
        },
        form: {},
      },
    });

    expect(result.state.form.statistics).toEqual([
      {
        irsDeficiencyAmount: '1.00',
        irsTotalPenalties: '23.00',
        lastDateOfPeriod: '2021-05-10T04:00:00.000Z',
        lastDateOfPeriodDay: '10',
        lastDateOfPeriodMonth: '5',
        lastDateOfPeriodYear: '2021',
        statisticId: '3b85798f-1fc5-4d94-9a33-09705c23cfec',
        yearOrPeriod: 'Period',
      },
    ]);
  });
});
