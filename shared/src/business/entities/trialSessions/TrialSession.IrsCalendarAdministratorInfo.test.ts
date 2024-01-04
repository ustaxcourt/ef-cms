import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('TrialSession.IrsCalendarAdministratorInfo', () => {
  it('should not throw any validation error when IrsCalendarAdministratorInfo is undefined', () => {
    const entity = new TrialSession(
      {
        ...MOCK_TRIAL_REGULAR,
        irsCalendarAdministratorInfo: undefined,
      },
      {
        applicationContext,
      },
    );

    expect(entity.getFormattedValidationErrors()).toEqual(null);
  });

  it('should not throw any validation error when IrsCalendarAdministratorInfo is an empty object', () => {
    const entity = new TrialSession(
      {
        ...MOCK_TRIAL_REGULAR,
        irsCalendarAdministratorInfo: {},
      },
      {
        applicationContext,
      },
    );

    expect(entity.getFormattedValidationErrors()).toEqual(null);
  });

  it('should return a validation error when IrsCalendarAdministratorInfo name exceeds max length', () => {
    const entity = new TrialSession(
      {
        ...MOCK_TRIAL_REGULAR,
        irsCalendarAdministratorInfo: {
          name: '#'.repeat(101),
        },
      },
      {
        applicationContext,
      },
    );

    const validationErrors = entity.getFormattedValidationErrors();
    expect(validationErrors).toEqual({
      name: '"irsCalendarAdministratorInfo.name" length must be less than or equal to 100 characters long',
    });
  });

  it('should return a validation error when IrsCalendarAdministratorInfo email exceeds max length', () => {
    const entity = new TrialSession(
      {
        ...MOCK_TRIAL_REGULAR,
        irsCalendarAdministratorInfo: {
          email: '#'.repeat(101),
        },
      },
      {
        applicationContext,
      },
    );

    const validationErrors = entity.getFormattedValidationErrors();
    expect(validationErrors).toEqual({
      email:
        '"irsCalendarAdministratorInfo.email" length must be less than or equal to 100 characters long',
    });
  });

  it('should return a validation error when IrsCalendarAdministratorInfo phone exceeds max length', () => {
    const entity = new TrialSession(
      {
        ...MOCK_TRIAL_REGULAR,
        irsCalendarAdministratorInfo: {
          phone: '#'.repeat(101),
        },
      },
      {
        applicationContext,
      },
    );

    const validationErrors = entity.getFormattedValidationErrors();
    expect(validationErrors).toEqual({
      phone:
        '"irsCalendarAdministratorInfo.phone" length must be less than or equal to 100 characters long',
    });
  });
});
