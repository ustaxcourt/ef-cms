const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateAddPractitionerInteractor,
} = require('./validateAddPractitionerInteractor');

describe('validateAddPractitionerInteractor', () => {
  it('returns the expected errors object on an empty practitioner', () => {
    const errors = validateAddPractitionerInteractor({
      applicationContext,
      practitioner: {},
    });

    expect(Object.keys(errors)).toEqual([
      'email',
      'admissionsDate',
      'admissionsStatus',
      'birthYear',
      'employer',
      'firstName',
      'lastName',
      'originalBarState',
      'practitionerType',
    ]);
  });

  it('returns null on no errors', () => {
    const errors = validateAddPractitionerInteractor({
      applicationContext,
      practitioner: {
        admissionsDate: '2019-03-01',
        admissionsStatus: 'Active',
        birthYear: '2009',
        email: 'test@example.com',
        employer: 'IRS',
        firstName: 'Test',
        lastName: 'Practitioner',
        originalBarState: 'IL',
        practitionerType: 'Attorney',
      },
    });

    expect(errors).toBeNull();
  });
});
