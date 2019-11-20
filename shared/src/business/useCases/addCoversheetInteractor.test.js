const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const {
  createISODateString,
  formatDateString,
  formatNow,
  prepareDateFromString,
} = require('../utilities/DateHandler');
const { addCoversheetInteractor } = require('./addCoversheetInteractor.js');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { PDFDocument } = require('pdf-lib');

const testAssetsPath = path.join(__dirname, '../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../test-output/');

const testPdfDocBytes = () => {
  // sample.pdf is a 1 page document
  return fs.readFileSync(testAssetsPath + 'sample.pdf');
};

describe('addCoversheetInteractor', () => {
  let testPdfDoc;

  const testingCaseData = {
    caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    contactPrimary: {
      name: 'Johnny Petitioner',
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
    partyType: ContactFactory.PARTY_TYPES.petitioner,
  };

  const optionalTestingCaseData = {
    ...testingCaseData,
    contactPrimary: {
      name: 'Janie Petitioner',
    },
    contactSecondary: {
      name: 'Janie Petitioner',
    },
    docketNumber: '102-19',
    documents: [
      {
        ...testingCaseData.documents[0],
        addToCoversheet: true,
        additionalInfo: 'Additional Info Something',
        certificateOfService: true,
        documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
        documentType:
          'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
        isPaper: true,
        lodged: true,
      },
    ],
    irsSendDate: '2019-04-19T14:45:15.595Z',
    partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
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
            formatNow,
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

    const newPdfData = await addCoversheetInteractor(params);

    const newPdfDoc = await PDFDocument.load(newPdfData);
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
            formatNow,
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

    const newPdfData = await addCoversheetInteractor(params);

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(saveDocumentStub.calledOnce).toBeTruthy();
    expect(newPdfDocPages.length).toEqual(2);
  });
});
