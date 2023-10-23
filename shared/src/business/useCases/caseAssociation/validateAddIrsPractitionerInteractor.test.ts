import { SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { validateAddIrsPractitionerInteractor } from './validateAddIrsPractitionerInteractor';

describe('validateAddIrsPractitionerInteractor', () => {
  it('returns the expected errors object on an empty add irsPractitioner', () => {
    const errors = validateAddIrsPractitionerInteractor(applicationContext, {
      counsel: {},
    });

    expect(errors).toEqual({
      serviceIndicator: 'Select service type',
      user: 'Select a respondent counsel',
    });
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
