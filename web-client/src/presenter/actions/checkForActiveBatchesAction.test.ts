import { checkForActiveBatchesAction } from './checkForActiveBatchesAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('checkForActiveBatchesAction', () => {
  let presenter;

  beforeAll(() => {
    presenter = {
      providers: {
        path: {
          hasActiveBatches: jest.fn(),
          noActiveBatches: jest.fn(),
        },
      },
    };
  });

  it('should call hasActiveBatches when there are any batches with a length > 0', async () => {
    await runAction(checkForActiveBatchesAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'certificateOfService',
      },
      state: {
        scanner: {
          batches: {
            petition: [
              {
                index: 1,
              },
            ],
          },
        },
      },
    });

    expect(presenter.providers.path.hasActiveBatches).toHaveBeenCalled();
  });

  it('should call noActiveBatches when there are any batches with a length > 0', async () => {
    await runAction(checkForActiveBatchesAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'certificateOfService',
      },
      state: {
        scanner: {
          batches: {
            petition: [],
          },
        },
      },
    });

    expect(presenter.providers.path.noActiveBatches).toHaveBeenCalled();
  });
});
