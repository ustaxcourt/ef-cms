const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  PARTY_TYPES,
} = require('../entities/EntityConstants');
const { generateCoverSheetData } = require('./generateCoverSheetData');
const { MOCK_CASE } = require('../../test/mockCase');

describe('generateCoverSheetData', () => {
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

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(testingCaseData);

    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockResolvedValue({
        isFeatureFlagEnabled: true,
      });

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });
  });

  it('displays Certificate of Service when the document is filed with a certificate of service', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        certificateOfService: true,
      },
    });

    expect(result.certificateOfService).toEqual(true);
  });

  it('does NOT display Certificate of Service when the document is filed without a certificate of service', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        certificateOfService: false,
      },
    });
    expect(result.certificateOfService).toEqual(false);
  });

  it('generates correct filed date', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: '2019-04-19T14:45:15.595Z',
      },
    });

    expect(result.dateFiledLodged).toEqual('04/19/19');
  });

  it('should append the correct additionalInfo if addToCoversheet is set', async () => {
    const expectedAdditionalInfo = 'abc';

    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        addToCoversheet: true,
        additionalInfo: expectedAdditionalInfo,
        filingDate: '2019-04-19T14:45:15.595Z',
      },
    });

    expect(result.documentTitle).toEqual(`Petition ${expectedAdditionalInfo}`);
  });

  it('shows does not show the filing date if the document does not have a valid filingDate', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: null,
      },
    });

    expect(result.dateFiledLodged).toEqual('');
  });

  it('returns a filing date label of Filed if the document was NOT lodged', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        lodged: false,
      },
    });

    expect(result.dateFiledLodgedLabel).toEqual('Filed');
  });

  it('returns a filing date label of Lodged if the document was lodged', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        lodged: true,
      },
    });

    expect(result.dateFiledLodgedLabel).toEqual('Lodged');
  });

  it('shows the received date WITH time if electronically filed', async () => {
    const result = await generateCoverSheetData({
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

  it('does not show the received date if the document does not have a valid createdAt and is electronically filed', async () => {
    const result = await generateCoverSheetData({
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

  it('shows the received date WITHOUT time if filed by paper', async () => {
    const result = await generateCoverSheetData({
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

  it('shows does not show the received date if the document does not have a valid createdAt and is filed by paper', async () => {
    const result = await generateCoverSheetData({
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

  it('displays the date served if present in MMDDYYYY format', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        servedAt: '2019-04-20T14:45:15.595Z',
      },
    });

    expect(result.dateServed).toEqual('04/20/19');
  });

  it('does not display the service date if servedAt is not present', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        servedAt: undefined,
      },
    });

    expect(result.dateServed).toEqual('');
  });

  it('returns the docket number along with a Docket Number label', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
    });

    expect(result.docketNumberWithSuffix).toEqual(MOCK_CASE.docketNumber);
  });

  it('returns the docket number with suffix along with a Docket Number label', async () => {
    const result = await generateCoverSheetData({
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

  it('displays Electronically Filed when the document is filed electronically', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        isPaper: false,
      },
    });

    expect(result.electronicallyFiled).toEqual(true);
  });

  it('does NOT display Electronically Filed when the document is filed by paper', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        isPaper: true,
      },
    });

    expect(result.electronicallyFiled).toEqual(false);
  });

  it('returns the mailing date if present', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        mailingDate: '04/16/2019',
      },
    });

    expect(result.mailingDate).toEqual('04/16/2019');
  });

  it('returns the index of the docket entry as part of the coversheet data', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        mailingDate: '04/16/2019',
      },
    });

    expect(result.index).toEqual(testingCaseData.docketEntries[0].index);
  });

  it('returns an empty string for the mailing date if NOT present', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        mailingDate: undefined,
      },
    });

    expect(result.mailingDate).toEqual('');
  });

  it('generates cover sheet data appropriate for multiple petitioners', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        caseCaption: 'Janie Petitioner & Janie Petitioner, Petitioners',
      },
      docketEntryEntity: testingCaseData.docketEntries[0],
    });

    expect(result.caseCaptionExtension).toEqual('Petitioners');
  });

  it('generates cover sheet data appropriate for a single petitioner', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
    });

    expect(result.caseCaptionExtension).toEqual(PARTY_TYPES.petitioner);
  });

  it('generates empty string for caseCaptionExtension if the caseCaption is not in the proper format', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        caseCaption: 'Janie Petitioner',
      },
      docketEntryEntity: testingCaseData.docketEntries[0],
    });

    expect(result.caseCaptionExtension).toEqual('');
  });

  it('preserves the original case caption and docket number when the useInitialData is true', async () => {
    const mockInitialDocketNumberSuffix = 'Z';

    const result = await generateCoverSheetData({
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

  it('does NOT display dateReceived, electronicallyFiled, and dateServed when the coversheet is being generated for a court issued document', async () => {
    const result = await generateCoverSheetData({
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

  it('sets the dateReceived to dateFiledFormatted when the filingDate has been updated', async () => {
    const result = await generateCoverSheetData({
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

  it('sets the dateReceived to createdAt date when the filingDate has not been updated', async () => {
    const result = await generateCoverSheetData({
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

  it('should use documentType as documentTitle if documentTitle is undefined', async () => {
    const mockDocumentType = 'test doc type';

    const result = await generateCoverSheetData({
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

  it('should add the consolidatedCases array to the coversheet data if we are saving a unservable document on a lead case', async () => {
    const mockDocumentType = 'Hearing Exhibits';

    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValue([
        {
          docketEntries: [],
          docketNumber: '102-19',
        },
        {
          docketEntries: [
            {
              docketEntryId: testingCaseData.docketEntries[0].docketEntryId,
              index: 3,
            },
          ],
          docketNumber: '101-30',
        },

        {
          docketEntries: [
            {
              docketEntryId: testingCaseData.docketEntries[0].docketEntryId,
              index: 4,
            },
          ],
          docketNumber: '101-19',
        },
      ]);

    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        leadDocketNumber: testingCaseData.docketNumber,
      },
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        documentTitle: undefined,
        documentType: mockDocumentType,
        eventCode: 'HE',
      },
      filingDateUpdated: false,
    });

    // should be in ascending order
    expect(result.consolidatedCases.length).toEqual(2);
    expect(result.consolidatedCases[0]).toMatchObject({
      docketNumber: '101-19',
      documentNumber: 4,
    });
    expect(result.consolidatedCases[1]).toMatchObject({
      docketNumber: '101-30',
      documentNumber: 3,
    });
  });
});
