import { PAYMENT_STATUS } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setupEditPetitionDetailFormAction } from './setupEditPetitionDetailFormAction';

describe('setupEditPetitionDetailFormAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set payment waived date on the form when it is defined', async () => {
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
      petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
      petitionPaymentWaivedDate: '2019-03-01T21:40:46.415Z',
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Small',
    });
  });

  it('should set payment paid date on the form when it is defined', async () => {
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
      petitionPaymentDate: '2019-03-01T21:40:46.415Z',
      petitionPaymentStatus: PAYMENT_STATUS.PAID,
    });
  });

  it('should set IRS notice date on the form when it is defined', async () => {
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

    expect(result.state.form.irsNoticeDate).toEqual('2019-03-01T21:40:46.415Z');
  });

  it('should set hasVerifiedIrsNotice on the form from caseDetail', async () => {
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

  it('should set statistics on the form from caseDetail', async () => {
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
});
