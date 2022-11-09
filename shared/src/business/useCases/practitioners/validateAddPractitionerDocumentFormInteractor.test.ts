import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../../entities/EntityConstants';
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
        categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
        categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
        practitionerDocumentFile: { name: 'tests.png' },
      },
    );

    expect(errors).toBeNull();
  });

  it('should return null when then form data for good standing documents is valid', () => {
    const errors = validateAddPractitionerDocumentFormInteractor(
      applicationContext,
      {
        categoryName:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        categoryType:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        location: 'FL',
        practitionerDocumentFile: { name: 'tests.png' },
      },
    );

    expect(errors).toBeNull();
  });
});
