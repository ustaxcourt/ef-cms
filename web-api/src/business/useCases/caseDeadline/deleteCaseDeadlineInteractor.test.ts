import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
jest.mock(
  '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords',
);
import { AUTOMATIC_BLOCKED_REASONS } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE_WITHOUT_PENDING } from '@shared/test/mockCase';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { deleteCaseDeadlineInteractor } from './deleteCaseDeadlineInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { deleteCaseDeadline as deleteCaseDeadlineMock } from '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { deleteCaseTrialSortMappingRecords as deleteCaseTrialSortMappingRecordsMock } from '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';

describe('deleteCaseDeadlineInteractor', () => {
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );
  const deleteCaseDeadline = jest.mocked(deleteCaseDeadlineMock);
  const deleteCaseTrialSortMappingRecords = jest.mocked(
    deleteCaseTrialSortMappingRecordsMock,
  );
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  let user;
  let mockDeadlines;

  updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
    Promise.resolve(caseToUpdate),
  );

  beforeAll(() => {
    applicationContext.environment.stage = 'local';
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE_WITHOUT_PENDING);

    getCaseDeadlinesByDocketNumber.mockImplementation(() => mockDeadlines);
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      deleteCaseDeadlineInteractor(
        applicationContext,
        {
          caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          docketNumber: MOCK_CASE_WITHOUT_PENDING.docketNumber,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValueOnce([]);
    await deleteCaseDeadlineInteractor(
      applicationContext,
      {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: MOCK_CASE_WITHOUT_PENDING.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE_WITHOUT_PENDING.docketNumber}`],
      }),
    );
  });

  it('should throw an error when the user is not valid or authorized', async () => {
    user = {};
    await expect(
      deleteCaseDeadlineInteractor(
        applicationContext,
        {
          caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          docketNumber: '123-20',
        },
        user,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should call persistence to delete a case deadline and sets the case as no longer automatically blocked when there are no more deadlines', async () => {
    mockDeadlines = [];

    await deleteCaseDeadlineInteractor(
      applicationContext,
      {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: '123-20',
      },
      mockPetitionsClerkUser,
    );

    expect(deleteCaseDeadline.mock.calls[0][0]).toMatchObject({
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
    expect(deleteCaseTrialSortMappingRecords).not.toHaveBeenCalled();
  });

  it('should call persistence to delete a case deadline and leave the case automatically blocked when there are more deadlines', async () => {
    mockDeadlines = [
      { caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416' },
      { caseDeadlineId: 'will remain after deletion' },
    ];

    await deleteCaseDeadlineInteractor(
      applicationContext,
      {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: '123-20',
      },
      mockPetitionsClerkUser,
    );

    expect(deleteCaseDeadline.mock.calls[0][0]).toMatchObject({
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
    expect(deleteCaseTrialSortMappingRecords).toHaveBeenCalled();
  });
});
