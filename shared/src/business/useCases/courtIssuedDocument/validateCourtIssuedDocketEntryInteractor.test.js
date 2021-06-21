const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateCourtIssuedDocketEntryInteractor,
} = require('./validateCourtIssuedDocketEntryInteractor');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');

describe('validateCourtIssuedDocketEntryInteractor', () => {
  it('returns default errors on empty entryMetadata', () => {
    const errors = validateCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        entryMetadata: {},
      },
    );

    expect(errors).toEqual({
      documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
      documentType: VALIDATION_ERROR_MESSAGES.documentType,
    });
  });

  it('returns expected errors when only scenario is set', () => {
    const errors = validateCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        entryMetadata: {
          scenario: 'Type A',
        },
      },
    );

    expect(errors).toEqual({
      documentType: VALIDATION_ERROR_MESSAGES.documentType,
    });
  });

  it('returns expected errors when event code requires filing date but no date is provided', () => {
    const errors = validateCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        entryMetadata: {
          eventCode: 'USCA',
          scenario: 'Type A',
        },
      },
    );

    expect(errors.filingDate).toEqual(VALIDATION_ERROR_MESSAGES.filingDate);
  });

  it('returns no errors when all required data fields are set', () => {
    const errors = validateCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        entryMetadata: {
          attachments: false,
          documentTitle: 'Order fixing amount of bond at [Anything]',
          documentType: 'OFAB - Order fixing amount of bond',
          eventCode: 'OFAB',
          freeText: 'something',
          scenario: 'Type A',
        },
      },
    );

    expect(errors).toEqual(null);
  });
});
