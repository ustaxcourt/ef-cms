const assert = require('assert');

const Case = require('./Case');

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

  it('Creates an invalid case', () => {
    const myCase = new Case({
      documents: [
        {
          documentId: '123',
          documentType: 'testing',
        },
      ],
    });
    assert.ok(!myCase.isValid());
  });

  it('Creates an invalid case', () => {
    const myCase = new Case({
      documents: [],
    });
    assert.ok(!myCase.isValid());
  });

  it('Creates an invalid case', () => {
    const myCase = new Case({});
    assert.ok(!myCase.isValid());
  });
});
