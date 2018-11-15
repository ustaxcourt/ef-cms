const assert = require('assert');
const { JSDOM } = require('jsdom');

const CaseInitiator = require('./CaseInitiator');

describe('Case entity', () => {
  it('Creates a valid case', () => {
    const myCase = new Case({
      documents: [
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'a',
        },
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'b',
        },
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'c',
        },
      ],
    });
    assert.ok(myCase.isValid());
  });

  it('Creates a valid case', () => {
    const myCase = new Case({
      documents: [
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'a',
        },
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'b',
        },
        {
          documentId: 'z-1e47-423a-8caf-6d2fdc3d3859', // invalid uuid
          documentType: 'c',
        },
      ],
    });
    assert.ok(!myCase.isValid());
  });

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
