const {
  CourtIssuedDocumentFactory,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentFactory');
const {
  validateCourtIssuedDocketEntryInteractor,
} = require('./validateCourtIssuedDocketEntryInteractor');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');

describe('validateCourtIssuedDocketEntryInteractor', () => {
  it('returns null errors on empty entryMetadata', () => {
    const errors = validateCourtIssuedDocketEntryInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CourtIssuedDocumentFactory,
        }),
      },
      entryMetadata: {},
    });

    expect(errors).toBeUndefined();
  });

  it('returns expected errors when only scenario is set', () => {
    const errors = validateCourtIssuedDocketEntryInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CourtIssuedDocumentFactory,
        }),
      },
      entryMetadata: {
        scenario: 'Type A',
      },
    });

    expect(errors).toEqual({
      attachments: VALIDATION_ERROR_MESSAGES.attachments,
      documentType: VALIDATION_ERROR_MESSAGES.documentType,
      freeText: VALIDATION_ERROR_MESSAGES.freeText,
    });
  });

  it('returns no errors when all required data fields are set', () => {
    const errors = validateCourtIssuedDocketEntryInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CourtIssuedDocumentFactory,
        }),
      },
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
