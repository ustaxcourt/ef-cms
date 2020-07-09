const fs = require('fs');
const path = require('path');
const {
  addCoversheetInteractor,
  generateCoverSheetData,
} = require('./addCoversheetInteractor.js');
const { applicationContext } = require('../test/createTestApplicationContext');
const { PARTY_TYPES } = require('../entities/EntityConstants');

describe('addCoversheetInteractor', () => {
  const testAssetsPath = path.join(__dirname, '../../../test-assets/');

  const testPdfDocBytes = () => {
    // sample.pdf is a 1 page document
    return new Uint8Array(fs.readFileSync(testAssetsPath + 'sample.pdf'));
  };

  const testPdfDoc = testPdfDocBytes();

  const testingCaseData = {
    caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    contactPrimary: {
      name:
        'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
    },
    createdAt: '2019-04-19T14:45:15.595Z',
    docketNumber: '101-19',
    documents: [
      {
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Answer',
        filedBy: 'Test Petitioner',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
        processingStatus: 'pending',
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      },
    ],
    partyType: PARTY_TYPES.petitioner,
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
        certificateOfServiceDate: '2019-04-20',
        documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
        documentType:
          'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
        filedBy: 'Test Petitioner1',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: true,
        lodged: true,
      },
    ],
    partyType: PARTY_TYPES.petitionerSpouse,
  };

  beforeAll(() => {
    jest.setTimeout(30000);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: testPdfDoc,
      }),
    });
  });

  it('adds a cover page to a pdf document', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(testingCaseData);

    const params = {
      applicationContext,
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };

    await addCoversheetInteractor(params);

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('replaces the cover page on a document', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(testingCaseData);

    const params = {
      applicationContext,
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      replaceCoversheet: true,
    };

    await addCoversheetInteractor(params);

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it("updates the document's page numbers", async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(testingCaseData);

    const params = {
      applicationContext,
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };

    await addCoversheetInteractor(params);

    expect(
      applicationContext.getPersistenceGateway().updateDocument,
    ).toHaveBeenCalled();
  });

  it("updates the document and docket record's page numbers", async () => {
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      ...testingCaseData,
      docketRecord: [
        {
          description: 'Test Docket Record',
          documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          eventCode: 'O',
          filingDate: new Date('2000-01-01').toISOString(),
          index: 0,
        },
      ],
    });

    const params = {
      applicationContext,
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };

    await addCoversheetInteractor(params);

    expect(
      applicationContext.getPersistenceGateway().updateDocument,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateDocketRecord,
    ).toHaveBeenCalled();
  });

  it('adds a cover page to a pdf document with optional data', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(optionalTestingCaseData);

    const params = {
      applicationContext,
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
    };

    await addCoversheetInteractor(params);

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  describe('coversheet data generator', () => {
    const caseData = {
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
      partyType: PARTY_TYPES.petitionerSpouse,
    };

    it('displays Certificate of Service when the document is filed with a certificate of service', async () => {
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
          isPaper: false,
        },
      });

      expect(result.certificateOfService).toEqual(true);
    });

    it('does NOT display Certificate of Service when the document is filed without a certificate of service', async () => {
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
          certificateOfService: false,
          documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          filingDate: '2019-04-19T14:45:15.595Z',
          isPaper: true,
        },
      });
      expect(result.certificateOfService).toEqual(false);
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

      expect(result.dateFiledLodged).toEqual('04/19/19');
    });

    it('shows does not show the filing date if the document does not have a valid filingDate', async () => {
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
          createdAt: null,
          documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          filingDate: null,
        },
      });

      expect(result.dateFiledLodged).toEqual('');
    });

    it('returns a filing date label of Filed if the document was NOT lodged', async () => {
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
          isPaper: false,
        },
      });

      expect(result.dateFiledLodgedLabel).toEqual('Filed');
    });

    it('returns a filing date label of Lodged if the document was lodged', async () => {
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
          isPaper: false,
          lodged: true,
        },
      });

      expect(result.dateFiledLodgedLabel).toEqual('Lodged');
    });

    it('shows the received date WITH time if electronically filed', async () => {
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
          isPaper: false,
        },
      });

      expect(result.dateReceived).toEqual('04/19/19 10:45 am');
    });

    it('shows does not show the received date if the document does not have a valid createdAt and is electronically filed', async () => {
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
          createdAt: null,
          documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          filingDate: '2019-04-19T14:45:15.595Z',
          isPaper: false,
        },
      });

      expect(result.dateReceived).toEqual('');
    });

    it('shows the received date WITHOUT time if filed by paper', async () => {
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

      expect(result.dateReceived).toEqual('04/19/19');
    });

    it('shows does not show the received date if the document does not have a valid createdAt and is filed by paper', async () => {
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
          createdAt: null,
          documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          filingDate: '2019-04-19T14:45:15.595Z',
          isPaper: true,
        },
      });

      expect(result.dateReceived).toEqual('');
    });

    it('displays the date served if present in MMDDYYYY format', async () => {
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
          isPaper: false,
          lodged: true,
          servedAt: '2019-04-20T14:45:15.595Z',
        },
      });

      expect(result.dateServed).toEqual('04/20/19');
    });

    it('does not display the service date if servedAt is not present', async () => {
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
          isPaper: false,
          lodged: true,
        },
      });

      expect(result.dateServed).toEqual('');
    });

    it('returns the docket number along with a Docket Number label', async () => {
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
          isPaper: false,
          lodged: true,
        },
      });

      expect(result.docketNumberWithSuffix).toEqual('102-19');
    });

    it('returns the docket number with suffix along with a Docket Number label', async () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner, Petitioner',
          docketNumberSuffix: 'S',
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
          isPaper: false,
          lodged: true,
        },
      });

      expect(result.docketNumberWithSuffix).toEqual('102-19S');
    });

    it('displays Electronically Filed when the document is filed electronically', async () => {
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
          isPaper: false,
        },
      });

      expect(result.electronicallyFiled).toEqual(true);
    });

    it('does NOT display Electronically Filed when the document is filed by paper', async () => {
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

      expect(result.electronicallyFiled).toEqual(false);
    });

    it('returns the mailing date if present', async () => {
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
          mailingDate: '04/16/2019',
        },
      });

      expect(result.mailingDate).toEqual('04/16/2019');
    });

    it('returns an empty string for the mailing date if NOT present', async () => {
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

      expect(result.mailingDate).toEqual('');
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

      expect(result.caseCaptionExtension).toEqual('Petitioners');
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

      expect(result.caseCaptionExtension).toEqual('Petitioner');
    });

    it('generates empty string for caseCaptionExtension if the caseCaption is not in the proper format', async () => {
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

      expect(result.caseCaptionExtension).toEqual('');
    });

    it('preserves the original case caption and docket number when the useInitialData is true', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner, Petitioner',
          docketNumberSuffix: 'S',
          initialCaption: 'Janie and Jackie Petitioner, Petitioners',
          initialDocketNumberSuffix: 'Z',
        },
        documentEntity: {
          ...testingCaseData.documents[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          isPaper: false,
          lodged: true,
        },
        useInitialData: true,
      });

      expect(result.docketNumberWithSuffix).toEqual('102-19Z');
      expect(result.caseTitle).toEqual('Janie and Jackie Petitioner, ');
    });
  });
});
