import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { unsetWaitingForResponseAction } from './unsetWaitingForResponseAction';

describe('unsetWaitingForResponseAction', () => {
  it('state of waiting remains unchanged if already false with no requests pending', async () => {
    const result = await runAction(unsetWaitingForResponseAction, {
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
      waitingForResponse: false,
      waitingForResponseRequests: 0,
    });
  });

  it('decrements request count and sets waiting to false if only one remaining', async () => {
    const result = await runAction(unsetWaitingForResponseAction, {
      modules: {
        presenter,
      },
      state: {
        progressIndicator: {
          waitingForResponse: true,
          waitingForResponseRequests: 1,
        },
      },
    });
    expect(result.state.progressIndicator).toMatchObject({
      waitingForResponse: false,
      waitingForResponseRequests: 0,
    });
  });

  it('reduces waiting count only to zero even if number of calls exceed apparent waiting request count', async () => {
    let result = await runAction(unsetWaitingForResponseAction, {
      modules: {
        presenter,
      },
      state: {
        progressIndicator: {
          waitingForResponse: true,
          waitingForResponseRequests: 2, // two requests waiting
        },
      },
    });
    expect(result.state.progressIndicator).toMatchObject({
      waitingForResponse: true,
      waitingForResponseRequests: 1,
    });

    result = await runAction(unsetWaitingForResponseAction, {
      state: {
        progressIndicator: {
          waitingForResponse: true,
          waitingForResponseRequests: 1,
        },
      },
    });
    expect(result.state.progressIndicator).toMatchObject({
      waitingForResponse: false,
      waitingForResponseRequests: 0,
    });

    result = await runAction(unsetWaitingForResponseAction, {
      state: {
        progressIndicator: {
          waitingForResponse: true,
          waitingForResponseRequests: 0,
        },
      },
    });
    // After action has been called 3 times
    expect(result.state.progressIndicator).toMatchObject({
      waitingForResponse: false,
      waitingForResponseRequests: 0,
    });
  });
});
