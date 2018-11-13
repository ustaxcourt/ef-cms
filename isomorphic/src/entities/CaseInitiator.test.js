const assert = require('assert');
const { JSDOM } = require('jsdom');

const CaseInitiator = require('./CaseInitiator');

const jsdom = new JSDOM('');
global.Blob = jsdom.window.Blob;

describe('CaseInitiator entity', () => {
  it('Creates a valid CaseInitiator', () => {
    const caseInitiator = new CaseInitiator({
      petitionFile: new Blob(['blob']),
      requestForPlaceOfTrial: new Blob(['blob']),
      statementOfTaxpayerIdentificationNumber: new Blob(['blob']),
    });
    assert.ok(caseInitiator.isValid());
  });
  it('Creates an invalid petition', () => {
    const caseInitiator = new CaseInitiator({
      petitionFile: new Blob(['blob']),
      requestForPlaceOfTrial: new Blob(['blob']),
      statementOfTaxpayerIdentificationNumber: undefined,
    });
    assert.ok(!caseInitiator.isValid());
  });
});
