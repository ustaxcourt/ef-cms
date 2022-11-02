import { AddIrsPractitioner } from '../../entities/caseAssociation/AddIrsPractitioner';
import { SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { validateAddIrsPractitionerInteractor } from './validateAddIrsPractitionerInteractor';

describe('validateAddIrsPractitionerInteractor', () => {
  it('returns the expected errors object on an empty add irsPractitioner', () => {
    const errors = validateAddIrsPractitionerInteractor(applicationContext, {
      counsel: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(AddIrsPractitioner.VALIDATION_ERROR_MESSAGES),
    );
  });

  it('returns null when no errors occur', () => {
    const errors = validateAddIrsPractitionerInteractor(applicationContext, {
      counsel: {
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        user: {},
      },
    });

    expect(errors).toEqual(null);
  });
});
