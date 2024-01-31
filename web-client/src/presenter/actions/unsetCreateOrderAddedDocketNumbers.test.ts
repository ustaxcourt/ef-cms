import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetCreateOrderAddedDocketNumbers } from '@web-client/presenter/actions/unsetCreateOrderAddedDocketNumbers';

describe('unsetCreateOrderAddedDocketNumbers', () => {
  it('should unset state for createOrderAddedDocketNumbers', async () => {
    const { state } = await runAction(unsetCreateOrderAddedDocketNumbers, {
      state: {
        createOrderAddedDocketNumbers: 'bloooop',
      },
    });

    expect(state.createOrderAddedDocketNumbers).toBeUndefined();
  });
});
