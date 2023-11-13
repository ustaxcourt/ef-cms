import {
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  DOCKET_NUMBER_SUFFIXES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  MULTI_DOCKET_FILING_EVENT_CODES,
  PARTY_TYPES,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { generateCoverSheetData } from './generateCoverSheetData';

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

  it('should append Certificate of Service to the coversheet when the document is filed with a Certificate of Service', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        certificateOfService: true,
      },
    } as any);

    expect(result.certificateOfService).toEqual(true);
  });

  it('should NOT append Certificate of Service to the coversheet when the document is filed without a Certificate of Service', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        certificateOfService: false,
      },
    } as any);

    expect(result.certificateOfService).toEqual(false);
  });

  it('should append the filing date to the coversheet formatted as "MM/DD/YY"', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: '2019-04-19T14:45:15.595Z',
      },
    } as any);

    expect(result.dateFiledLodged).toEqual('04/19/19');
  });

  it('should NOT append the filing date to the coversheet when it is not valid', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: null,
      },
    } as any);

    expect(result.dateFiledLodged).toEqual('');
  });

  it('should append additionalInfo to the coversheet when addToCoversheet is true', async () => {
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
    } as any);

    expect(result.documentTitle).toEqual(`Petition ${expectedAdditionalInfo}`);
  });

  it('should append "Filed" as filing date to the coversheet when the document is NOT lodged', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        lodged: false,
      },
    } as any);

    expect(result.dateFiledLodgedLabel).toEqual('Filed');
  });

  it('should append "Lodged" as filing date to the coversheet when the document is lodged', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        lodged: true,
      },
    } as any);

    expect(result.dateFiledLodgedLabel).toEqual('Lodged');
  });

  it('should append the received date WITH time to the coversheet when the document is electronically filed', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
      },
      filingDateUpdated: false,
    } as any);

    expect(result.dateReceived).toEqual('04/19/19 10:45 am');
  });

  it('should append the received date as an empty string to the coversheet when the document does not have a valid createdAt and is electronically filed', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        createdAt: null,
        isPaper: false,
      },
      filingDateUpdated: false,
    } as any);

    expect(result.dateReceived).toEqual('');
  });

  it('should append the received date WITHOUT time to the coversheet when the document is paper filed', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: true,
      },
    } as any);

    expect(result.dateReceived).toEqual('04/19/19');
  });

  it('should NOT append the received date to the coversheet when the document does not have a valid createdAt and is filed by paper', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        createdAt: null,
        isPaper: true,
      },
    } as any);

    expect(result.dateReceived).toEqual('');
  });

  it('should append the servedDate of the document to the coversheet when it is defined as "MM/DD/YY"', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        servedAt: '2019-04-20T14:45:15.595Z',
      },
    } as any);

    expect(result.dateServed).toEqual('04/20/19');
  });

  it('should append the servedDate of the document to the coversheet as an empty string when it is not defined', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        servedAt: undefined,
      },
    } as any);

    expect(result.dateServed).toEqual('');
  });

  it('should append the docketNumberWithSuffix as the docketNumber to the coversheet when case type suffix is undefined', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
    } as any);

    expect(result.docketNumberWithSuffix).toEqual(MOCK_CASE.docketNumber);
  });

  it('should append the docket number with suffix to the coversheet when the case has a suffix defined', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        caseCaption: 'Janie Petitioner, Petitioner',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      },
      docketEntryEntity: testingCaseData.docketEntries[0],
    } as any);

    expect(result.docketNumberWithSuffix).toEqual(
      `${MOCK_CASE.docketNumber}${DOCKET_NUMBER_SUFFIXES.SMALL}`,
    );
  });

  it('should return electronicallyFiled as true when the document is not paper filed', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        isPaper: false,
      },
    } as any);

    expect(result.electronicallyFiled).toEqual(true);
  });

  it('should return electronicallyFiled as false when the document is filed by paper', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        isPaper: true,
      },
    } as any);

    expect(result.electronicallyFiled).toEqual(false);
  });

  it('should append the mailing date to the coversheet when it is defined', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        mailingDate: '04/16/2019',
      },
    } as any);

    expect(result.mailingDate).toEqual('04/16/2019');
  });

  it('should append the index of the docket entry to the coversheet', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        mailingDate: '04/16/2019',
      },
    } as any);

    expect(result.index).toEqual(testingCaseData.docketEntries[0].index);
  });

  it('should append the mailingDate as an empty string to the coversheet when it is not defined', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        mailingDate: undefined,
      },
    } as any);

    expect(result.mailingDate).toEqual('');
  });

  it('should append caseCaptionExtension to the coversheet as "Petitioners" when there are multiple petitioners on the case', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        caseCaption: 'Janie Petitioner & Janie Petitioner, Petitioners',
      },
      docketEntryEntity: testingCaseData.docketEntries[0],
    } as any);

    expect(result.caseCaptionExtension).toEqual('Petitioners');
  });

  it('should append caseCaptionExtension to the coversheet as "Petitioner" when there is a single petitioner on the case', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
    } as any);

    expect(result.caseCaptionExtension).toEqual(PARTY_TYPES.petitioner);
  });

  it('should append an empty string for caseCaptionExtension to the coversheet when the caseCaption is not in the proper format', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        caseCaption: 'Janie Petitioner',
      },
      docketEntryEntity: testingCaseData.docketEntries[0],
    } as any);

    expect(result.caseCaptionExtension).toEqual('');
  });

  it('should append the original caseCaption and docketNumber to the coversheet when the useInitialData is true', async () => {
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
    } as any);

    expect(result.docketNumberWithSuffix).toEqual(
      `${MOCK_CASE.docketNumber}${mockInitialDocketNumberSuffix}`,
    );
    expect(result.caseTitle).toEqual('Janie and Jackie Petitioner, ');
  });

  it('should NOT append dateReceived, electronicallyFiled, and dateServed when the coversheet is being generated for a court issued document', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        dateReceived: '2012-04-20T14:45:15.595Z',
        electronicallyFiled: true,
        eventCode: COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET[0],
        servedAt: '2019-04-20T14:45:15.595Z',
      },
    } as any);

    expect(result.dateReceived).toBeUndefined();
    expect(result.electronicallyFiled).toBeUndefined();
    expect(result.dateServed).toBeUndefined();
  });

  it('should append dateRecieved as formatted dateFiled to the coversheet when the filingDateUpdated is true', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: '2019-05-19T14:45:15.595Z',
      },
      filingDateUpdated: true,
    } as any);

    expect(result.dateReceived).toBe('05/19/19');
  });

  it('should append dateReceived as createdAt date when the filingDateUpdated is false', async () => {
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
    } as any);

    expect(result.dateReceived).toBe('02/15/19');
  });

  it('should append documentType as documentTitle to the coversheet when documentTitle is undefined', async () => {
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
    } as any);

    expect(result.documentTitle).toBe(mockDocumentType);
  });

  it('should not call formatConsolidatedCaseCoversheetData if the document is not in a case in a consolidated group', async () => {
    await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
      },
    } as any);

    expect(
      applicationContext.getUseCaseHelpers()
        .formatConsolidatedCaseCoversheetData,
    ).not.toHaveBeenCalled();
  });

  it("should append consolidated group information to the coversheet when the document filed is a multi-docketable court-issued document and it's being filed in a case in a consolidated group", async () => {
    await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        leadDocketNumber: testingCaseData.docketNumber,
      },
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        eventCode: COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET[0],
      },
    } as any);

    expect(
      applicationContext.getUseCaseHelpers()
        .formatConsolidatedCaseCoversheetData,
    ).toHaveBeenCalled();
  });

  it('should append consolidated group information to the coversheet when the document filed is a multi-docketable paper filing being filed in a case in a consolidated group', async () => {
    await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        leadDocketNumber: testingCaseData.docketNumber,
      },
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
      },
    } as any);

    expect(
      applicationContext.getUseCaseHelpers()
        .formatConsolidatedCaseCoversheetData,
    ).toHaveBeenCalled();
  });
});
