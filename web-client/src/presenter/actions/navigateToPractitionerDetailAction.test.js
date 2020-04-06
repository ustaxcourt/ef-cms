import { navigateToPractitionerDetailAction } from './navigateToPractitionerDetailAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

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
});
