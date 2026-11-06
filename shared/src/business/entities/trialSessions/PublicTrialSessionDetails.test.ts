import { PublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';
import { PublicCaseResponse } from '@shared/business/dto/cases/PublicCaseResponse';
import { RestrictedCaseResponse } from '@shared/business/dto/cases/RestrictedCaseResponse';
import { PARTY_TYPES } from '@shared/business/entities/EntityConstants';

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

  it('accepts an approved restricted case response in calendaredCases', () => {
    const calendaredCase = new RestrictedCaseResponse({
      docketNumber: '101-20',
      docketEntries: [],
    }).validate();
    const entity = new PublicTrialSessionDetails({
      calendaredCases: [calendaredCase],
      startDate: '2026-01-01T00:00:00.000Z',
    });

    expect(entity.isValid()).toBe(true);
  });

  it('accepts an approved public case response in calendaredCases', () => {
    const calendaredCase = new PublicCaseResponse({
      caseCaption: 'Test Petitioner, Petitioner',
      docketEntries: [],
      docketNumber: '101-20',
      docketNumberWithSuffix: '101-20',
      entityName: 'PublicCase',
      hasIrsPractitioner: false,
      isSealed: false,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [],
      receivedAt: '2020-01-05T03:30:45.007Z',
    }).validate();
    const entity = new PublicTrialSessionDetails({
      calendaredCases: [calendaredCase],
      startDate: '2026-01-01T00:00:00.000Z',
    });

    expect(entity.isValid()).toBe(true);
  });

  it('rejects invalid fields on calendared case responses', () => {
    const calendaredCase = new RestrictedCaseResponse({
      docketNumber: '101-20',
      docketEntries: [],
    });
    calendaredCase.docketNumber = 'not-a-docket-number';
    const entity = new PublicTrialSessionDetails({
      calendaredCases: [calendaredCase],
      startDate: '2026-01-01T00:00:00.000Z',
    });

    expect(entity.isValid()).toBe(false);
  });
});
