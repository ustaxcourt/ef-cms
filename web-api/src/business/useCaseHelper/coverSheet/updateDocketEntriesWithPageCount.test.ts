import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateDocketEntriesWithPageCount } from './updateDocketEntriesWithPageCount';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { upsertDocketEntries as upsertDocketEntriesMock } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { Case } from '@shared/business/entities/cases/Case';

const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
const upsertDocketEntries = jest.mocked(upsertDocketEntriesMock);

describe('updateDocketEntriesWithPageCount', () => {
  const mockDocketEntryId = MOCK_CASE.docketEntries[0].docketEntryId;
  const mockDocketNumber = MOCK_CASE.docketNumber;
  const mockPageCount = 5;

  const testingCaseData = {
    ...MOCK_CASE,
    docketEntries: [
      {
        ...MOCK_CASE.docketEntries[0],
        docketEntryId: mockDocketEntryId,
        documentType: 'Answer',
        eventCode: 'A',
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
      },
    ],
  };

  beforeEach(() => {
    getCasesByDocketNumbers.mockResolvedValue([testingCaseData]);
    upsertDocketEntries.mockResolvedValue();
  });

  it('should update docket entries with the provided page count', async () => {
    const caseEntity = new Case(testingCaseData, {
      authorizedUser: mockDocketClerkUser,
    });

    const result = await updateDocketEntriesWithPageCount({
      authorizedUser: mockDocketClerkUser,
      caseEntity,
      consolidatedCases: undefined,
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
      pageCount: mockPageCount,
    });

    expect(getCasesByDocketNumbers).toHaveBeenCalledWith({
      docketNumbers: [mockDocketNumber],
    });
    expect(upsertDocketEntries).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].numberOfPages).toBe(mockPageCount);
    expect(result[0].processingStatus).toBe(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
  });

  it('should handle consolidated cases', async () => {
    const consolidatedDocketNumber = '102-20';
    const consolidatedCaseData = {
      ...testingCaseData,
      docketNumber: consolidatedDocketNumber,
    };

    getCasesByDocketNumbers.mockResolvedValue([
      testingCaseData,
      consolidatedCaseData,
    ]);

    const caseEntity = new Case(testingCaseData, {
      authorizedUser: mockDocketClerkUser,
    });

    const consolidatedCases = [
      { docketNumber: mockDocketNumber, documentNumber: '1' },
      { docketNumber: consolidatedDocketNumber, documentNumber: '2' },
    ];

    const result = await updateDocketEntriesWithPageCount({
      authorizedUser: mockDocketClerkUser,
      caseEntity,
      consolidatedCases,
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
      pageCount: mockPageCount,
    });

    expect(getCasesByDocketNumbers).toHaveBeenCalledWith({
      docketNumbers: [mockDocketNumber, consolidatedDocketNumber],
    });
    expect(result).toHaveLength(2);
    expect(result[0].numberOfPages).toBe(mockPageCount);
    expect(result[1].numberOfPages).toBe(mockPageCount);
  });

  it('should filter out cases without a document number in consolidated cases', async () => {
    const caseEntity = new Case(testingCaseData, {
      authorizedUser: mockDocketClerkUser,
    });

    const consolidatedCases = [
      { docketNumber: mockDocketNumber, documentNumber: '1' },
      { docketNumber: '102-20', documentNumber: undefined },
    ];

    await updateDocketEntriesWithPageCount({
      authorizedUser: mockDocketClerkUser,
      caseEntity,
      consolidatedCases,
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
      pageCount: mockPageCount,
    });

    expect(getCasesByDocketNumbers).toHaveBeenCalledWith({
      docketNumbers: [mockDocketNumber],
    });
  });

  it('should return only the docket entry matching the provided docket number', async () => {
    const caseEntity = new Case(testingCaseData, {
      authorizedUser: mockDocketClerkUser,
    });

    const result = await updateDocketEntriesWithPageCount({
      authorizedUser: mockDocketClerkUser,
      caseEntity,
      consolidatedCases: undefined,
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
      pageCount: mockPageCount,
    });

    expect(result[0].docketNumber).toBe(mockDocketNumber);
  });

  it('should filter out cases that do not have the passed in docket entry', async () => {
    const caseEntity = new Case(testingCaseData, {
      authorizedUser: mockDocketClerkUser,
    });

    const consolidatedCases = [
      { docketNumber: mockDocketNumber, documentNumber: '1' },
      { docketNumber: '102-20', documentNumber: '2' },
    ];

    getCasesByDocketNumbers.mockResolvedValueOnce([
      testingCaseData,
      {
        ...MOCK_CASE,
        docketNumber: '102-20',
        docketEntries: [],
      },
    ]);

    const result = await updateDocketEntriesWithPageCount({
      authorizedUser: mockDocketClerkUser,
      caseEntity,
      consolidatedCases,
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
      pageCount: mockPageCount,
    });

    expect(result[0].docketNumber).toBe(mockDocketNumber);
  });
});
