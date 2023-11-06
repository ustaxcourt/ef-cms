import { PRACTITIONER_DOCUMENT_TYPES_MAP } from './EntityConstants';
import { PractitionerDocument } from './PractitionerDocument';
import { applicationContext } from '../test/createTestApplicationContext';

describe('PractitionerDocument', () => {
  it('should create a valid document when passed all required fields', () => {
    const document = new PractitionerDocument(
      {
        categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
        categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
        fileName: 'testing.pdf',
        location: null,
      },
      { applicationContext },
    );

    expect(document.isValid()).toBeTruthy();
  });

  it('should mark the entity as invalid when categoryName is not provided', () => {
    const document = new PractitionerDocument(
      {
        categoryName: null,
        categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
        fileName: 'testing.pdf',
        location: null,
      },
      { applicationContext },
    );

    expect(document.isValid()).toBeFalsy();
  });

  it('should mark the entity as invalid when incorrect category type is provided', () => {
    const document = new PractitionerDocument(
      {
        categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
        categoryType: 'some unknown type',
        fileName: 'testing.pdf',
        location: null,
      },
      { applicationContext },
    );

    expect(document.isValid()).toBeFalsy();
  });

  it('should mark the entity as invalid when the type is good standing and location is undefined', () => {
    const document = new PractitionerDocument(
      {
        categoryName:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        categoryType:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        fileName: 'testing.pdf',
        location: null,
      },
      { applicationContext },
    );

    expect(document.isValid()).toBeFalsy();
  });

  it('should mark the entity as valid when the type is good standing and location is provided', () => {
    const document = new PractitionerDocument(
      {
        categoryName:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        categoryType:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        fileName: 'testing.pdf',
        location: 'Colorado',
      },
      { applicationContext },
    );

    expect(document.isValid()).toBeTruthy();
  });

  it('should consider an empty string description as valid', () => {
    const document = new PractitionerDocument(
      {
        categoryName:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        categoryType:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        description: '',
        fileName: 'testing.pdf',
        location: 'Colorado',
      },
      { applicationContext },
    );

    expect(document.isValid()).toBeTruthy();
  });
});
