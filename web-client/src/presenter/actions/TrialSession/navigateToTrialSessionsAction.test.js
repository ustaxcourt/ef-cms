import { navigateToTrialSessionsAction } from './navigateToTrialSessionsAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

const routeStub = sinon.stub();

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
    expect(routeStub.calledOnce).toEqual(true);
  });
});
