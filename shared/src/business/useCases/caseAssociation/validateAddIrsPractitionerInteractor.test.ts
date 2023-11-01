import { RawAddIrsPractitioner } from '@shared/business/entities/caseAssociation/AddIrsPractitioner';
import { SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
import { validateAddIrsPractitionerInteractor } from './validateAddIrsPractitionerInteractor';

describe('validateAddIrsPractitionerInteractor', () => {
  it('should return the expected validation errors object when the practitioner to add is invalid', () => {
    const errors = validateAddIrsPractitionerInteractor({
      counsel: {
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        user: undefined, // User is a required property
      },
    });

    expect(errors).toEqual({
      user: 'Select a respondent counsel',
    });
  });

  it('should return null when the practitioner to add is valid', () => {
    const mockAddIrsPractitioner: RawAddIrsPractitioner = {
      entityName: 'AddIrsPractitioner',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      user: {},
    };

    const errors = validateAddIrsPractitionerInteractor({
      counsel: mockAddIrsPractitioner,
    });

    expect(errors).toEqual(null);
  });
});
