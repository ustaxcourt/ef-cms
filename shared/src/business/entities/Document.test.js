const { applicationContext } = require('../test/createTestApplicationContext');
const { PRACTITIONER_DOCUMENT_TYPES_MAP } = require('./EntityConstants');
const { Document } = require('./Document');

describe('Document', () => {
  it('should create a validate document when passed all required fields', () => {
    const document = new Document(
      {
        categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
        categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
        location: null,
      },
      { applicationContext },
    );
    expect(document.isValid()).toBeTruthy();
  });

  it('should mark the entity as valid when categoryName is not provided', () => {
    const document = new Document(
      {
        categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
        categoryName: null,
        location: null,
      },
      { applicationContext },
    );
    expect(document.isValid()).toBeFalsy();
  });

  it('should mark the entity as invalid when incorrect category type is provided', () => {
    const document = new Document(
      {
        categoryType: 'some unknown type',
        categoryName: PRACTITIONER_DOCUMENT_TYPES_MAP.ADMISSIONS_CERTIFICATE,
        location: null,
      },
      { applicationContext },
    );
    expect(document.isValid()).toBeFalsy();
  });

  it('should mark the entity as invalid when the type is good standing and location is undefined', () => {
    const document = new Document(
      {
        categoryType:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        categoryName:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        location: null,
      },
      { applicationContext },
    );
    expect(document.isValid()).toBeFalsy();
  });

  it('should mark the entity as valid when the type is good standing and location is provided', () => {
    const document = new Document(
      {
        categoryType:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        categoryName:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        location: 'Colorado',
      },
      { applicationContext },
    );
    expect(document.isValid()).toBeTruthy();
  });
});
