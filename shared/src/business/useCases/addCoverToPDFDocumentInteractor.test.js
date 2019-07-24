const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const {
  addCoverToPDFDocumentInteractor,
} = require('./addCoverToPDFDocumentInteractor.js');
const { PDFDocumentFactory } = require('pdf-lib');
const testAssetsPath = path.join(__dirname, '../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../test-output/');
const {
  createISODateString,
  formatDateString,
  prepareDateFromString,
} = require('../utilities/DateHandler');

const testPdfDocBytes = () => {
  // sample.pdf is a 1 page document
  return fs.readFileSync(testAssetsPath + 'sample.pdf');
};

describe('addCoverToPDFDocumentInteractor', () => {
  let testPdfDoc;

  const testingCaseData = {
    caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    contactPrimary: {
      name: 'Johnny Taxpayer',
    },
    createdAt: '2019-04-19T14:45:15.595Z',
    docketNumber: '101-19',
    documents: [
      {
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Answer',
        isPaper: false,
        processingStatus: 'pending',
        userId: 'petitionsclerk',
      },
    ],
    partyType: 'Petitioner',
  };

  const optionalTestingCaseData = {
    ...testingCaseData,
    contactPrimary: {
      name: 'Janie Taxpayer',
    },
    contactSecondary: {
      name: 'Janie Taxpayer',
    },
    docketNumber: '102-19',
    documents: [
      {
        ...testingCaseData.documents[0],
        certificateOfService: true,
        documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
        documentType:
          'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
        lodged: true,
        additionalInfo: 'Additional Info Something',
        addToCoversheet: true,
      },
    ],
    irsSendDate: '2019-04-19T14:45:15.595Z',
    partyType: 'Petitioner & Spouse',
  };

  const updateDocumentProcessingStatusStub = sinon.stub().resolves(null);
  const getObjectStub = sinon.stub().returns({
    promise: async () => ({
      Body: testPdfDoc,
    }),
  });

  beforeEach(() => {
    testPdfDoc = testPdfDocBytes();
  });

  it('adds a cover page to a pdf document', async () => {
    const getCaseByCaseIdStub = sinon.stub().resolves(testingCaseData);

    const saveDocumentStub = sinon
      .stub()
      .callsFake(({ document: newPdfData }) => {
        fs.writeFileSync(
          testOutputPath + 'addCoverToPDFDocument_1.pdf',
          newPdfData,
        );
      });

    const params = {
      applicationContext: {
        environment: { documentsBucketName: 'documents' },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdStub,
          saveDocument: saveDocumentStub,
          updateDocumentProcessingStatus: updateDocumentProcessingStatusStub,
        }),
        getStorageClient: () => ({
          getObject: getObjectStub,
        }),
        getUtilities: () => {
          return {
            createISODateString,
            formatDateString,
            prepareDateFromString,
          };
        },
        logger: {
          time: () => null,
          timeEnd: () => null,
        },
      },
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };

    const newPdfData = await addCoverToPDFDocumentInteractor(params);

    const newPdfDoc = PDFDocumentFactory.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(saveDocumentStub.calledOnce).toBeTruthy();
    expect(newPdfDocPages.length).toEqual(2);
  });

  it('adds a cover page to a pdf document with optional data', async () => {
    const getCaseByCaseIdStub = sinon.stub().resolves(optionalTestingCaseData);

    const saveDocumentStub = sinon
      .stub()
      .callsFake(({ document: newPdfData }) => {
        fs.writeFileSync(
          testOutputPath + 'addCoverToPDFDocument_2.pdf',
          newPdfData,
        );
      });

    const params = {
      applicationContext: {
        environment: { documentsBucketName: 'documents' },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdStub,
          saveDocument: saveDocumentStub,
          updateDocumentProcessingStatus: updateDocumentProcessingStatusStub,
        }),
        getStorageClient: () => ({
          getObject: getObjectStub,
        }),
        getUtilities: () => {
          return {
            createISODateString,
            formatDateString,
            prepareDateFromString,
          };
        },
        logger: {
          time: () => null,
          timeEnd: () => null,
        },
      },
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
    };

    const newPdfData = await addCoverToPDFDocumentInteractor(params);

    const newPdfDoc = PDFDocumentFactory.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(saveDocumentStub.calledOnce).toBeTruthy();
    expect(newPdfDocPages.length).toEqual(2);
  });
});
