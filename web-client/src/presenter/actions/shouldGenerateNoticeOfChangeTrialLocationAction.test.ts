import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSessionLocationInfo } from '@shared/business/entities/trialSessions/TrialSession';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { shouldGenerateNoticeOfChangeTrialLocationAction } from '@web-client/presenter/actions/shouldGenerateNoticeOfChangeTrialLocationAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('shouldGenerateNoticeOfChangeTrialLocationAction', () => {
  let updatedMock: jest.Mock;
  let unchangedMock: jest.Mock;

  beforeEach(() => {
    updatedMock = jest.fn();
    unchangedMock = jest.fn();

    presenter.providers.path = {
      unchanged: unchangedMock,
      updated: updatedMock,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call "unchanged" path when either location data is not in person', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockReturnValue({
        calendaredCaseEntitiesCount: 1,
        casesThatShouldReceiveNoticesCount: 1,
      });

    await runAction(shouldGenerateNoticeOfChangeTrialLocationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          address1: 'TEST_ADDRESS_1',
          isCalendated: true,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        },
        formattedTrialSessionDetails: {
          address1: 'TEST_ADDRESS_2',
          isCalendated: true,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        },
      },
    });

    expect(unchangedMock.mock.calls.length).toEqual(1);
    expect(updatedMock.mock.calls.length).toEqual(0);
  });

  it('should call "unchanged" path when either location data is not calendared', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockReturnValue({
        calendaredCaseEntitiesCount: 1,
        casesThatShouldReceiveNoticesCount: 1,
      });

    const CURRENT_LOCATION: TrialSessionLocationInfo = {
      address1: 'TEST_ADDRESS_1',
      address2: 'TEST_ADDTESS_2',
      city: 'TEST_CITY',
      courthouseName: 'TEST_COURTHOUSE_NAME',
      postalCode: 'TEST_POSTAL_CODE',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      state: 'TEST_STATE',
      trialLocation: 'TEST_TRIAL_LOCATION',
    };

    const UPDATED_LOCATION: TrialSessionLocationInfo = {
      address1: 'TEST_ADDRESS_1',
      address2: 'TEST_ADDTESS_2',
      city: 'TEST_CITY',
      courthouseName: 'TEST_COURTHOUSE_NAME',
      postalCode: 'TEST_POSTAL_CODE',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      state: 'TEST_STATE',
      trialLocation: 'UPDATED__TEST_TRIAL_LOCATION',
    };

    await runAction(shouldGenerateNoticeOfChangeTrialLocationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ...UPDATED_LOCATION,
          isCalendared: false,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        },
        formattedTrialSessionDetails: {
          ...CURRENT_LOCATION,
          isCalendared: false,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        },
      },
    });

    expect(unchangedMock.mock.calls.length).toEqual(1);
    expect(updatedMock.mock.calls.length).toEqual(0);
  });

  it('should call "unchanged" path when location information is the same', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockReturnValue({
        calendaredCaseEntitiesCount: 1,
        casesThatShouldReceiveNoticesCount: 1,
      });

    await runAction(shouldGenerateNoticeOfChangeTrialLocationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          address1: 'TEST_ADDRESS_1',
          isCalendared: true,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        },
        formattedTrialSessionDetails: {
          address1: 'TEST_ADDRESS_1',
          isCalendared: true,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        },
      },
    });

    expect(unchangedMock.mock.calls.length).toEqual(1);
    expect(updatedMock.mock.calls.length).toEqual(0);
  });

  it('should call "unchanged" path when location information has been updated but there are no cases to generate notices', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockReturnValue({
        calendaredCaseEntitiesCount: 0,
        casesThatShouldReceiveNoticesCount: 0,
      });

    const CURRENT_LOCATION: TrialSessionLocationInfo = {
      address1: 'TEST_ADDRESS_1',
      address2: 'TEST_ADDTESS_2',
      city: 'TEST_CITY',
      courthouseName: 'TEST_COURTHOUSE_NAME',
      postalCode: 'TEST_POSTAL_CODE',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      state: 'TEST_STATE',
      trialLocation: 'TEST_TRIAL_LOCATION',
    };

    const UPDATED_LOCATION: TrialSessionLocationInfo = {
      address1: 'TEST_ADDRESS_1',
      address2: 'TEST_ADDTESS_2',
      city: 'TEST_CITY',
      courthouseName: 'TEST_COURTHOUSE_NAME',
      postalCode: 'TEST_POSTAL_CODE',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      state: 'TEST_STATE',
      trialLocation: 'UPDATED__TEST_TRIAL_LOCATION',
    };

    await runAction(shouldGenerateNoticeOfChangeTrialLocationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ...UPDATED_LOCATION,
          isCalendared: true,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        },
        formattedTrialSessionDetails: {
          ...CURRENT_LOCATION,
          isCalendared: true,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        },
      },
    });

    expect(unchangedMock.mock.calls.length).toEqual(1);
    expect(updatedMock.mock.calls.length).toEqual(0);
  });

  it('should call "updated" path when location information has been updated', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionOpenCasesCountInteractor.mockReturnValue({
        calendaredCaseEntitiesCount: 1,
        casesThatShouldReceiveNoticesCount: 1,
      });

    const CURRENT_LOCATION: TrialSessionLocationInfo = {
      address1: 'TEST_ADDRESS_1',
      address2: 'TEST_ADDTESS_2',
      city: 'TEST_CITY',
      courthouseName: 'TEST_COURTHOUSE_NAME',
      postalCode: 'TEST_POSTAL_CODE',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      state: 'TEST_STATE',
      trialLocation: 'TEST_TRIAL_LOCATION',
    };

    const UPDATED_LOCATION: TrialSessionLocationInfo = {
      address1: 'TEST_ADDRESS_1',
      address2: 'TEST_ADDTESS_2',
      city: 'TEST_CITY',
      courthouseName: 'TEST_COURTHOUSE_NAME',
      postalCode: 'TEST_POSTAL_CODE',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      state: 'TEST_STATE',
      trialLocation: 'UPDATED__TEST_TRIAL_LOCATION',
    };

    await runAction(shouldGenerateNoticeOfChangeTrialLocationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ...UPDATED_LOCATION,
          isCalendared: true,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        },
        formattedTrialSessionDetails: {
          ...CURRENT_LOCATION,
          isCalendared: true,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        },
      },
    });

    expect(unchangedMock.mock.calls.length).toEqual(0);

    const updatedCalls = updatedMock.mock.calls;
    expect(updatedCalls.length).toEqual(1);
    expect(updatedCalls[0]).toEqual([
      {
        currentTrialSessionLocation: {
          ...CURRENT_LOCATION,
          isCalendared: true,
        },
        updatedTrialSessionLocation: {
          ...UPDATED_LOCATION,
          isCalendared: true,
        },
      },
    ]);
  });
});
