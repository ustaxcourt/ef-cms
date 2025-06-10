import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { AUTOMATIC_BLOCKED_REASONS } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { removeCasePendingItemInteractor } from './removeCasePendingItemInteractor';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';

describe('removeCasePendingItemInteractor', () => {
  const getCaseDeadlinesByDocketNumber =
    getCaseDeadlinesByDocketNumberMock as jest.Mock;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const tryGetLock = jest.mocked(tryGetLockMock);
  const releaseLock = jest.mocked(releaseLockMock);

  beforeEach(() => {
    getCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));
  });

  it('should throw an unauthorized error if user is unauthorized for updating a case', async () => {
    await expect(
      removeCasePendingItemInteractor(
        applicationContext,
        {
          docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('should call updateCase with the pending document set to pending=false', async () => {
    await removeCasePendingItemInteractor(
      applicationContext,
      {
        docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries[3]
        .pending,
    ).toEqual(false);
  });

  it('should call updateCase with automaticBlocked=false if there are no deadlines or pending items remaining on the case', async () => {
    await removeCasePendingItemInteractor(
      applicationContext,
      {
        docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
  });

  it('should call updateCase with automaticBlocked=true and a reason if there are deadlines remaining on the case', async () => {
    // Simulate the presence of deadlines on the case.
    getCaseDeadlinesByDocketNumber.mockReturnValue([{ deadline: 'something' }]);

    await removeCasePendingItemInteractor(
      applicationContext,
      {
        docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLock.mockResolvedValueOnce(false);

    await expect(
      removeCasePendingItemInteractor(
        applicationContext,
        {
          docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    // Expect getCaseByDocketNumber not to have been called because the lock prevented further processing.
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await removeCasePendingItemInteractor(
      applicationContext,
      {
        docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // docketEntries[3] from MOCK_CASE
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(tryGetLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );

    expect(releaseLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );
  });
});
