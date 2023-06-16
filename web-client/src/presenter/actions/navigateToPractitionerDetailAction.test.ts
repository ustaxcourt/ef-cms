import { navigateToPractitionerDetailAction } from './navigateToPractitionerDetailAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToPractitionerDetailAction', () => {
  beforeAll(() => {
    presenter.providers.router = {
      route: jest.fn(),
    };
  });

  it('should call the router to navigate to the practitioner detail for the given bar number', async () => {
    await runAction(navigateToPractitionerDetailAction, {
      modules: {
        presenter,
      },
      props: {
        barNumber: 'BN1234',
      },
    });

    expect(presenter.providers.router.route).toHaveBeenCalledWith(
      '/practitioner-detail/BN1234',
    );
  });

  it('should call the router to navigate to the practitioner detail for the given bar number found in state if not on props', async () => {
    await runAction(navigateToPractitionerDetailAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          barNumber: 'BN5678',
        },
      },
    });

    expect(presenter.providers.router.route).toHaveBeenCalledWith(
      '/practitioner-detail/BN5678',
    );
  });
  it('should not call the router if no bar number can be found in state or props', async () => {
    await runAction(navigateToPractitionerDetailAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(presenter.providers.router.route).not.toHaveBeenCalled();
  });
});
