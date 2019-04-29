const {
  CaseAssociationRequest,
} = require('../entities/CaseAssociationRequest');
const {
  validateCaseAssociationRequest,
} = require('./validateCaseAssociationRequestInteractor');

describe('validateCaseAssociationRequest', () => {
  it('returns the expected errors object on an empty case association request', () => {
    const errors = validateCaseAssociationRequest({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseAssociationRequest,
        }),
      },
      caseAssociationRequest: {},
    });

    expect(Object.keys(errors)).toEqual([
      'certificateOfService',
      'documentTitle',
      'documentType',
      'eventCode',
      'primaryDocumentFile',
      'scenario',
      'partyPrimary',
    ]);
  });

  it('returns null for a valid case association request', () => {
    const errors = validateCaseAssociationRequest({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseAssociationRequest,
        }),
      },
      caseAssociationRequest: {
        certificateOfService: true,
        certificateOfServiceDate: '1212-12-12',
        documentTitle: 'Entry of Appearance',
        documentType: 'Entry of Appearance',
        eventCode: '123',
        partyPrimary: true,
        primaryDocumentFile: {},
        scenario: 'Standard',
      },
    });

    expect(errors).toEqual(null);
  });
});
