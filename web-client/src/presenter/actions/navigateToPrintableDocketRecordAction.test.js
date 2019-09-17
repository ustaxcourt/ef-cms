import { exportAllDeclaration } from 'babel-types';
import { navigateToPrintableDocketRecordAction } from './navigateToPrintableDocketRecordAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('navigateToPrintableDocketRecordAction', () => {
  let routeStub;

  beforeEach(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('should navigate to the printable docket record page', async () => {
    await runAction(navigateToPrintableDocketRecordAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalled();
  });
});
