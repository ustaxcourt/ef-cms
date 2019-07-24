const {
  DocketEntryFactory,
} = require('../../entities/docketEntry/DocketEntryFactory');
const {
  validateDocketEntryInteractor,
} = require('./validateDocketEntryInteractor');

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
      dateReceived: 'Enter date received.',
      documentType: 'You must select a document type.',
      eventCode: 'Select a document type.',
      partyPrimary: 'Select a filing party.',
      primaryDocumentFile: 'A file was not selected.',
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
        scenario: 'Nonstandard G',
      },
    });

    expect(errors).toEqual(null);
  });
});
