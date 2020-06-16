import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { computePetitionFeeDatesAction } from './computePetitionFeeDatesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('computePetitionFeeDatesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('creates date from form month, day, year fields', async () => {
    const result = await runAction(computePetitionFeeDatesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          paymentDateDay: '02',
          paymentDateMonth: '02',
          paymentDateWaivedDay: '01',
          paymentDateWaivedMonth: '01',
          paymentDateWaivedYear: '2001',
          paymentDateYear: '2002',
        },
      },
    });

    expect(result.output).toEqual({
      petitionPaymentDate: '2002-02-02T05:00:00.000Z',
      petitionPaymentWaivedDate: '2001-01-01T05:00:00.000Z',
    });
  });

  it('returns undefined for dates if the month/day/year combos are invalid', async () => {
    const result = await runAction(computePetitionFeeDatesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          paymentDateDay: '45',
          paymentDateMonth: '02',
          paymentDateWaivedDay: '01',
          paymentDateWaivedMonth: '29',
          paymentDateWaivedYear: '2001',
          paymentDateYear: '2002',
        },
      },
    });

    expect(result.output).toEqual({
      petitionPaymentDate: undefined,
      petitionPaymentWaivedDate: undefined,
    });
  });
});
