const {
  DocketEntryFactory,
} = require('../../entities/docketEntry/DocketEntryFactory');
const {
  validateDocketEntryInteractor,
} = require('./validateDocketEntryInteractor');

const errorMessages = DocketEntryFactory.VALIDATION_ERROR_MESSAGES;

describe('validateDocketEntryInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateDocketEntryInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          DocketEntryFactory,
        }),
      },
      entryMetadata: {},
    });

    expect(errors).toEqual({
      dateReceived: errorMessages.dateReceived[1],
      documentType: 'Select a document type',
      eventCode: errorMessages.eventCode,
      partyPrimary: errorMessages.partyPrimary,
    });
  });

  it('returns no errors when valid docket entry is passed through', () => {
    const errors = validateDocketEntryInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          DocketEntryFactory,
        }),
      },
      entryMetadata: {
        category: 'Answer',
        dateReceived: '1212-12-12',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        eventCode: 'ATAN',
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
