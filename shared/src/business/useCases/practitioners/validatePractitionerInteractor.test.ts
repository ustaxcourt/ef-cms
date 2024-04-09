import { ROLES } from '../../entities/EntityConstants';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { applicationContext } from '../../test/createTestApplicationContext';
import { validatePractitionerInteractor } from './validatePractitionerInteractor';

describe('validatePractitionerInteractor', () => {
  it('returns the expected errors object on an empty practitioner', () => {
    const errors = validatePractitionerInteractor(applicationContext, {
      practitioner: {} as RawPractitioner,
    });

    expect(Object.keys(errors)).toEqual([
      'role',
      'userId',
      'admissionsDate',
      'admissionsStatus',
      'barNumber',
      'birthYear',
      'firstName',
      'lastName',
      'originalBarState',
      'practiceType',
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
        firstName: 'Test',
        lastName: 'Practitioner',
        originalBarState: 'IL',
        practiceType: 'IRS',
        practitionerType: 'Attorney',
        role: ROLES.privatePractitioner,
        userId: '195e31b6-20f7-4fa4-980e-4236b771cced',
      } as RawPractitioner,
    });

    expect(errors).toBeNull();
  });
});
