import { applicationContext } from '../../test/createTestApplicationContext';
import { validateAddPractitionerDocumentFormInteractor } from './validateAddPractitionerDocumentFormInteractor';

describe('validateAddPractitionerInteractor', () => {
  it('returns the expected errors object on an empty form', () => {
    const errors = validateAddPractitionerDocumentFormInteractor(
      applicationContext,
      {
        categoryName: undefined,
        categoryType: undefined,
        practitionerDocumentFile: undefined,
      },
    );

    expect(Object.keys(errors)).toEqual([
      'categoryName',
      'categoryType',
      'fileName',
    ]);
  });

  it('should return null when the practitioner object is valid', () => {
    const errors = validateAddPractitionerDocumentFormInteractor(
      applicationContext,
      {
        categoryName: 'Application',
        categoryType: 'Application',
        practitionerDocumentFile: { name: 'tests.png' },
      },
    );

    expect(errors).toBeNull();
  });
});
