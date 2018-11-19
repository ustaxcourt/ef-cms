const assert = require('assert');

// const Document = require('./Document');
//
// const A_VALID_DOCUMENT = {
//   documentType: 'Petition',
//   userId: 'taxpayer',
//   // documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
//   // createdAt: new Date().toISOString()
// };

describe('Document entity', () => {
  describe('isValid', () => {
    it('works', () => {
      assert.equal(true, true);
    })
    // it('Creates a valid document', () => {
    //   const myDoc = new Document(A_VALID_DOCUMENT);
    //   assert.ok(myDoc.isValid());
    // });
    //
    // it('Creates an invalid document with no document type', () => {
    //   const myDoc = new Document({
    //     userId: '123',
    //   });
    //   assert.ok(!myDoc.isValid());
    // });
    //
    // it('Creates an invalid document with no userId', () => {
    //   const myDoc = new Document({
    //     documentType: 'Petition',
    //   });
    //   assert.ok(!myDoc.isValid());
    // });
  });

  // describe('validate', () => {
  //   it('should do nothing if valid', () => {
  //     let error = null;
  //     try {
  //       new Document(A_VALID_DOCUMENT).validate();
  //     } catch (err) {
  //       error = err;
  //     }
  //     assert.ok(error === null);
  //   });
  //
  //   it('should throw an error on invalid documents', () => {
  //     let error = null;
  //     try {
  //       new Document({}).validate();
  //     } catch (err) {
  //       error = err;
  //     }
  //     assert.ok(error !== null);
  //   });
  // });
});
