import { navigateToOrdersNeededAction } from './navigateToOrdersNeededAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('navigateToOrdersNeededAction', () => {
  let routeStub;

  beforeEach(() => {
    routeStub = sinon.stub();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to orders needed summary url when given docketNumber', async () => {
    await runAction(navigateToOrdersNeededAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-19',
      },
    });

    expect(routeStub.calledOnce).toEqual(true);
  });

  it('does not navigate to orders needed summary url  when there is no docketNumber', async () => {
    await runAction(navigateToOrdersNeededAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub.calledOnce).toEqual(false);
  });
});
