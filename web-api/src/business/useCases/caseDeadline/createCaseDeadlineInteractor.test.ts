import '@web-api/persistence/postgres/cases/mocks.jest';
import {
  AUTOMATIC_BLOCKED_REASONS,
  CHIEF_JUDGE,
} from '../../../../../shared/src/business/entities/EntityConstants';
import {
  MOCK_CASE,
  MOCK_CASE_WITHOUT_PENDING,
} from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createCaseDeadlineInteractor } from './createCaseDeadlineInteractor';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';

describe('createCaseDeadlineInteractor', () => {
  const mockCaseDeadline = {
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: MOCK_CASE.docketNumber,
  };
  let mockCase;
  let mockLock;
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;

    applicationContext.environment.stage = 'local';

    applicationContext
      .getPersistenceGateway()
      .createCaseDeadline.mockImplementation(v => v);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([
        { deadline: 'something' },
      ]);
  });

  it('throws an error if the user is not valid or authorized', async () => {
    let user = {} as UnknownAuthUser;
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

  it('creates a case deadline, marks the case as automatically blocked, and calls deleteCaseTrialSortMappingRecords when there are no pending items', async () => {
    mockCase = MOCK_CASE_WITHOUT_PENDING;

    const caseDeadline = await createCaseDeadlineInteractor(
      applicationContext,
      { caseDeadline: mockCaseDeadline as any },
      mockPetitionsClerkUser,
    );

    expect(caseDeadline).toBeDefined();
    expect(caseDeadline.associatedJudge).toEqual(CHIEF_JUDGE); // judge is not set on the mock case, so it defaults to chief judge
    expect(caseDeadline.associatedJudgeId).toEqual(undefined); // judge is not set on the mock case, so judgeId is not set
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
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

  it('creates a case deadline, marks the case as automatically blocked, and calls deleteCaseTrialSortMappingRecords when there are already pending items on the case', async () => {
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
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockCase = MOCK_CASE;
    mockCase.associatedJudge = 'Judge Buch';
    mockCase.associatedJudgeId = 'dabbad02-18d0-43ec-bafb-654e83405416';

    mockLock = MOCK_LOCK;

    await expect(
      createCaseDeadlineInteractor(
        applicationContext,
        {
          caseDeadline: mockCaseDeadline as any,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the cases', async () => {
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

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledTimes(1);

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
