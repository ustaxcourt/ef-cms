const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const {
  addCoverToPDFDocument,
} = require('./addCoverToPDFDocumentInteractor.js');
const { PDFDocumentFactory } = require('pdf-lib');
const testAssetsPath = path.join(__dirname, '../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../test-output/');

function testPdfDocBytes() {
  return fs.readFileSync(testAssetsPath + 'sample.pdf');
}

describe('addCoverToPDFDocument', () => {
  let testPdfDoc;

  beforeEach(() => {
    testPdfDoc = testPdfDocBytes();
  });

  it('adds a cover page to a pdf document', async () => {
    const getCaseByCaseIdStub = sinon.stub().resolves({
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      contactPrimary: {
        name: 'Johnny Taxpayer',
      },
      createdAt: '2019-04-19T14:45:15.595Z',
      docketNumber: '101-19',
      documents: [
        {
          certificateOfService: true,
          createdAt: '2019-04-19T14:45:15.595Z',
          documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'Answer',
          isPaper: false,
          processingStatus: 'pending',
          userId: 'petitionsclerk',
        },
      ],
    });
    const saveDocumentStub = sinon
      .stub()
      .callsFake(({ document: newPdfData }) => {
        fs.writeFile(testOutputPath + 'addCoverToPDFDocument.pdf', newPdfData);
      });
    const updateCaseStub = sinon.stub().resolves(null);
    const getObjectStub = sinon.stub().returns({
      promise: async () => ({
        Body: testPdfDoc,
      }),
    });

    const params = {
      applicationContext: {
        environment: { documentsBucketName: 'documents' },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdStub,
          saveDocument: saveDocumentStub,
          updateCase: updateCaseStub,
        }),
        getStorageClient: () => ({
          getObject: getObjectStub,
        }),
      },
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };

    const newPdfData = await addCoverToPDFDocument(params);

    const newPdfDoc = PDFDocumentFactory.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(saveDocumentStub.calledOnce).toBeTruthy();
    expect(newPdfDocPages.length).toEqual(2);
  });
});
