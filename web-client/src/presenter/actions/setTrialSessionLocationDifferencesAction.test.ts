import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSessionLocationInfo } from '@shared/business/entities/trialSessions/TrialSession';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionLocationDifferencesAction } from '@web-client/presenter/actions/setTrialSessionLocationDifferencesAction';

describe('setTrialSessionLocationDifferencesAction', () => {
  const TEST_CURRENT_LOCATION: TrialSessionLocationInfo = {
    address1: 'TEST_ADDRESS_1',
    address2: undefined,
    city: 'TEST_CITY',
    courthouseName: 'TEST_COURTHOUSE_NAME',
    postalCode: 'TEST_POSTAL_CODE',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    state: 'TEST_STATE',
    trialLocation: 'TEST_CURRENT_TRIAL_LOCATION',
  };

  const TEST_UPDATED_LOCATION: TrialSessionLocationInfo = {
    address1: 'TEST_ADDRESS_1',
    address2: undefined,
    city: 'TEST_CITY',
    courthouseName: 'TEST_COURTHOUSE_NAME',
    postalCode: 'TEST_POSTAL_CODE',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    state: 'TEST_STATE',
    trialLocation: 'TEST_UPDATED_TRIAL_LOCATION',
  };

  it('should set state with the correct information provided', async () => {
    const { state } = await runAction(
      setTrialSessionLocationDifferencesAction,
      {
        props: {
          currentTrialSessionLocation: TEST_CURRENT_LOCATION,
          updatedTrialSessionLocation: TEST_UPDATED_LOCATION,
        },
      },
    );

    expect(state.trialSessionLocationChangeModalInfo).toEqual({
      currentTrialSessionLocation: TEST_CURRENT_LOCATION,
      updatedTrialSessionLocation: TEST_UPDATED_LOCATION,
    });
  });
});
