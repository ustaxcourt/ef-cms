import { PublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';

describe('PublicTrialSessionDetails', () => {
  it('should map expected public trial session fields', () => {
    const entity = new PublicTrialSessionDetails({
      address1: '123 Main St',
      address2: 'Suite 100',
      calendaredCases: [],
      city: 'Seattle',
      courthouseName: 'Smith Courthouse',
      postalCode: '98101',
      startDate: '2026-01-01T00:00:00.000Z',
      state: 'WA',
      swingSessionId: '6ebac4ec-c416-40f6-a044-96cb65f4f659',
      swingSessionLocation: 'Portland, Oregon',
      trialLocation: 'Seattle, Washington',
    });

    expect(entity.getFormattedValidationErrors()).toBe(null);
    expect(entity.toRawObject()).toMatchObject({
      address1: '123 Main St',
      address2: 'Suite 100',
      calendaredCases: [],
      city: 'Seattle',
      courthouseName: 'Smith Courthouse',
      postalCode: '98101',
      startDate: '2026-01-01T00:00:00.000Z',
      state: 'WA',
      swingSessionId: '6ebac4ec-c416-40f6-a044-96cb65f4f659',
      swingSessionLocation: 'Portland, Oregon',
      trialLocation: 'Seattle, Washington',
    });
  });

  it('should require a valid ISO startDate', () => {
    const entity = new PublicTrialSessionDetails({
      calendaredCases: [],
      startDate: '',
    });

    expect(Object.keys(entity.getFormattedValidationErrors()!)).toContain(
      'startDate',
    );
  });
});
