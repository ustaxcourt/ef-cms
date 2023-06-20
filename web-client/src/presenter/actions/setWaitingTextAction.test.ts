import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setWaitingTextAction } from './setWaitingTextAction';

describe('setWaitingTextAction', () => {
  it('should set the wait text when invoked with a string', async () => {
    const EXPECTED_WAIT_TEXT = 'This is the wait text';
    const result = await runAction(setWaitingTextAction(EXPECTED_WAIT_TEXT), {
      modules: {
        presenter,
      },
      state: {
        progressIndicator: {
          waitText: undefined,
        },
      },
    });
    expect(result.state.progressIndicator.waitText).toEqual(EXPECTED_WAIT_TEXT);
  });
});
