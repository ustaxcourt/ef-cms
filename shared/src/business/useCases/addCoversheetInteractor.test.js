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
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');

describe('addCoversheetInteractor', () => {
  const mockDocketEntryId = MOCK_CASE.docketEntries[0].docketEntryId;

  const testingCaseData = {
    ...MOCK_CASE,
    docketEntries: [
      {
        ...MOCK_CASE.docketEntries[0],
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentType: 'Answer',
        eventCode: 'A',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.pending,
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

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(testingCaseData);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });
  });

  it('adds a cover page to a pdf document', async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('replaces the cover page on a document', async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
      replaceCoversheet: true,
    });

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it("updates the docket entry's page numbers", async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalled();
  });

  it('adds a cover page to a pdf document with optional data', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(optionalTestingCaseData);

    await addCoversheetInteractor(applicationContext, {
      docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('returns the updated docket entry entity', async () => {
    const updatedDocketEntryEntity = await addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      },
    );

    expect(updatedDocketEntryEntity).toMatchObject({
      numberOfPages: 2,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    });
  });

  it('throws an error when unable to get the pdfData from s3', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => Promise.reject(new Error('error')),
    });

    await expect(
      addCoversheetInteractor(applicationContext, {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        replaceCoversheet: true,
      }),
    ).rejects.toThrow('error');
  });

  it('should call getCaseByDocketNumber to retrieve case entity if it is not passed in', async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toBe(MOCK_CASE.docketNumber);
  });

  it('should not call getCaseByDocketNumber if case entity is passed in', async () => {
    await addCoversheetInteractor(applicationContext, {
      caseEntity: new Case(testingCaseData, { applicationContext }),
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  describe('generateCoverSheetData', () => {
    it('displays Certificate of Service when the document is filed with a certificate of service', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          certificateOfService: true,
        },
      });

      expect(result.certificateOfService).toEqual(true);
    });

    it('does NOT display Certificate of Service when the document is filed without a certificate of service', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          certificateOfService: false,
        },
      });
      expect(result.certificateOfService).toEqual(false);
    });

    it('generates correct filed date', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          filingDate: '2019-04-19T14:45:15.595Z',
        },
      });

      expect(result.dateFiledLodged).toEqual('04/19/19');
    });

    it('shows does not show the filing date if the document does not have a valid filingDate', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          filingDate: null,
        },
      });

      expect(result.dateFiledLodged).toEqual('');
    });

    it('returns a filing date label of Filed if the document was NOT lodged', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          lodged: false,
        },
      });

      expect(result.dateFiledLodgedLabel).toEqual('Filed');
    });

    it('returns a filing date label of Lodged if the document was lodged', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          lodged: true,
        },
      });

      expect(result.dateFiledLodgedLabel).toEqual('Lodged');
    });

    it('shows the received date WITH time if electronically filed', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          filingDate: '2019-04-19T14:45:15.595Z',
          isPaper: false,
        },
        filingDateUpdated: false,
      });

      expect(result.dateReceived).toEqual('04/19/19 10:45 am');
    });

    it('does not show the received date if the document does not have a valid createdAt and is electronically filed', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          createdAt: null,
          isPaper: false,
        },
        filingDateUpdated: false,
      });

      expect(result.dateReceived).toEqual('');
    });

    it('shows the received date WITHOUT time if filed by paper', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          filingDate: '2019-04-19T14:45:15.595Z',
          isPaper: true,
        },
      });

      expect(result.dateReceived).toEqual('04/19/19');
    });

    it('shows does not show the received date if the document does not have a valid createdAt and is filed by paper', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          createdAt: null,
          isPaper: true,
        },
      });

      expect(result.dateReceived).toEqual('');
    });

    it('displays the date served if present in MMDDYYYY format', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          servedAt: '2019-04-20T14:45:15.595Z',
        },
      });

      expect(result.dateServed).toEqual('04/20/19');
    });

    it('does not display the service date if servedAt is not present', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          servedAt: undefined,
        },
      });

      expect(result.dateServed).toEqual('');
    });

    it('returns the docket number along with a Docket Number label', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: testingCaseData.docketEntries[0],
      });

      expect(result.docketNumberWithSuffix).toEqual(MOCK_CASE.docketNumber);
    });

    it('returns the docket number with suffix along with a Docket Number label', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...testingCaseData,
          caseCaption: 'Janie Petitioner, Petitioner',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        },
        docketEntryEntity: testingCaseData.docketEntries[0],
      });

      expect(result.docketNumberWithSuffix).toEqual(
        `${MOCK_CASE.docketNumber}${DOCKET_NUMBER_SUFFIXES.SMALL}`,
      );
    });

    it('displays Electronically Filed when the document is filed electronically', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          isPaper: false,
        },
      });

      expect(result.electronicallyFiled).toEqual(true);
    });

    it('does NOT display Electronically Filed when the document is filed by paper', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          isPaper: true,
        },
      });

      expect(result.electronicallyFiled).toEqual(false);
    });

    it('returns the mailing date if present', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          mailingDate: '04/16/2019',
        },
      });

      expect(result.mailingDate).toEqual('04/16/2019');
    });

    it('returns an empty string for the mailing date if NOT present', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          mailingDate: undefined,
        },
      });

      expect(result.mailingDate).toEqual('');
    });

    it('generates cover sheet data appropriate for multiple petitioners', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...testingCaseData,
          caseCaption: 'Janie Petitioner & Janie Petitioner, Petitioners',
        },
        docketEntryEntity: testingCaseData.docketEntries[0],
      });

      expect(result.caseCaptionExtension).toEqual('Petitioners');
    });

    it('generates cover sheet data appropriate for a single petitioner', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: testingCaseData.docketEntries[0],
      });

      expect(result.caseCaptionExtension).toEqual(PARTY_TYPES.petitioner);
    });

    it('generates empty string for caseCaptionExtension if the caseCaption is not in the proper format', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...testingCaseData,
          caseCaption: 'Janie Petitioner',
        },
        docketEntryEntity: testingCaseData.docketEntries[0],
      });

      expect(result.caseCaptionExtension).toEqual('');
    });

    it('preserves the original case caption and docket number when the useInitialData is true', () => {
      const mockInitialDocketNumberSuffix = 'Z';

      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: {
          ...testingCaseData,
          caseCaption: 'Janie Petitioner, Petitioner',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          initialCaption: 'Janie and Jackie Petitioner, Petitioners',
          initialDocketNumberSuffix: mockInitialDocketNumberSuffix,
        },
        docketEntryEntity: testingCaseData.docketEntries[0],
        useInitialData: true,
      });

      expect(result.docketNumberWithSuffix).toEqual(
        `${MOCK_CASE.docketNumber}${mockInitialDocketNumberSuffix}`,
      );
      expect(result.caseTitle).toEqual('Janie and Jackie Petitioner, ');
    });

    it('does NOT display dateReceived, electronicallyFiled, and dateServed when the coversheet is being generated for a court issued document', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          documentType: 'U.S.C.A',
          eventCode: 'USCA',
          lodged: true,
          servedAt: '2019-04-20T14:45:15.595Z',
        },
      });

      expect(result.dateReceived).toBeUndefined();
      expect(result.electronicallyFiled).toBeUndefined();
      expect(result.dateServed).toBeUndefined();
    });

    it('sets the dateReceived to dateFiledFormatted when the filingDate has been updated', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          filingDate: '2019-05-19T14:45:15.595Z',
        },
        filingDateUpdated: true,
      });

      expect(result.dateReceived).toBe('05/19/19');
    });

    it('sets the dateReceived to createdAt date when the filingDate has not been updated', () => {
      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          createdAt: '2019-02-15T14:45:15.595Z',
          filingDate: '2019-05-19T14:45:15.595Z',
          isPaper: true,
        },
        filingDateUpdated: false,
      });

      expect(result.dateReceived).toBe('02/15/19');
    });

    it('should use documentType as documentTitle if documentTitle is undefined', () => {
      const mockDocumentType = 'test doc type';

      const result = generateCoverSheetData({
        applicationContext,
        caseEntity: testingCaseData,
        docketEntryEntity: {
          ...testingCaseData.docketEntries[0],
          documentTitle: undefined,
          documentType: mockDocumentType,
        },
        filingDateUpdated: false,
      });

      expect(result.documentTitle).toBe(mockDocumentType);
    });
  });
});
