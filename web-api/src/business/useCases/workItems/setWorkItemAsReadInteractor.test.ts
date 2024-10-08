import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { saveWorkItem as saveWorkItemMock } from '@web-api/persistence/postgres/workitems/saveWorkItem';
import { setWorkItemAsReadInteractor } from './setWorkItemAsReadInteractor';

describe('setWorkItemAsReadInteractor', () => {
  const saveWorkItem = saveWorkItemMock as jest.Mock;
  const mockWorkItem = {
    assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
    assigneeName: 'bob',
    caseStatus: CASE_STATUS_TYPES.new,
    caseTitle: 'Johnny Joe Jacobson',
    docketEntry: MOCK_CASE.docketEntries[0],
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    section: DOCKET_SECTION,
    sentBy: 'bob',
    workItemId: '3bcca3a4-31df-4ab5-8a4c-b6110955ca5a',
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue(mockWorkItem);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        ...MOCK_CASE,
        docketEntries: [
          { ...MOCK_CASE.docketEntries[0], workItem: mockWorkItem },
        ],
      });
  });

  it('should throw an error when an unauthorized user tries to invoke this interactor', async () => {
    await expect(
      setWorkItemAsReadInteractor(
        applicationContext,
        {
          workItemId: mockWorkItem.workItemId,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the docket entry is not found on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue({
        ...mockWorkItem,
        docketEntry: { docketEntryId: 'ff54c9e8-93c5-4098-ba34-fa6edaa9da91' },
      });

    await expect(
      setWorkItemAsReadInteractor(
        applicationContext,
        {
          workItemId: mockWorkItem.workItemId,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('should call updateDocketEntry with the docket entry work item marked as read', async () => {
    await setWorkItemAsReadInteractor(
      applicationContext,
      {
        workItemId: mockWorkItem.workItemId,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry.mock
        .calls[0][0],
    ).toMatchObject({
      document: { workItem: { isRead: true } },
    });
  });

  it('should call saveWorkItem with the work item marked as read', async () => {
    await setWorkItemAsReadInteractor(
      applicationContext,
      {
        workItemId: mockWorkItem.workItemId,
      },
      mockDocketClerkUser,
    );

    expect(saveWorkItem.mock.calls[0][0]).toMatchObject({
      workItem: { isRead: true },
    });
  });
});
