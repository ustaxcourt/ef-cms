import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { computePetitionDatesAction } from './computePetitionDatesAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('computePetitionDatesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set petitionPaymentDate, petitionPaymentWaivedDate, and irsNoticeDate to undefined if state.form is empty', async () => {
    const result = await runAction(computePetitionDatesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(result.output.irsNoticeDate).toEqual(undefined);
    expect(result.output.petitionPaymentDate).toEqual(undefined);
    expect(result.output.petitionPaymentWaivedDate).toEqual(undefined);
  });

  it('should set petitionPaymentDate, petitionPaymentWaivedDate, and irsNoticeDate to ISO string if state.form has year, month, and day', async () => {
    const result = await runAction(computePetitionDatesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          irsDay: '5',
          irsMonth: '4',
          irsYear: '2012',
          paymentDateDay: '06',
          paymentDateMonth: '09',
          paymentDateWaivedDay: '7',
          paymentDateWaivedMonth: '09',
          paymentDateWaivedYear: '2020',
          paymentDateYear: '2019',
        },
      },
    });

    expect(result.output.irsNoticeDate).toEqual('2012-04-05T04:00:00.000Z');
    expect(result.output.petitionPaymentDate).toEqual(
      '2019-09-06T04:00:00.000Z',
    );
    expect(result.output.petitionPaymentWaivedDate).toEqual(
      '2020-09-07T04:00:00.000Z',
    );
  });

  it('should set petitionPaymentDate, petitionPaymentWaivedDate, and irsNoticeDate to undefined if state.form has invalid dates', async () => {
    const result = await runAction(computePetitionDatesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          irsDay: '35',
          irsMonth: '4',
          irsYear: '2012',
          paymentDateDay: '06',
          paymentDateMonth: '13',
          paymentDateWaivedDay: '7',
          paymentDateWaivedMonth: '09',
          paymentDateWaivedYear: '1',
          paymentDateYear: '2020',
        },
      },
    });

    expect(result.output.irsNoticeDate).toEqual(undefined);
    expect(result.output.petitionPaymentDate).toEqual(undefined);
    expect(result.output.petitionPaymentWaivedDate).toEqual(undefined);
  });
});
