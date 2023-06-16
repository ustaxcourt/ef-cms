import { runAction } from '@web-client/presenter/test.cerebral';
import { setAddConsolidatedCaseSuccessMessageAction } from './setAddConsolidatedCaseSuccessMessageAction';

describe('setAddConsolidatedCaseSuccessMessageAction', () => {
  it('should update the state from state', async () => {
    const result = await runAction(setAddConsolidatedCaseSuccessMessageAction);

    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Selected cases consolidated.',
      },
    });
  });
});
