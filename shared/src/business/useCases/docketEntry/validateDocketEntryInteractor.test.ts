import { validateDocketEntryInteractor } from './validateDocketEntryInteractor';

describe('validateDocketEntryInteractor', () => {
  it('returns the expected errors object on an empty docket entry', () => {
    const errors = validateDocketEntryInteractor({
      entryMetadata: { filers: [] },
    });

    expect(errors).toEqual({
      dateReceived: 'Enter a valid date received',
      documentType: 'Select a document type',
      eventCode: 'Select a document type',
      filers: 'Select a filing party',
    });
  });

  it('returns no errors when valid docket entry is passed through', () => {
    const errors = validateDocketEntryInteractor({
      entryMetadata: {
        category: 'Answer',
        dateReceived: '1987-08-06T07:53:09.001Z',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Answer',
        eventCode: 'A',
        filers: ['30016a85-dd92-4eba-8539-a8c9fd977e94'],
        lodged: false,
        ordinalValue: 'Other',
        otherIteration: '16',
        primaryDocumentFile: {},
        primaryDocumentFileSize: 1,
        scenario: 'Nonstandard G',
      },
    });

    expect(errors).toEqual(null);
  });
});
