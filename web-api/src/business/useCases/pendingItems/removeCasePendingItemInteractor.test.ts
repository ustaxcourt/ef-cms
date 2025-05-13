import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords',
);
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { AUTOMATIC_BLOCKED_REASONS } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_LOCK } from '@shared/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { removeCasePendingItemInteractor } from './removeCasePendingItemInteractor';
import { deleteCaseTrialSortMappingRecords as deleteCaseTrialSortMappingRecordsMock } from '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('removeCasePendingItemInteractor', () => {
  let mockLock;
  const getCaseDeadlinesByDocketNumber =
    getCaseDeadlinesByDocketNumberMock as jest.Mock;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const deleteCaseTrialSortMappingRecords = jest.mocked(
    deleteCaseTrialSortMappingRecordsMock,
  );

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
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

  it('should call updateCase with automaticBlocked=true and a reason and call deleteCaseTrialSortMappingRecords if there are deadlines remaining on the case', async () => {
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
    expect(deleteCaseTrialSortMappingRecords).toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

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
