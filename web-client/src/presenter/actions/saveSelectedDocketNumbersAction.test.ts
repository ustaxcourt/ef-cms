import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { saveSelectedDocketNumbersAction } from './saveSelectedDocketNumbersAction';

describe('saveSelectedDocketNumbersAction', () => {
  it('should set the docketNumbersWithSuffix into the state.addedDocketNumbers when submitting', async () => {
    const consolidatedCasesToMultiDocketOn = [
      {
        checked: true,
        disabled: false,
        docketNumber: '101-50',
        docketNumberWithSuffix: '101-50S',
      },
      {
        checked: true,
        disabled: false,
        docketNumber: '102-20',
        docketNumberWithSuffix: '102-20P',
      },
    ];

    const { state } = await runAction(saveSelectedDocketNumbersAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        addedDocketNumbers: undefined,
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn,
          },
        },
      },
    });

    expect(state.addedDocketNumbers).toEqual(['101-50S', '102-20P']);
  });
});
