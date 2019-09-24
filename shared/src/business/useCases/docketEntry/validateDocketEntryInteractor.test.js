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
      applicationContext: {
        getEntityConstructors: () => ({
          DocketEntryFactory,
        }),
      },
      entryMetadata: {},
    });

    expect(errors).toEqual({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[1],
      documentType: VALIDATION_ERROR_MESSAGES.documentType,
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      partyPrimary: VALIDATION_ERROR_MESSAGES.partyPrimary,
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
