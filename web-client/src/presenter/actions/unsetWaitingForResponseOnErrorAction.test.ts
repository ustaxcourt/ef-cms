import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetWaitingForResponseOnErrorAction } from './unsetWaitingForResponseOnErrorAction';

describe('unsetWaitingForResponseOnErrorAction', () => {
  it('sets waitingForResponse to false and waitingForResponseRequests to 0', async () => {
    const result = await runAction(unsetWaitingForResponseOnErrorAction, {
      modules: {
        presenter,
      },
      state: {
        progressIndicator: {
          waitingForResponse: true,
          waitingForResponseRequests: 25,
        },
      },
    });
    expect(result.state.progressIndicator).toMatchObject({
      waitingForResponse: false,
      waitingForResponseRequests: 0,
    });
  });
});
