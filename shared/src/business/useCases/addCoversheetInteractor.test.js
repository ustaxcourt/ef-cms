const {
  addCoversheetInteractor,
  generateCoverSheetData,
} = require('./addCoversheetInteractor');
const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const {
  CONTACT_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  PARTY_TYPES,
} = require('../entities/EntityConstants');

describe('addCoversheetInteractor', () => {
  const testingCaseData = {
    createdAt: '2019-04-19T14:45:15.595Z',
    docketEntries: [
      {
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        docketEntryId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        docketNumber: '101-19',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
        processingStatus: 'pending',
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      },
    ],
    docketNumber: '101-19',
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        contactType: CONTACT_TYPES.primary,
        name: 'Daenerys Stormborn',
      },
    ],
  };

  const optionalTestingCaseData = {
    ...testingCaseData,
    docketEntries: [
      {
        ...testingCaseData.docketEntries[0],
        addToCoversheet: true,
        additionalInfo: 'Additional Info Something',
        certificateOfService: true,
        certificateOfServiceDate: '2019-04-20T05:00:00.000Z',
        docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
        docketNumber: '102-19',
        documentType:
          'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
        eventCode: 'M008',
        filedBy: 'Test Petitioner1',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: true,
        lodged: true,
      },
    ],
    docketNumber: '102-19',
    partyType: PARTY_TYPES.petitionerSpouse,
    petitioners: [
      {
        contactType: CONTACT_TYPES.primary,
        name: 'Janie Petitioner',
      },
      {
        contactType: CONTACT_TYPES.secondary,
        name: 'Janie Petitioner',
      },
    ],
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
      .getCaseByDocketNumber.mockReturnValue(testingCaseData);

    const params = {
      docketEntryId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: '101-19',
    };

    await addCoversheetInteractor(applicationContext, params);

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
      .getCaseByDocketNumber.mockReturnValue(testingCaseData);

    const params = {
      docketEntryId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: '101-19',
      replaceCoversheet: true,
    };

    await addCoversheetInteractor(applicationContext, params);

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
      .getCaseByDocketNumber.mockReturnValue(testingCaseData);

    const params = {
      docketEntryId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: '101-19',
    };

    await addCoversheetInteractor(applicationContext, params);

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalled();
  });

  it("updates the document and docket record's page numbers", async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...testingCaseData,
      });

    const params = {
      docketEntryId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: '101-19',
    };

    await addCoversheetInteractor(applicationContext, params);

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalled();
  });

  it('adds a cover page to a pdf document with optional data', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(optionalTestingCaseData);

    const params = {
      docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
      docketNumber: '101-19',
    };

    await addCoversheetInteractor(applicationContext, params);

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('returns the updated docket entry entity', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...testingCaseData,
      });

    const params = {
      docketEntryId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      docketNumber: '101-19',
    };

    const updatedDocketEntryEntity = await addCoversheetInteractor(
      applicationContext,
      params,
    );

    expect(updatedDocketEntryEntity).toMatchObject({
      numberOfPages: 2,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    });
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
      docketEntries: [
        {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
          filingDate: '2019-04-19T14:45:15.595Z',
          isPaper: true,
          lodged: true,
        },
      ],
      docketNumber: '102-19',
      partyType: PARTY_TYPES.petitionerSpouse,
    };

    it('displays Certificate of Service when the document is filed with a certificate of service', async () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner, Petitioner',
        },
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: false,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          createdAt: null,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
          filingDate: '2019-04-19T14:45:15.595Z',
          isPaper: false,
        },
        filingDateUpdated: false,
      });

      expect(result.dateReceived).toEqual('04/19/19 10:45 am');
    });

    it('does not show the received date if the document does not have a valid createdAt and is electronically filed', async () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner, Petitioner',
        },
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          createdAt: null,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
          filingDate: '2019-04-19T14:45:15.595Z',
          isPaper: false,
        },
        filingDateUpdated: false,
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          createdAt: null,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        },
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
          isPaper: true,
          lodged: true,
        },
      });

      expect(result.caseCaptionExtension).toEqual(PARTY_TYPES.petitioner);
    });

    it('generates empty string for caseCaptionExtension if the caseCaption is not in the proper format', async () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner',
        },
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
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
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          initialCaption: 'Janie and Jackie Petitioner, Petitioners',
          initialDocketNumberSuffix: 'Z',
        },
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
          isPaper: false,
          lodged: true,
        },
        useInitialData: true,
      });

      expect(result.docketNumberWithSuffix).toEqual('102-19Z');
      expect(result.caseTitle).toEqual('Janie and Jackie Petitioner, ');
    });

    it('does NOT display dateReceived, electronicallyFiled, and dateServed when the coversheet is being generated for a court issued document', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner, Petitioner',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          initialCaption: 'Janie and Jackie Petitioner, Petitioners',
          initialDocketNumberSuffix: 'Z',
        },
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'USCA',
          isPaper: false,
          lodged: true,
          servedAt: '2019-04-20T14:45:15.595Z',
        },
        useInitialData: true,
      });

      expect(result.dateReceived).toBeUndefined();
      expect(result.electronicallyFiled).toBeUndefined();
      expect(result.dateServed).toBeUndefined();
    });

    it('sets the dateReceived to dateFiledFormatted when the filingDate has been updated', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner, Petitioner',
        },
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          createdAt: '2019-02-19T14:45:15.595Z',
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
          filingDate: '2019-05-19T14:45:15.595Z',
          isPaper: false,
        },
        filingDateUpdated: true,
      });

      expect(result.dateReceived).toBe('05/19/19');
    });

    it('sets the dateReceived to createdAt date when the filingDate has not been updated', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...caseData,
          caseCaption: 'Janie Petitioner, Petitioner',
        },
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'Additional Info Something',
          certificateOfService: true,
          createdAt: '2019-02-15T14:45:15.595Z',
          docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
          documentType:
            'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
          eventCode: 'M008',
          filingDate: '2019-05-19T14:45:15.595Z',
          isPaper: true,
        },
        filingDateUpdated: false,
      });

      expect(result.dateReceived).toBe('02/15/19');
    });
  });
});
