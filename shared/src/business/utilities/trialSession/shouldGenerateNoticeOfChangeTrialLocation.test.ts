import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { shouldGenerateNoticeOfChangeTrialLocation } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialLocation';

describe('shouldGenerateNoticeOfChangeTrialLocation', () => {
  const TEST_LOCATION = {
    address1: 'TEST_ADDRESS_1',
    address2: 'TEST_ADDRESS_2',
    city: 'TEST_CITY',
    courthouseName: 'TEST_COURT_HOUSE_NAME',
    postalCode: 'TEST_POSTAL_CODE',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    state: 'TEST_STATE',
    trialLocation: 'TEST_TRIAL_LOCATION',
  };

  it('return "false" isCalendared is ', () => {
    const CURRENT_LOCATION = {
      ...TEST_LOCATION,
    } as RawTrialSession;

    const UPDATED_LOCATION = {
      ...TEST_LOCATION,
    } as RawTrialSession;

    const result = shouldGenerateNoticeOfChangeTrialLocation(
      CURRENT_LOCATION,
      UPDATED_LOCATION,
    );

    expect(result).toEqual(false);
  });

  it('return "false" when location has not been updated', () => {
    const CURRENT_LOCATION = {
      ...TEST_LOCATION,
    } as RawTrialSession;

    const UPDATED_LOCATION = {
      ...TEST_LOCATION,
    } as RawTrialSession;

    const result = shouldGenerateNoticeOfChangeTrialLocation(
      CURRENT_LOCATION,
      UPDATED_LOCATION,
    );

    expect(result).toEqual(false);
  });

  it('return "true" when location has been updated', () => {
    const CURRENT_LOCATION = {
      ...TEST_LOCATION,
    } as RawTrialSession;

    const UPDATED_LOCATION = {
      ...TEST_LOCATION,
      address1: 'UPDATE_TEST_aDDRESS_1',
    } as RawTrialSession;

    const result = shouldGenerateNoticeOfChangeTrialLocation(
      CURRENT_LOCATION,
      UPDATED_LOCATION,
    );

    expect(result).toEqual(true);
  });
});
