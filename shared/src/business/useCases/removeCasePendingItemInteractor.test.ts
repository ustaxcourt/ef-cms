import {
  AUTOMATIC_BLOCKED_REASONS,
  PARTY_TYPES,
  ROLES,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { User } from '../entities/User';
import { applicationContext } from '../test/createTestApplicationContext';
import { removeCasePendingItemInteractor } from './removeCasePendingItemInteractor';

describe('removeCasePendingItemInteractor', () => {
  let user;
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    user = new User({
      name: 'Petitions Clerk',
      role: ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(v => v);
  });

  it('should throw an unauthorized error if user is unauthorized for updating a case', async () => {
    user = new User({
      name: PARTY_TYPES.petitioner,
      role: ROLES.petitioner,
      userId: '2c464719-646c-463e-9826-16443500ed88',
    });

    await expect(
      removeCasePendingItemInteractor(applicationContext, {
        docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('should call updateCase with the pending document set to pending=false', async () => {
    await removeCasePendingItemInteractor(applicationContext, {
      docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[3].pending,
    ).toEqual(false);
  });

  it('should call updateCase with automaticBlocked=false if there are no deadlines or pending items remaining on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([]);

    await removeCasePendingItemInteractor(applicationContext, {
      docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
  });

  it('should call updateCase with automaticBlocked=true and a reason and call deleteCaseTrialSortMappingRecords if there are deadlines remaining on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([
        { deadline: 'something' },
      ]);

    await removeCasePendingItemInteractor(applicationContext, {
      docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });
  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      removeCasePendingItemInteractor(applicationContext, {
        docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await removeCasePendingItemInteractor(applicationContext, {
      docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});
