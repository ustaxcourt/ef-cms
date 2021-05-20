const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DocketEntryFactory,
} = require('../../entities/docketEntry/DocketEntryFactory');
const {
  validateDocketEntryInteractor,
} = require('./validateDocketEntryInteractor');

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

describe('validateDocketEntryInteractor', () => {
  it('returns the expected errors object on an empty docket entry', () => {
    const errors = validateDocketEntryInteractor(applicationContext, {
      entryMetadata: { filers: [] },
    });

    expect(errors).toEqual({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[1],
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });
  });

  it('returns no errors when valid docket entry is passed through', () => {
    const errors = validateDocketEntryInteractor(applicationContext, {
      entryMetadata: {
        category: 'Answer',
        dateReceived: '1987-08-06T07:53:09.001Z',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Answer',
        eventCode: 'A',
        filers: ['30016a85-dd92-4eba-8539-a8c9fd977e94'],
        lodged: false,
        ordinalValue: 'First',
        primaryDocumentFile: {},
        primaryDocumentFileSize: 1,
        scenario: 'Nonstandard G',
      },
    });

    expect(errors).toEqual(null);
  });
});
