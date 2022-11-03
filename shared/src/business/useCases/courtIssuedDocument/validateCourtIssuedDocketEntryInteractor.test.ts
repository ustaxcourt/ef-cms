import { VALIDATION_ERROR_MESSAGES } from '../../entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { validateCourtIssuedDocketEntryInteractor } from './validateCourtIssuedDocketEntryInteractor';

describe('validateCourtIssuedDocketEntryInteractor', () => {
  it('returns default errors on empty entryMetadata', () => {
    const errors = validateCourtIssuedDocketEntryInteractor({
      entryMetadata: {},
    });

    expect(errors).toEqual({
      documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
      documentType: VALIDATION_ERROR_MESSAGES.documentType,
    });
  });

  it('returns expected errors when only scenario is set', () => {
    const errors = validateCourtIssuedDocketEntryInteractor({
      entryMetadata: {
        scenario: 'Type A',
      },
    });

    expect(errors).toEqual({
      documentType: VALIDATION_ERROR_MESSAGES.documentType,
    });
  });

  it('returns expected errors when event code requires filing date but no date is provided', () => {
    const errors = validateCourtIssuedDocketEntryInteractor({
      entryMetadata: {
        eventCode: 'USCA',
        scenario: 'Type A',
      },
    });

    expect(errors.filingDate).toEqual(VALIDATION_ERROR_MESSAGES.filingDate);
  });

  it('returns no errors when all required data fields are set', () => {
    const errors = validateCourtIssuedDocketEntryInteractor({
      entryMetadata: {
        attachments: false,
        documentTitle: 'Order fixing amount of bond at [Anything]',
        documentType: 'OFAB - Order fixing amount of bond',
        eventCode: 'OFAB',
        freeText: 'something',
        scenario: 'Type A',
      },
    });

    expect(errors).toEqual(null);
  });
});
