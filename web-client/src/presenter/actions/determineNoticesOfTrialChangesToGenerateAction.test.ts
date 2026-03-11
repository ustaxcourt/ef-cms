jest.mock(
  '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialLocation',
);
jest.mock(
  '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialStartDate',
);
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runAction } from '@web-client/presenter/test.cerebral';
import { presenter } from '@web-client/presenter/presenter-mock';
import { determineNoticesOfTrialChangesToGenerateAction } from './determineNoticesOfTrialChangesToGenerateAction';
import { shouldGenerateNoticeOfChangeTrialLocation } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialLocation';
import { shouldGenerateNoticeOfChangeTrialStartDate } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialStartDate';

describe('determineNoticesOfTrialChangesToGenerateAction', () => {
  let bothMock: jest.Mock;
  let locationMock: jest.Mock;
  let startDateMock: jest.Mock;
  let unchangedMock: jest.Mock;

  const TRIAL_SESSION_ID = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';

  const baseTrialSession = {
    trialSessionId: TRIAL_SESSION_ID,
    isCalendared: true,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    sessionType: SESSION_TYPES.regular,
    startDate: '2026-04-06',
    trialLocation: 'Birmingham, Alabama',
    address1: '123 Main St',
    courthouseName: 'Test Courthouse',
    address2: undefined,
    city: 'Birmingham',
    state: 'AL',
    postalCode: '35203',
  };

  beforeEach(() => {
    bothMock = jest.fn();
    locationMock = jest.fn();
    startDateMock = jest.fn();
    unchangedMock = jest.fn();

    presenter.providers.path = {
      both: bothMock,
      location: locationMock,
      startDate: startDateMock,
      unchanged: unchangedMock,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call "unchanged" path when there are no cases to receive notices', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockResolvedValue({
        casesThatShouldReceiveNoticesCount: 0,
      });

    (shouldGenerateNoticeOfChangeTrialLocation as jest.Mock).mockReturnValue(
      true,
    );

    (shouldGenerateNoticeOfChangeTrialStartDate as jest.Mock).mockReturnValue(
      true,
    );

    await runAction(determineNoticesOfTrialChangesToGenerateAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...baseTrialSession, startDate: '2026-04-13' },
        formattedTrialSessionDetails: baseTrialSession,
      },
    });

    expect(unchangedMock).toHaveBeenCalledTimes(1);
    expect(bothMock).not.toHaveBeenCalled();
    expect(locationMock).not.toHaveBeenCalled();
    expect(startDateMock).not.toHaveBeenCalled();
  });

  it('should call "unchanged" path when neither location nor start date changed', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockReturnValue({
        calendaredCaseEntitiesCount: 1,
        casesThatShouldReceiveNoticesCount: 1,
      });

    (shouldGenerateNoticeOfChangeTrialLocation as jest.Mock).mockReturnValue(
      false,
    );

    (shouldGenerateNoticeOfChangeTrialStartDate as jest.Mock).mockReturnValue(
      false,
    );

    await runAction(determineNoticesOfTrialChangesToGenerateAction, {
      modules: {
        presenter,
      },
      state: {
        form: baseTrialSession,
        formattedTrialSessionDetails: baseTrialSession,
      },
    });

    expect(unchangedMock).toHaveBeenCalledTimes(1);
    expect(bothMock).not.toHaveBeenCalled();
    expect(locationMock).not.toHaveBeenCalled();
    expect(startDateMock).not.toHaveBeenCalled();
  });

  it('should call "both" path when both location and start date changed', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockResolvedValue({
                calendaredCaseEntitiesCount: 1,

        casesThatShouldReceiveNoticesCount: 1,
      });

        (shouldGenerateNoticeOfChangeTrialLocation as jest.Mock).mockReturnValue(
      true,
    );

    (shouldGenerateNoticeOfChangeTrialStartDate as jest.Mock).mockReturnValue(
      true,
    );

    const updatedTrialSession = {
      ...baseTrialSession,
      startDate: '2026-04-13',
      trialLocation: 'Mobile, Alabama',
      address1: '456 Other St',
    };

    await runAction(determineNoticesOfTrialChangesToGenerateAction, {
      modules: {
        presenter,
      },
      state: {
        form: updatedTrialSession,
        formattedTrialSessionDetails: baseTrialSession,
      },
    });

    expect(unchangedMock).not.toHaveBeenCalled();
    expect(bothMock).toHaveBeenCalledTimes(1);
    expect(bothMock.mock.calls[0][0]).toEqual({
      currentTrialSession: baseTrialSession,
      updatedTrialSession,
      persistModal: true,
    });
    expect(locationMock).not.toHaveBeenCalled();
    expect(startDateMock).not.toHaveBeenCalled();
  });

  it('should call "location" path when only location changed', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockReturnValue({
        calendaredCaseEntitiesCount: 1,
        casesThatShouldReceiveNoticesCount: 1,
      });

    (shouldGenerateNoticeOfChangeTrialLocation as jest.Mock).mockReturnValue(
      true,
    );

    (shouldGenerateNoticeOfChangeTrialStartDate as jest.Mock).mockReturnValue(
      false,
    );

    const updatedTrialSession = {
      ...baseTrialSession,
      trialLocation: 'Mobile, Alabama',
      address1: '456 Other St',
    };

    await runAction(determineNoticesOfTrialChangesToGenerateAction, {
      modules: {
        presenter,
      },
      state: {
        form: updatedTrialSession,
        formattedTrialSessionDetails: baseTrialSession,
      },
    });

    expect(unchangedMock).not.toHaveBeenCalled();
    expect(bothMock).not.toHaveBeenCalled();
    expect(locationMock).toHaveBeenCalledTimes(1);
    expect(locationMock.mock.calls[0][0]).toEqual({
      currentTrialSession: baseTrialSession,
      updatedTrialSession,
      persistModal: false,
    });
    expect(startDateMock).not.toHaveBeenCalled();
  });

  it('should call "startDate" path when only start date changed', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockReturnValue({
        calendaredCaseEntitiesCount: 1,
        casesThatShouldReceiveNoticesCount: 1,
      });

    (shouldGenerateNoticeOfChangeTrialLocation as jest.Mock).mockReturnValue(
      false,
    );

    (shouldGenerateNoticeOfChangeTrialStartDate as jest.Mock).mockReturnValue(
      true,
    );

    const updatedTrialSession = {
      ...baseTrialSession,
      startDate: '2026-04-13',
    };

    await runAction(determineNoticesOfTrialChangesToGenerateAction, {
      modules: {
        presenter,
      },
      state: {
        form: updatedTrialSession,
        formattedTrialSessionDetails: baseTrialSession,
      },
    });

    expect(unchangedMock).not.toHaveBeenCalled();
    expect(bothMock).not.toHaveBeenCalled();
    expect(locationMock).not.toHaveBeenCalled();
    expect(startDateMock).toHaveBeenCalledTimes(1);
    expect(startDateMock.mock.calls[0][0]).toEqual({
      currentTrialSession: baseTrialSession,
      updatedTrialSession,
      persistModal: false,
    });
  });
});
