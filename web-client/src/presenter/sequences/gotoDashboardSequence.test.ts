import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { gotoDashboardSequence } from '../sequences/gotoDashboardSequence';
import { clerkOfCourtUser, petitionerUser } from '@shared/test/mockUsers';
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
    cerebralTest.setState('user', {
      email: 'richard@e.mail',
      name: 'richard',
      role: petitionerUser.role,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    });
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

  describe('clerk of court', () => {
    beforeEach(() => {
      cerebralTest.setState('user', clerkOfCourtUser);
      jest.clearAllMocks();
    });

    afterAll(() => {
      cerebralTest.setState('user', {
        email: 'richard@e.mail',
        name: 'richard',
        role: petitionerUser.role,
        userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      });
    });

    // the dashboard view loads these after it renders (loadClerkOfCourtDashboardSequence)
    it('should show the clerk of court dashboard without loading its notifications, messages, trial sessions or charts', async () => {
      await cerebralTest.runSequence('gotoDashboardSequence');

      expect(cerebralTest.getState('currentPage')).toEqual(
        'DashboardClerkOfCourt',
      );
      const useCases = applicationContext.getUseCases();
      expect(useCases.getNotificationsInteractor).not.toHaveBeenCalled();
      expect(useCases.getInboxMessagesForUserInteractor).not.toHaveBeenCalled();
      expect(useCases.getTrialSessionsInteractor).not.toHaveBeenCalled();
      expect(
        useCases.getClerkDashboardTrialSessionsInteractor,
      ).not.toHaveBeenCalled();
      expect(
        useCases.getClerkDashboardPetitionsStatsInteractor,
      ).not.toHaveBeenCalled();
      expect(
        useCases.getClerkDashboardCasesStatsInteractor,
      ).not.toHaveBeenCalled();
    });
  });
});
