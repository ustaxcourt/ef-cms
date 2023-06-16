import { checkForNegativeValueAction } from './checkForNegativeValueAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('checkForNegativeValueAction', () => {
  let presenter;

  beforeAll(() => {
    presenter = {
      providers: {
        path: {
          set: jest.fn(),
          unset: jest.fn(),
        },
      },
    };
  });

  it('should call set when the value begins with a "-"', async () => {
    await runAction(checkForNegativeValueAction, {
      modules: {
        presenter,
      },
      props: {
        value: '-13',
      },
    });

    expect(presenter.providers.path.set).toHaveBeenCalled();
  });

  it('should call the unset path when the value does not begin with a "-"', async () => {
    await runAction(checkForNegativeValueAction, {
      modules: {
        presenter,
      },
      props: {
        value: '13',
      },
    });

    expect(presenter.providers.path.unset).toHaveBeenCalled();
  });

  it('should call the unset path when the value only has a "-"', async () => {
    await runAction(checkForNegativeValueAction, {
      modules: {
        presenter,
      },
      props: {
        value: '-',
      },
    });

    expect(presenter.providers.path.unset).toHaveBeenCalled();
  });
});
