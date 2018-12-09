const assert = require('assert');

const { CaseInitiatorResponse } = require('./CaseInitiatorResponse');

describe('CaseInitiatorResponse', () => {
  it('valid', () => {
    const caseInitiatorResponse = new CaseInitiatorResponse({
      petitionDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      requestForPlaceOfTrialDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      statementOfTaxpayerIdentificationNumberDocumentId:
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    assert.ok(caseInitiatorResponse.isValid());
  });

  describe('invalid', () => {
    it('missing petitionDocumentId', () => {
      const caseInitiatorResponse = new CaseInitiatorResponse({
        requestForPlaceOfTrialDocumentId:
          'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        statementOfTaxpayerIdentificationNumberDocumentId:
          'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
      assert.ok(!caseInitiatorResponse.isValid());
    });
    it('missing requestForPlaceOfTrialDocumentId', () => {
      const caseInitiatorResponse = new CaseInitiatorResponse({
        petitionDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        statementOfTaxpayerIdentificationNumberDocumentId:
          'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
      assert.ok(!caseInitiatorResponse.isValid());
    });
    it('missing statementOfTaxpayerIdentificationNumberDocumentId', () => {
      const caseInitiatorResponse = new CaseInitiatorResponse({
        petitionDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        requestForPlaceOfTrialDocumentId:
          'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
      assert.ok(!caseInitiatorResponse.isValid());
    });
    it('non guid properties', () => {
      const caseInitiatorResponse = new CaseInitiatorResponse({
        petitionDocumentId: 'not a uuid',
        statementOfTaxpayerIdentificationNumberDocumentId: 'not a uuid',
        requestForPlaceOfTrialDocumentId: 'not a uuid',
      });
      assert.ok(!caseInitiatorResponse.isValid());
    });
  });
});
