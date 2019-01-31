const assert = require('assert');
const { JSDOM } = require('jsdom');

const CaseInitiator = require('./CaseInitiator');

const jsdom = new JSDOM('');
global.Blob = jsdom.window.Blob;

describe('Petition entity', () => {
  it('Creates a valid petition', () => {
    const caseDetail = new CaseInitiator({
      petitionFile: new Blob(['blob']),
    });
    assert.ok(caseDetail.isValid());
  });
});
