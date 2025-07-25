import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock('@web-api/persistence/postgres/docketEntries/upsertDocketEntries');
import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getWorkItemById as getWorkItemByIdMock } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { setWorkItemAsReadInteractor } from './setWorkItemAsReadInteractor';
import { upsertWorkItems as upsertWorkItemsMock } from '@web-api/persistence/postgres/workitems/upsertWorkItems';

describe('setWorkItemAsReadInteractor', () => {
  const upsertWorkItems = upsertWorkItemsMock as jest.Mock;
  const getWorkItemById = getWorkItemByIdMock as jest.Mock;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const mockWorkItem = {
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

  beforeEach(() => {
    getWorkItemById.mockResolvedValue(new WorkItem(mockWorkItem));

    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      docketEntries: [
        { ...MOCK_CASE.docketEntries[0], workItem: mockWorkItem },
      ],
    });
  });

  it('should throw an error when an unauthorized user tries to invoke this interactor', async () => {
    await expect(
      setWorkItemAsReadInteractor(
        {
          workItemId: mockWorkItem.workItemId,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the work item is not found', async () => {
    getWorkItemById.mockResolvedValue(undefined);

    await expect(
      setWorkItemAsReadInteractor(
        {
          workItemId: mockWorkItem.workItemId,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('should call upsertWorkItems with the work item marked as read', async () => {
    await setWorkItemAsReadInteractor(
      {
        workItemId: mockWorkItem.workItemId,
      },
      mockDocketClerkUser,
    );

    expect(upsertWorkItems.mock.calls[0][0]).toMatchObject({
      workItems: [{ isRead: true }],
    });
  });
});
