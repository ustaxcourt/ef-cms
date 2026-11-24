import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { determineNoticesOfTrialChangesToGenerateAction } from './determineNoticesOfTrialChangesToGenerateAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

// Unlike determineNoticesOfTrialChangesToGenerateAction.test.ts, the "should
// generate notice" utilities are NOT mocked here, so these tests exercise the
// real rules that decide whether a confirmation modal is shown.
describe('determineNoticesOfTrialChangesToGenerateAction for Reporting sessions', () => {
  const TRIAL_SESSION_ID = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';

  const calendaredSession = {
    isCalendared: true,
    sessionType: SESSION_TYPES.regular,
    startDate: '2026-04-06T04:00:00.000Z',
    trialLocation: 'Birmingham, Alabama',
    trialSessionId: TRIAL_SESSION_ID,
  };

  let pathMocks: Record<
    'both' | 'location' | 'startDate' | 'unchanged',
    jest.Mock
  >;

  beforeEach(() => {
    pathMocks = {
      both: jest.fn(),
      location: jest.fn(),
      startDate: jest.fn(),
      unchanged: jest.fn(),
    };
    presenter.providers.path = pathMocks;
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockResolvedValue({
        casesThatShouldReceiveNoticesCount: 3,
      });
  });

  it('should call the "unchanged" path when the due date and trial location of a calendared Reporting session with open cases are edited', async () => {
    const reportingSession = {
      ...calendaredSession,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.reporting,
    };

    await runAction(determineNoticesOfTrialChangesToGenerateAction, {
      modules: { presenter },
      state: {
        form: {
          ...reportingSession,
          startDate: '2026-04-13T04:00:00.000Z',
          trialLocation: 'Mobile, Alabama',
        },
        formattedTrialSessionDetails: reportingSession,
      },
    });

    expect(pathMocks.unchanged).toHaveBeenCalledTimes(1);
    expect(pathMocks.startDate).not.toHaveBeenCalled();
    expect(pathMocks.location).not.toHaveBeenCalled();
    expect(pathMocks.both).not.toHaveBeenCalled();
  });

  it('should still call the "startDate" path when the start date of a calendared In Person session with open cases is edited', async () => {
    const inPersonSession = {
      ...calendaredSession,
      address1: '123 Main St',
      city: 'Birmingham',
      courthouseName: 'Test Courthouse',
      postalCode: '35203',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      state: 'AL',
    };

    await runAction(determineNoticesOfTrialChangesToGenerateAction, {
      modules: { presenter },
      state: {
        form: {
          ...inPersonSession,
          startDate: '2026-04-13T04:00:00.000Z',
        },
        formattedTrialSessionDetails: inPersonSession,
      },
    });

    expect(pathMocks.startDate).toHaveBeenCalledTimes(1);
    expect(pathMocks.unchanged).not.toHaveBeenCalled();
  });
});
