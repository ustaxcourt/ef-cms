import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { MOCK_CASE } from '../../test/mockCase';
import { ROLES } from '../entities/EntityConstants';
import { getCaseDocketEntriesInteractor } from './getCaseDocketEntriesInteractor';
import {
  mockDocketClerkUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getWorkItemsByDocketNumber as getWorkItemsByDocketNumberMock } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { WorkItem } from '@shared/business/entities/WorkItem';

describe('getCaseDocketEntriesInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getWorkItemsByDocketNumber = jest.mocked(
    getWorkItemsByDocketNumberMock,
  );

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue({ ...MOCK_CASE });
    getWorkItemsByDocketNumber.mockResolvedValue([]);
  });

  it('should throw UnauthorizedError if user is not a valid AuthUser', async () => {
    const invalidUser = {
      email: 'someone@example.com',
      name: 'Some Body',
    };

    await expect(
      getCaseDocketEntriesInteractor(
        { docketNumber: '123-45' },
        invalidUser as any,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw NotFoundError when the case does not exist', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      archivedCorrespondences: [],
      archivedDocketEntries: [],
      associatedJudge: [],
      correspondence: [],
      docketEntries: [],
      irsPractitioners: [],
      privatePractitioners: [],
    });

    await expect(
      getCaseDocketEntriesInteractor(
        { docketNumber: '999-99' },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Case 999-99 was not found.');
  });

  it('should return paginated docket entries with correct metadata', async () => {
    const result = await getCaseDocketEntriesInteractor(
      { docketNumber: MOCK_CASE.docketNumber, page: 0 },
      mockDocketClerkUser,
    );

    expect(result.page).toEqual(0);
    expect(result.pageSize).toEqual(1000);
    expect(result.totalCount).toEqual(result.docketEntries.length);
    expect(result.docketEntries.length).toBeGreaterThan(0);
  });

  it('should default page to 0 when not provided', async () => {
    const result = await getCaseDocketEntriesInteractor(
      { docketNumber: MOCK_CASE.docketNumber },
      mockDocketClerkUser,
    );

    expect(result.page).toEqual(0);
  });

  it('should enrich docket entries with work item info', async () => {
    const docketEntries = [
      {
        docketNumber: MOCK_CASE.docketNumber,
        docketEntryId: '0d9119cb-c6f9-4fc0-8986-def8373b93ca',
      },
      {
        docketNumber: MOCK_CASE.docketNumber,
        docketEntryId: '83c4b4eb-6b31-4bf6-a178-79544c50d12b',
      },
    ];

    getCaseByDocketNumber.mockResolvedValueOnce({
      ...MOCK_CASE,
      docketEntries,
    });

    const workItems = [
      {
        docketNumber: MOCK_CASE.docketNumber,
        docketEntryId: docketEntries[0].docketEntryId,
        workItemId: '1d9119cb-c6f9-4fc0-8986-def8373b93ca',
        isRead: true,
        completedAt: '2019-09-19T16:42:00.000Z',
      },
      {
        docketNumber: MOCK_CASE.docketNumber,
        docketEntryId: docketEntries[1].docketEntryId,
        workItemId: '2d9119cb-c6f9-4fc0-8986-def8373b93ca',
        isRead: false,
      },
    ];

    getWorkItemsByDocketNumber.mockResolvedValueOnce(workItems as WorkItem[]);

    const result = await getCaseDocketEntriesInteractor(
      { docketNumber: MOCK_CASE.docketNumber },
      mockDocketClerkUser,
    );

    expect(result.docketEntries[0]).toMatchObject({
      workItemId: workItems[0].workItemId,
      qcViewed: true,
      qcComplete: true,
    });
    expect(result.docketEntries[1]).toMatchObject({
      workItemId: workItems[1].workItemId,
      qcViewed: false,
      qcComplete: false,
    });
  });

  it('should return an empty page when page is within bounds but exceeds total entries', async () => {
    const result = await getCaseDocketEntriesInteractor(
      { docketNumber: MOCK_CASE.docketNumber, page: 20 },
      mockDocketClerkUser,
    );

    expect(result.docketEntries).toEqual([]);
    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.page).toEqual(20);
  });

  it('should throw an error when page exceeds the maximum allowed page', async () => {
    await expect(
      getCaseDocketEntriesInteractor(
        { docketNumber: MOCK_CASE.docketNumber, page: 21 },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Page 21 exceeds the maximum allowed page of 20');
  });

  it('should filter docket entries for external users', async () => {
    const mockCaseContactPrimary = MOCK_CASE.petitioners[0];

    const result = await getCaseDocketEntriesInteractor(
      { docketNumber: MOCK_CASE.docketNumber },
      {
        email: mockCaseContactPrimary.email,
        name: mockCaseContactPrimary.name,
        role: ROLES.petitioner,
        userId: mockCaseContactPrimary.contactId,
      },
    );

    // External users should only see docket entries on the docket record
    const expectedDocketEntries = MOCK_CASE.docketEntries.filter(
      de => de.isOnDocketRecord,
    );
    expect(result.docketEntries).toMatchObject(expectedDocketEntries);
  });
});
