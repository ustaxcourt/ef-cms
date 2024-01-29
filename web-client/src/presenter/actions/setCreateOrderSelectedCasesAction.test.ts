import { runAction } from '@web-client/presenter/test.cerebral';
import { setCreateOrderSelectedCasesAction } from '@web-client/presenter/actions/setCreateOrderSelectedCasesAction';

describe('setCreateOrderSelectedCasesAction', () => {
  it('should test', async () => {
    const consolidatedCasesToMultiDocketOn = [
      { checked: true, docketNumberWithSuffix: '101-10' },
      { checked: false, docketNumberWithSuffix: '102-10' },
      { checked: true, docketNumberWithSuffix: '103-10' },
    ];
    const { state } = await runAction(setCreateOrderSelectedCasesAction, {
      state: {
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn,
          },
        },
      },
    });

    expect(state.createOrderSelectedCases).toEqual(
      consolidatedCasesToMultiDocketOn,
    );
    expect(state.createOrderAddedDocketNumbers).toEqual(['101-10', '103-10']);
  });
});
