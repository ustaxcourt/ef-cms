const fs = require('fs');
const path = require('path');
const {
  addCoversheetInteractor,
  generateCoverSheetData,
} = require('./addCoversheetInteractor.js');
const {
  createISODateString,
  formatDateString,
  formatNow,
  prepareDateFromString,
} = require('../utilities/DateHandler');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { getChromiumBrowser } = require('../utilities/getChromiumBrowser');
const { MOCK_USERS } = require('../../test/mockUsers');
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
        filingDate: '2019-04-19T14:45:15.595Z',
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
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: true,
        lodged: true,
      },
    ],
    irsSendDate: '2019-04-19T14:45:15.595Z',
    partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
  };

  const updateDocumentProcessingStatusStub = jest.fn(() => null);
  const getObjectStub = jest.fn(() => ({
    promise: async () => ({
      Body: testPdfDoc,
    }),
  }));

  let getChromiumBrowserStub;
  let getCaseByCaseIdStub;
  let saveDocumentFromLambdaStub;
  let applicationContext;

  beforeEach(() => {
    testPdfDoc = testPdfDocBytes();

    getChromiumBrowserStub = jest.fn(async () => {
      return await getChromiumBrowser();
    });

    applicationContext = {
      environment: { documentsBucketName: 'documents' },
      getCaseCaptionNames: Case.getCaseCaptionNames,
      getChromiumBrowser: getChromiumBrowserStub,
      getCurrentUser: () => MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdStub,
        saveDocumentFromLambda: saveDocumentFromLambdaStub,
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
        error: e => console.log(e),
        time: () => null,
        timeEnd: () => null,
      },
    };
  });

  it('adds a cover page to a pdf document', async () => {
    getCaseByCaseIdStub = jest.fn(() => testingCaseData);
    saveDocumentFromLambdaStub = jest.fn(({ document: newPdfData }) => {
      fs.writeFileSync(
        testOutputPath + 'addCoverToPDFDocument_1.pdf',
        newPdfData,
      );
    });

    const params = {
      applicationContext,
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };

    const newPdfData = await addCoversheetInteractor(params);

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(saveDocumentFromLambdaStub).toHaveBeenCalled();
    expect(newPdfDocPages.length).toEqual(2);
    expect(getChromiumBrowserStub).toHaveBeenCalled();
  });

  it('adds a cover page to a pdf document with optional data', async () => {
    getCaseByCaseIdStub = jest.fn(() => optionalTestingCaseData);
    saveDocumentFromLambdaStub = jest.fn(({ document: newPdfData }) => {
      fs.writeFileSync(
        testOutputPath + 'addCoverToPDFDocument_2.pdf',
        newPdfData,
      );
    });

    const params = {
      applicationContext,
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
    };

    const newPdfData = await addCoversheetInteractor(params);

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(saveDocumentFromLambdaStub).toHaveBeenCalled();
    expect(newPdfDocPages.length).toEqual(2);
  });

  describe('coversheet data generator', () => {
    let caseData, applicationContext;
    beforeEach(() => {
      applicationContext = {
        getCaseCaptionNames: Case.getCaseCaptionNames,
        getCurrentUser: () =>
          MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
        getUtilities: () => {
          return {
            formatDateString,
          };
        },
      };
      caseData = {
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
            filingDate: '2019-04-19T14:45:15.595Z',
            isPaper: true,
            lodged: true,
          },
        ],
        irsSendDate: '2019-04-19T14:45:15.595Z',
        partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
      };
    });

    it('generates cover sheet data appropriate for multiple petitioners', async () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner & Janie Petitioner, Petitioners',
        },
        documentEntity: {
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
      });
      expect(result.caseCaptionPostfix).toEqual('Petitioners');
    });

    it('generates cover sheet data appropriate for a single petitioner', async () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner, Petitioner',
        },
        documentEntity: {
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
      });
      expect(result.caseCaptionPostfix).toEqual('Petitioner');
    });

    it('generates empty string for caseCaptionPostfix if the caseCaption is not in the proper format', async () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner',
        },
        documentEntity: {
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
      });
      expect(result.caseCaptionPostfix).toEqual('');
    });

    it('generates correct filed date', async () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner, Petitioner',
        },
        documentEntity: {
          ...testingCaseData.documents[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          filingDate: '2019-04-19T14:45:15.595Z',
          isPaper: true,
        },
      });
      expect(result.dateFiled).toEqual('04/19/2019');
    });
  });
});
