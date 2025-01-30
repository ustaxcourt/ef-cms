import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { shouldGenerateNoticeOfChangeTrialLocation } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialLocation';

describe('shouldGenerateNoticeOfChangeTrialLocation', () => {
  const TEST_LOCATION = {
    address1: 'TEST_ADDRESS_1',
    address2: 'TEST_ADDRESS_2',
    city: 'TEST_CITY',
    courthouseName: 'TEST_COURT_HOUSE_NAME',
    isCalendared: true,
    postalCode: 'TEST_POSTAL_CODE',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    state: 'TEST_STATE',
    trialLocation: 'TEST_TRIAL_LOCATION',
    sessionType: SESSION_TYPES.regular,
  };

  it('should return "false" when location has not been updated', () => {
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

  it('should return "false" if the current/updated Trial Session is not calendared', () => {
    const CURRENT_LOCATION = {
      ...TEST_LOCATION,
      isCalendared: false,
    } as RawTrialSession;

    const UPDATED_LOCATION = {
      ...TEST_LOCATION,
      address1: 'UPDATE_TEST_aDDRESS_1',
      isCalendared: false,
    } as RawTrialSession;

    const result = shouldGenerateNoticeOfChangeTrialLocation(
      CURRENT_LOCATION,
      UPDATED_LOCATION,
    );

    expect(result).toEqual(false);
  });

  it('should return "true" when location has been updated', () => {
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

  it('should return "false" when the current Trial Session sessionType is "Motion/Hearing"', () => {
    const CURRENT_LOCATION = {
      ...TEST_LOCATION,
      sessionType: SESSION_TYPES.motionHearing,
    } as RawTrialSession;

    const UPDATED_LOCATION = {
      ...TEST_LOCATION,
      address1: 'UPDATE_TEST_aDDRESS_1',
    } as RawTrialSession;

    const result = shouldGenerateNoticeOfChangeTrialLocation(
      CURRENT_LOCATION,
      UPDATED_LOCATION,
    );

    expect(result).toEqual(false);
  });

  it('should return "false" when the updated Trial Session sessionType is "Motion/Hearing"', () => {
    const CURRENT_LOCATION = {
      ...TEST_LOCATION,
    } as RawTrialSession;

    const UPDATED_LOCATION = {
      ...TEST_LOCATION,
      sessionType: SESSION_TYPES.motionHearing,
      address1: 'UPDATE_TEST_ADDRESS_1',
    } as RawTrialSession;

    const result = shouldGenerateNoticeOfChangeTrialLocation(
      CURRENT_LOCATION,
      UPDATED_LOCATION,
    );

    expect(result).toEqual(false);
  });
});
