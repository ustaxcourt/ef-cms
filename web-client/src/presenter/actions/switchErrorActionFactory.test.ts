import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { switchErrorActionFactory } from './switchErrorActionFactory';

describe('switchErrorActionFactory', () => {
  presenter.providers.path = {
    default: jest.fn(),
    testing: jest.fn(),
  };

  it('should return path.pdfInMemory when props.fileFromBrowserMemory is defined', async () => {
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

  it('should return path.pdfInMemory when props.fileFromBrowserMemory is defined', async () => {
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
