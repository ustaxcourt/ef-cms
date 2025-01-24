import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { switchErrorActionFactory } from './switchErrorActionFactory';

describe('switchErrorActionFactory', () => {
  presenter.providers.path = {
    default: jest.fn(),
    testing: jest.fn(),
  };

  it('should return path.testing when testing path is passed in for a given error', async () => {
    await runAction(
      switchErrorActionFactory({
        'some error': 'testing',
      }),
      {
        modules: {
          presenter,
        },
        props: {
          error: {
            originalError: {
              response: {
                data: 'some error',
              },
            },
          },
        },
      },
    );

    expect(presenter.providers.path.testing).toHaveBeenCalled();
  });

  it('should return path.default when the error cannot be found', async () => {
    await runAction(
      switchErrorActionFactory({
        'some error': 'test',
      }),
      {
        modules: {
          presenter,
        },
        props: {
          error: {
            originalError: {
              response: {
                data: 'unknown error',
              },
            },
          },
        },
      },
    );

    expect(presenter.providers.path.default).toHaveBeenCalled();
  });
});
