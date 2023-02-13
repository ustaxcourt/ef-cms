import { navigateToTrialSessionsAction } from './navigateToTrialSessionsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

const routeStub = jest.fn();

presenter.providers.router = {
  route: routeStub,
};

describe('navigateToTrialSessionAction', () => {
  it('should go to the trials sessions route', async () => {
    await runAction(navigateToTrialSessionsAction, {
      modules: {
        presenter,
      },
    });
    expect(routeStub.mock.calls.length).toEqual(1);
  });
});
