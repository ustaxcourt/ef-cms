import '@web-api/persistence/postgres/cases/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  PARTY_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { findUnauthorizedPublicFields } from '@shared/business/utilities/publicDataValidation';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getContactPrimary } from '@shared/business/entities/cases/Case';
import { getPublicCaseDocketEntriesInteractor } from './getPublicCaseDocketEntriesInteractor';

describe('getPublicCaseDocketEntriesInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;

  const mockCaseContactPrimary = getContactPrimary(MOCK_CASE);

  const mockCase = {
    ...MOCK_CASE,
    irsPractitioners: [],
    partyType: PARTY_TYPES.petitioner,
    petitioners: [mockCaseContactPrimary],
  };

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(mockCase);
  });

  it('should format the given docket number, removing leading zeroes and suffix', async () => {
    await getPublicCaseDocketEntriesInteractor({
      docketNumber: '0000123-19S',
    });

    expect(getCaseByDocketNumber.mock.calls[0][0]).toEqual({
      docketNumber: '123-19',
    });
  });

  it('should return a Not Found error when the case does not exist', async () => {
    getCaseByDocketNumber.mockResolvedValue({ archivedCorrespondences: [] });

    await expect(
      getPublicCaseDocketEntriesInteractor({
        docketNumber: '999-99',
      }),
    ).rejects.toThrow('Case 999-99 was not found.');
  });

  it('should return paginated docket entries with correct metadata', async () => {
    const result = await getPublicCaseDocketEntriesInteractor({
      docketNumber: mockCase.docketNumber,
      page: 0,
    });

    expect(result.page).toEqual(0);
    expect(result.pageSize).toEqual(1000);
    expect(result.totalCount).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.docketEntries)).toBe(true);
  });

  it('should return validated PublicDocketEntry entities', async () => {
    const result = await getPublicCaseDocketEntriesInteractor({
      docketNumber: mockCase.docketNumber,
      page: 0,
    });

    expect(result.docketEntries.length).toBeGreaterThan(0);
    result.docketEntries.forEach(docketEntry => {
      expect(docketEntry.entityName).toEqual('PublicDocketEntry');
      expect((docketEntry as any).isValidated).toBe(true);
    });
  });

  it('should return no unauthorized public fields', async () => {
    const result = await getPublicCaseDocketEntriesInteractor({
      docketNumber: mockCase.docketNumber,
      page: 0,
    });

    const findings = findUnauthorizedPublicFields({
      data: result,
      url: `http://localhost:4001/public-api/cases/${mockCase.docketNumber}/docket-entries`,
    });

    expect(findings).toEqual([]);
  });

  it('should default page to 0 when not provided', async () => {
    const result = await getPublicCaseDocketEntriesInteractor({
      docketNumber: mockCase.docketNumber,
    });

    expect(result.page).toEqual(0);
  });

  it('should return an empty page when page is within bounds but exceeds total entries', async () => {
    const result = await getPublicCaseDocketEntriesInteractor({
      docketNumber: mockCase.docketNumber,
      page: 20,
    });

    expect(result.docketEntries).toEqual([]);
    expect(result.page).toEqual(20);
  });

  it('should throw an error when page exceeds the maximum allowed page', async () => {
    await expect(
      getPublicCaseDocketEntriesInteractor({
        docketNumber: mockCase.docketNumber,
        page: 21,
      }),
    ).rejects.toThrow("Invalid page '21'. Must be a number between 0 and 20");
  });

  it('should throw an error when page is negative', async () => {
    await expect(
      getPublicCaseDocketEntriesInteractor({
        docketNumber: mockCase.docketNumber,
        page: -1,
      }),
    ).rejects.toThrow("Invalid page '-1'. Must be a number between 0 and 20");
  });

  it('should throw an error when page is NaN', async () => {
    await expect(
      getPublicCaseDocketEntriesInteractor({
        docketNumber: mockCase.docketNumber,
        page: NaN,
      }),
    ).rejects.toThrow("Invalid page 'NaN'. Must be a number between 0 and 20");
  });

  it('should retain motion visibility fields on public docket entries', async () => {
    const filingDate = createISODateString();
    const motionVisibilityDocketEntry = {
      ...MOCK_CASE.docketEntries[0],
      docketEntryId: applicationContext.getUniqueId(),
      documentTitle: 'Motion for Continuance',
      documentType: 'Motion for Continuance',
      eventCode: 'M006',
      filedByRole: ROLES.privatePractitioner,
      filingDate,
      isDraft: false,
      isOnDocketRecord: true,
      isPaper: true,
      isSealed: true,
      isStricken: false,
      lodged: true,
      previousDocument: {
        docketEntryId: applicationContext.getUniqueId(),
        documentTitle: 'Motion for Leave to File',
        documentType: 'Motion for Leave to File',
      },
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      receivedAt: filingDate,
      sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    };

    getCaseByDocketNumber.mockResolvedValue({
      ...mockCase,
      docketEntries: [motionVisibilityDocketEntry],
    });

    const result = await getPublicCaseDocketEntriesInteractor({
      docketNumber: mockCase.docketNumber,
    });

    expect(result.docketEntries).toHaveLength(1);
    expect(result.docketEntries[0]).toMatchObject({
      filedByRole: ROLES.privatePractitioner,
      filingDate: motionVisibilityDocketEntry.filingDate,
      isPaper: true,
      isSealed: true,
      isStricken: false,
      lodged: true,
      previousDocument: motionVisibilityDocketEntry.previousDocument,
      sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    });
  });
});
