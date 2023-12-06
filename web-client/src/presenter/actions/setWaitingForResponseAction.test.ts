import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setWaitingForResponseAction } from './setWaitingForResponseAction';

describe('setWaitingForResponseAction', () => {
  it('increments request count and sets waiting to true', async () => {
    const result = await runAction(setWaitingForResponseAction, {
      modules: {
        presenter,
      },
      state: {
        progressIndicator: {
          waitText: 'testing',
          waitingForResponse: false,
          waitingForResponseRequests: 0,
        },
      },
    });
    expect(result.state.progressIndicator).toMatchObject({
      waitText: 'testing',
      waitingForResponse: true,
      waitingForResponseRequests: 1,
    });
  });
});
