import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { validatePractitionerInteractor } from './validatePractitionerInteractor';

describe('validatePractitionerInteractor', () => {
  it('returns the expected errors object on an empty practitioner', () => {
    const errors = validatePractitionerInteractor(applicationContext, {
      practitioner: {} as TPractitioner,
    });

    expect(Object.keys(errors)).toEqual([
      'role',
      'userId',
      'admissionsDate',
      'admissionsStatus',
      'barNumber',
      'birthYear',
      'employer',
      'firstName',
      'lastName',
      'originalBarState',
      'practitionerType',
    ]);
  });

  it('returns null on no errors', () => {
    const errors = validatePractitionerInteractor(applicationContext, {
      practitioner: {
        admissionsDate: '2019-03-01',
        admissionsStatus: 'Active',
        barNumber: 'PT7890',
        birthYear: '2009',
        employer: 'IRS',
        firstName: 'Test',
        lastName: 'Practitioner',
        originalBarState: 'IL',
        practitionerType: 'Attorney',
        role: ROLES.privatePractitioner,
        userId: '195e31b6-20f7-4fa4-980e-4236b771cced',
      } as TPractitioner,
    });

    expect(errors).toBeNull();
  });
});
