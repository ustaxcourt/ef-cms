const { createUploadPolicy, getDocumentDownloadUrl, createDocument } = require('./documentBlobDAO');
const chai = require('chai');
chai.use(require('chai-string'));
const expect = require('chai').expect;

describe('documentBlobDAO', () => {
  it('createUploadPolicy - should not fail if passed null', () => {
    createUploadPolicy();
  });

  it('getDocumentDownloadUrl - should throw an error when nothing is passed in', () => {
    let error;
    try {
      getDocumentDownloadUrl();
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
  });

  it('createDocument - should throw an error when nothing is passed in', () => {
    let error;
    try {
      createDocument();
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
  });
});