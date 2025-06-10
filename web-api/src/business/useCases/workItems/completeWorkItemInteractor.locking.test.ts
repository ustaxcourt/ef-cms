import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';
import {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { completeWorkItemInteractor } from './completeWorkItemInteractor';
import { getWorkItemById as getWorkItemByIdMock } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('completeWorkItemInteractor', () => {
  const getWorkItemById = getWorkItemByIdMock as jest.Mock;
  const tryGetLock = jest.mocked(tryGetLockMock);
  const releaseLock = jest.mocked(releaseLockMock);

  const mockRequest = {
    completedMessage: 'Completed',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  const mockWorkItem = {
    assigneeId: applicationContext.getUniqueId(),
    createdAt: '2019-03-11T21:56:01.625Z',
    docketEntry: {
      createdAt: '2019-03-11T21:56:01.625Z',
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
      documentType: 'Petition',
      entityName: 'DocketEntry',
      eventCode: 'P',
      filedBy: 'Lewis Dodgson',
      filingDate: '2019-03-11T21:56:01.625Z',
      isDraft: false,
      isOnDocketRecord: true,
      sentBy: 'petitioner',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
    },
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    messages: [],
    section: DOCKET_SECTION,
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    getWorkItemById.mockReturnValue(new WorkItem(mockWorkItem));
  });

  it('throws a ServiceUnavailableError if a Case is currently locked', async () => {
    tryGetLock.mockResolvedValueOnce(false);

    await expect(
      completeWorkItemInteractor(
        applicationContext,
        mockRequest,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  it('acquires and releases a lock on the case', async () => {
    await completeWorkItemInteractor(
      applicationContext,
      mockRequest,
      mockDocketClerkUser,
    );

    expect(tryGetLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );

    expect(releaseLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );
  });
});
