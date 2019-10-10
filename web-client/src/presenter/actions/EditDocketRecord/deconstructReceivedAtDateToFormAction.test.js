import { applicationContext } from '../../../applicationContext';
import { deconstructReceivedAtDateToFormAction } from './deconstructReceivedAtDateToFormAction';
import { prepareDateFromString } from '../../../../../shared/src/business/utilities/DateHandler';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('deconstructReceivedAtDateToFormAction', () => {
  it('deconstructs the date', async () => {
    const result = await runAction(deconstructReceivedAtDateToFormAction, {
      modules: {
        presenter: {
          providers: {
            applicationContext: {
              getUtilities: () => ({
                prepareDateFromString,
              }),
            },
          },
        },
      },
      props: {
        docketEntry: {
          receivedAt: '2010-12-25',
        },
      },
    });

    expect(result.state.form).toEqual({
      dateReceivedDay: '25',
      dateReceivedMonth: '12',
      dateReceivedYear: '2010',
    });
  });
});
