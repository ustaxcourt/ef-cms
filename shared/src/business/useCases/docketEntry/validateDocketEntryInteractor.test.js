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
  it('returns the expected errors object on an empty message', () => {
    const errors = validateDocketEntryInteractor({
      applicationContext,
      entryMetadata: {},
    });

    expect(errors).toEqual({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[1],
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      partyPrimary: VALIDATION_ERROR_MESSAGES.partyPrimary,
    });
  });

  it('returns no errors when valid docket entry is passed through', () => {
    const errors = validateDocketEntryInteractor({
      applicationContext,
      entryMetadata: {
        category: 'Answer',
        dateReceived: '1987-08-06T07:53:09.001Z',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Answer',
        eventCode: 'A',
        lodged: false,
        ordinalValue: 'First',
        partyPrimary: true,
        primaryDocumentFile: {},
        primaryDocumentFileSize: 1,
        scenario: 'Nonstandard G',
      },
    });

    expect(errors).toEqual(null);
  });
});
