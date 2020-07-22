import { chooseWorkQueueAction } from './chooseWorkQueueAction';
import { runAction } from 'cerebral/test';

describe('chooseWorkQueueAction', () => {
  let providers;
  beforeAll(() => {
    providers = {
      path: {
        documentqcmycardboard: jest.fn(),
        documentqcmyoutbox: jest.fn(),
        messagesmyinbox: jest.fn(),
        messagessomethinginbox: jest.fn(),
      },
    };
  });
  it('sets the workQueueIsInternal to value from props if provided and executes default work queue path', async () => {
    const result = await runAction(chooseWorkQueueAction, {
      props: {
        workQueueIsInternal: true,
      },
      providers,
      state: {},
    });

    expect(result.state.workQueueToDisplay.workQueueIsInternal).toEqual(true);
    expect(providers.path.messagesmyinbox).toHaveBeenCalled();
  });

  it('combines provided props.queue with defaults to select correct work queue path', async () => {
    const result = await runAction(chooseWorkQueueAction, {
      props: {
        queue: 'something',
      },
      providers,
      state: {},
    });

    expect(result.state.workQueueToDisplay.queue).toEqual('something');
    expect(providers.path.messagessomethinginbox).toHaveBeenCalled();
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
          workQueueIsInternal: false,
        },
      },
    });

    expect(result.state.workQueueToDisplay.box).toEqual('cardboard');
    expect(providers.path.documentqcmycardboard).toHaveBeenCalled();
  });
});
