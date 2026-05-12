jest.mock('@web-api/persistence/postgres/workitems/getWorkItemsByIds');
import { WorkItem } from '@shared/business/entities/WorkItem';
import { getWorkItemsByIds as getWorkItemsByIdsMock } from '@web-api/persistence/postgres/workitems/getWorkItemsByIds';
import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { getWorkItemById } from './getWorkItemById';

describe('getWorkItemById', () => {
  const getWorkItemsByIds = getWorkItemsByIdsMock as jest.Mock;

  const mockRawWorkItem = {
    assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
    assigneeName: 'bob',
    caseStatus: CASE_STATUS_TYPES.new,
    caseTitle: 'Johnny Joe Jacobson',
    docketEntryId: MOCK_CASE.docketEntries[0].docketEntryId,
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    section: DOCKET_SECTION,
    sentBy: 'bob',
    workItemId: '3bcca3a4-31df-4ab5-8a4c-b6110955ca5a',
  };

  it('should return undefined when no work item exists for workItemId', async () => {
    getWorkItemsByIds.mockResolvedValue([]);

    const result = await getWorkItemById({
      workItemId: mockRawWorkItem.workItemId,
    });

    expect(getWorkItemsByIds).toHaveBeenCalledWith({
      workItemIds: [mockRawWorkItem.workItemId],
    });
    expect(result).toBeUndefined();
  });

  it('should return the work item entity when found', async () => {
    const entity = new WorkItem(mockRawWorkItem);
    getWorkItemsByIds.mockResolvedValue([entity]);

    const result = await getWorkItemById({
      workItemId: mockRawWorkItem.workItemId,
    });

    expect(result).toBe(entity);
    expect(getWorkItemsByIds).toHaveBeenCalledWith({
      workItemIds: [mockRawWorkItem.workItemId],
    });
  });
});
