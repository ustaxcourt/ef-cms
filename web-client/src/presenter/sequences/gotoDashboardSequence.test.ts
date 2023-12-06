import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { gotoDashboardSequence } from '../sequences/gotoDashboardSequence';
import { presenter } from '../presenter-mock';

describe('gotoDashboardSequence', () => {
  const openCases = [{ docketNumber: '111-22' }];
  const closedCases = [{ docketNumber: '333-44' }];

  const startSocketMock = jest.fn();

  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.socket = { start: startSocketMock };
    presenter.sequences = {
      gotoDashboardSequence,
    };
    cerebralTest = CerebralTest(presenter);

    applicationContext.getUseCases().getCasesForUserInteractor.mockReturnValue({
      closedCaseList: closedCases,
      openCaseList: openCases,
    });

    //set token to take 'isLoggedIn' path
    cerebralTest.setState('token', 'a');
  });

  it('should set up state for petitioner going to dashboard', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(cerebralTest.getState()).toMatchObject({
      closedCases,
      openCases,
    });
  });

  it('should start a websocket connection', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(startSocketMock).toHaveBeenCalled();
  });
});
