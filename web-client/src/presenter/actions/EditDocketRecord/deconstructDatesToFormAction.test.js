import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deconstructDatesToFormAction } from './deconstructDatesToFormAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('deconstructDatesToFormAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('deconstructs the date', async () => {
    const result = await runAction(deconstructDatesToFormAction, {
      modules: {
        presenter: {
          providers: {
            applicationContext,
          },
        },
      },
      props: {
        docketEntry: {
          certificateOfServiceDate: '2011-10-11',
          receivedAt: '2005-02-05',
          secondaryDocument: {
            serviceDate: '2008-09-10',
          },
          serviceDate: '2010-12-25',
        },
      },
    });

    expect(result.state.form).toEqual({
      certificateOfServiceDay: '11',
      certificateOfServiceMonth: '10',
      certificateOfServiceYear: '2011',
      dateReceivedDay: '5',
      dateReceivedMonth: '2',
      dateReceivedYear: '2005',
      day: '25',
      month: '12',
      secondaryDocument: {
        day: '10',
        month: '9',
        year: '2008',
      },
      year: '2010',
    });
  });
  it('deconstructs no dates', async () => {
    const result = await runAction(deconstructDatesToFormAction, {
      modules: {
        presenter: {
          providers: {
            applicationContext,
          },
        },
      },
      props: {
        docketEntry: {},
      },
    });

    expect(result.state.form).toBeUndefined();
  });
});
