import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { validateAddPractitionerDocumentFormInteractor } from './validateAddPractitionerDocumentFormInteractor';

describe('validateAddPractitionerInteractor', () => {
  it('should return validations errors when the form is empty', () => {
    const errors = validateAddPractitionerDocumentFormInteractor(
      applicationContext,
      {
        categoryName: undefined,
        categoryType: undefined,
        practitionerDocumentFile: undefined,
      },
    );

    expect(errors).toEqual({
      categoryName: expect.anything(),
      categoryType: expect.anything(),
      fileName: expect.anything(),
    });
  });

  it('should return null when the practitioner document is valid', () => {
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

  it('should return null when the form data for a good standing document is valid', () => {
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
