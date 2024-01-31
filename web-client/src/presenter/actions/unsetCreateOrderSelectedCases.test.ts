import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetCreateOrderSelectedCases } from '@web-client/presenter/actions/unsetCreateOrderSelectedCases';

describe('unsetCreateOrderSelectedCases', () => {
  it('should unset state for createOrderSelectedCases', async () => {
    const { state } = await runAction(unsetCreateOrderSelectedCases, {
      state: {
        createOrderSelectedCases: 'bloooop',
      },
    });

    expect(state.createOrderSelectedCases).toBeUndefined();
  });
});
