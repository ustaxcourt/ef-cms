const assert = require('assert');

const CaseInitiatorResponse = require('./CaseInitiatorResponse');

describe('Petition entity', () => {
  it('Creates a valid petition', () => {
    const caseInitiatorResponse = new CaseInitiatorResponse({
      petitionDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      requestForPlaceOfTrialDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      statementOfTaxpayerIdentificationNumberDocumentId:
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    assert.ok(caseInitiatorResponse.isValid());
  });
  it('Creates an invalid petition', () => {
    const caseInitiatorResponse = new CaseInitiatorResponse({
      requestForPlaceOfTrialDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      statementOfTaxpayerIdentificationNumberDocumentId:
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    assert.ok(!caseInitiatorResponse.isValid());
  });
});
