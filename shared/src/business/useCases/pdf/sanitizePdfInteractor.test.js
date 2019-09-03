const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const { PDFDocument } = require('pdf-lib');
const { sanitizePdfInteractor } = require('./sanitizePdfInteractor');

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../../test-output/');

const testAsset = name => {
  // sample.pdf is a 1 page document
  return fs.readFileSync(testAssetsPath + name);
};

describe('sanitizePdf', () => {
  describe('writes and reads to filesystem', () => {
    let params, saveDocumentStub, getObject;
    beforeEach(() => {
      getObject = sinon.stub().returns({
        promise: async () => ({
          Body: testAsset('sample.pdf'),
        }),
      });
      saveDocumentStub = sinon.stub().callsFake(({ document: newPdfData }) => {
        fs.writeFileSync(testOutputPath + 'sanitizePdf_1.pdf', newPdfData);
      });

      params = {
        applicationContext: {
          environment: { documentsBucketName: 'documents' },
          getPersistenceGateway: () => ({
            saveDocument: saveDocumentStub,
          }),
          getStorageClient: () => ({
            getObject,
            putObjectTagging: () => {},
          }),

          logger: {
            time: () => null,
            timeEnd: () => null,
          },
        },
        documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      };
    });

    it('sanitizes an original and returns new data with same number of pages for a valid document', async () => {
      const result = await sanitizePdfInteractor(params);
      const newPdfDoc = await PDFDocument.load(result);
      const newPdfDocPages = newPdfDoc.getPages();

      expect(saveDocumentStub.calledOnce).toBeTruthy();
      expect(newPdfDocPages.length).toEqual(1);
    });

    it('returns an error if the document cannot be processed', async () => {
      getObject = sinon.stub().returns({
        promise: async () => ({
          Body: testAsset('not-a-pdf.pdf'),
        }),
      });

      let err;
      try {
        err = await sanitizePdfInteractor(params);
      } catch (e) {
        err = true;
      }
      expect(err).toBeTruthy();
    });
  });
});
