import {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { completeWorkItemInteractor } from './completeWorkItemInteractor';
import { docketClerkUser } from '../../../test/mockUsers';

describe('completeWorkItemInteractor', () => {
  let mockLock;

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
      isMinuteEntry: false,
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

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
    applicationContext.getPersistenceGateway().putWorkItemInOutbox = jest.fn();
  });

  beforeEach(() => {
    mockLock = undefined;
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockReturnValue(mockWorkItem);
  });

  it('throws a ServiceUnavailableError if a Case is currently locked', async () => {
    mockLock = MOCK_LOCK;
    await expect(
      completeWorkItemInteractor(applicationContext, mockRequest),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  it('acquires a lock that lasts for 30 seconds on the case', async () => {
    await completeWorkItemInteractor(applicationContext, mockRequest);

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });
  });

  it('resolves and calls updateCaseAndAssociations', async () => {
    await expect(
      completeWorkItemInteractor(applicationContext, mockRequest),
    ).resolves.not.toThrow();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
  });

  it('removes the lock when it is finished', async () => {
    await completeWorkItemInteractor(applicationContext, mockRequest);

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});
