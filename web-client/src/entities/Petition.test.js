import assert from 'assert';
import { JSDOM } from 'jsdom';

import Petition from './Petition';

const jsdom = new JSDOM('');
global.Blob = jsdom.window.Blob;

describe('Petition entity', () => {
  it('Creates a valid petition', () => {
    const petition = new Petition({
      petitionFile: new Blob(['blob']),
      requestForPlaceOfTrial: new Blob(['blob']),
      statementOfTaxpayerIdentificationNumber: new Blob(['blob']),
    });
    assert.ok(petition.isValid());
  });
  it('Creates an invalid petition', () => {
    const petition = new Petition({
      petitionFile: new Blob(['blob']),
      requestForPlaceOfTrial: new Blob(['blob']),
      statementOfTaxpayerIdentificationNumber: undefined,
    });
    assert.ok(!petition.isValid());
  });
});
