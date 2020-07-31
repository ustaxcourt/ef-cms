import { chooseWorkQueueAction } from './chooseWorkQueueAction';
import { runAction } from 'cerebral/test';

describe('chooseWorkQueueAction', () => {
  let providers;
  beforeAll(() => {
    providers = {
      path: {
        documentqcmycardboard: jest.fn(),
        documentqcmyoutbox: jest.fn(),
      },
    };
  });
  it('throws an exception if the work queue path cannot be found', async () => {
    await expect(
      runAction(chooseWorkQueueAction, {
        props: {
          box: 'wooden',
          queue: 'de Lancie',
        },
        providers,
        state: {},
      }),
    ).rejects.toThrow();
  });

  it('combines provided props.box with defaults and state to select correct work queue path', async () => {
    const result = await runAction(chooseWorkQueueAction, {
      props: {
        box: 'cardboard',
      },
      providers,
      state: {
        workQueueToDisplay: {
          box: 'something',
        },
      },
    });

    expect(result.state.workQueueToDisplay.box).toEqual('cardboard');
    expect(providers.path.documentqcmycardboard).toHaveBeenCalled();
  });
});
