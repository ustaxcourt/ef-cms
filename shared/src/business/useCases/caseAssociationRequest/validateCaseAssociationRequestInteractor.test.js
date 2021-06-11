const {
  validateCaseAssociationRequestInteractor,
} = require('./validateCaseAssociationRequestInteractor');

describe('validateCaseAssociationRequest', () => {
  it('returns the expected errors object on an empty case association request', () => {
    const errors = validateCaseAssociationRequestInteractor({
      caseAssociationRequest: { filers: [] },
    });

    expect(Object.keys(errors)).toEqual([
      'certificateOfService',
      'documentTitleTemplate',
      'documentType',
      'eventCode',
      'primaryDocumentFile',
      'scenario',
      'filers',
    ]);
  });

  it('returns null for a valid case association request', () => {
    const errors = validateCaseAssociationRequestInteractor({
      caseAssociationRequest: {
        certificateOfService: true,
        certificateOfServiceDate: '1987-08-06T07:53:09.001Z',
        documentTitleTemplate: 'Entry of Appearance for [Petitioner Names]',
        documentType: 'Entry of Appearance',
        eventCode: 'A',
        filers: ['281f8b0bc2804c4daef66ee73d2611f6'],
        primaryDocumentFile: {},
        scenario: 'Standard',
      },
    });

    expect(errors).toEqual(null);
  });
});
