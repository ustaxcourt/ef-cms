import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setWaitingForResponseAction } from './setWaitingForResponseAction';

describe('setWaitingForResponseAction', () => {
  it('increments request count and sets waiting to true', async () => {
    const result = await runAction(setWaitingForResponseAction, {
      modules: {
        presenter,
      },
      state: {
        progressIndicator: {
          waitingForResponse: false,
          waitingForResponseRequests: 0,
        },
      },
    });
    expect(result.state.progressIndicator).toMatchObject({
      waitingForResponse: true,
      waitingForResponseRequests: 1,
    });
  });
});
