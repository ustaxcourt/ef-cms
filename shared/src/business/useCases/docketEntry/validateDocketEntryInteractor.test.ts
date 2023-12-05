import { DocketEntryFactory } from '../../entities/docketEntry/DocketEntryFactory';
import { validateDocketEntryInteractor } from './validateDocketEntryInteractor';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

describe('validateDocketEntryInteractor', () => {
  it('returns the expected errors object on an empty docket entry', () => {
    const errors = validateDocketEntryInteractor({
      entryMetadata: { filers: [] },
    });

    expect(errors).toEqual({
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      filers: VALIDATION_ERROR_MESSAGES.filers,
      receivedAt: VALIDATION_ERROR_MESSAGES.receivedAt[1],
    });
  });

  it('returns no errors when valid docket entry is passed through', () => {
    const errors = validateDocketEntryInteractor({
      entryMetadata: {
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Answer',
        eventCode: 'A',
        filers: ['30016a85-dd92-4eba-8539-a8c9fd977e94'],
        lodged: false,
        ordinalValue: 'Other',
        otherIteration: '16',
        primaryDocumentFile: {},
        primaryDocumentFileSize: 1,
        receivedAt: '1987-08-06T07:53:09.001Z',
        scenario: 'Nonstandard G',
      },
    });

    expect(errors).toEqual(null);
  });
});
