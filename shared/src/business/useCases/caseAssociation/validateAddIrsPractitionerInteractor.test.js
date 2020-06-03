const {
  AddIrsPractitioner,
} = require('../../entities/caseAssociation/AddIrsPractitioner');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateAddIrsPractitionerInteractor,
} = require('./validateAddIrsPractitionerInteractor');

describe('validateAddIrsPractitionerInteractor', () => {
  it('returns the expected errors object on an empty add irsPractitioner', () => {
    const errors = validateAddIrsPractitionerInteractor({
      applicationContext,
      counsel: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(AddIrsPractitioner.VALIDATION_ERROR_MESSAGES),
    );
  });

  it('returns null when no errors occur', () => {
    const errors = validateAddIrsPractitionerInteractor({
      applicationContext,
      counsel: { representingPrimary: true, user: {} },
    });

    expect(errors).toEqual(null);
  });
});
