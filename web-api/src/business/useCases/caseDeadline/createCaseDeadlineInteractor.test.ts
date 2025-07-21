import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import {
  AUTOMATIC_BLOCKED_REASONS,
  CHIEF_JUDGE,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE, MOCK_CASE_WITHOUT_PENDING } from '@shared/test/mockCase';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createCaseDeadlineInteractor } from './createCaseDeadlineInteractor';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { MOCK_CASE_DEADLINE } from '@shared/test/mockCaseDeadline';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';

describe('createCaseDeadlineInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );
  const mockCaseDeadline = {
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: MOCK_CASE.docketNumber,
  };
  let mockCase;

  beforeEach(() => {
    applicationContext.environment.stage = 'local';

    getCaseByDocketNumber.mockImplementation(() => mockCase);
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      new CaseDeadline(MOCK_CASE_DEADLINE),
    ]);
    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
  });

  it('throws an error if the user is not valid or authorized', async () => {
    const user = {} as UnknownAuthUser;
    await expect(
      createCaseDeadlineInteractor(
        applicationContext,
        {
          caseDeadline: mockCaseDeadline as any,
        },
        user,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('creates a case deadline and marks the case as automatically blocked when there are no pending items', async () => {
    mockCase = MOCK_CASE_WITHOUT_PENDING;

    const caseDeadline = await createCaseDeadlineInteractor(
      applicationContext,
      { caseDeadline: mockCaseDeadline as any },
      mockPetitionsClerkUser,
    );

    expect(caseDeadline).toBeDefined();
    expect(caseDeadline.associatedJudge).toEqual(CHIEF_JUDGE); // judge is not set on the mock case, so it defaults to chief judge
    expect(caseDeadline.associatedJudgeId).toEqual(undefined); // judge is not set on the mock case, so judgeId is not set
    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
  });

  it('creates a case deadline and marks the case as automatically blocked when there are already pending items on the case', async () => {
    mockCase = MOCK_CASE;
    mockCase.associatedJudge = 'Judge Buch';
    mockCase.associatedJudgeId = 'dabbad02-18d0-43ec-bafb-654e83405416';

    const caseDeadline = await createCaseDeadlineInteractor(
      applicationContext,
      { caseDeadline: mockCaseDeadline as any },
      mockPetitionsClerkUser,
    );

    expect(caseDeadline).toBeDefined();
    expect(caseDeadline.associatedJudge).toEqual('Judge Buch');
    expect(caseDeadline.associatedJudgeId).toEqual(
      'dabbad02-18d0-43ec-bafb-654e83405416',
    );
    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    mockCase = MOCK_CASE;
    mockCase.associatedJudge = 'Judge Buch';
    mockCase.associatedJudgeId = 'dabbad02-18d0-43ec-bafb-654e83405416';

    await expect(
      createCaseDeadlineInteractor(
        applicationContext,
        {
          caseDeadline: mockCaseDeadline as any,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the cases', async () => {
    mockCase = MOCK_CASE;
    mockCase.associatedJudge = 'Judge Buch';
    mockCase.associatedJudgeId = 'dabbad02-18d0-43ec-bafb-654e83405416';
    await createCaseDeadlineInteractor(
      applicationContext,
      {
        caseDeadline: mockCaseDeadline as any,
      },
      mockPetitionsClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledTimes(1);

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });
});
