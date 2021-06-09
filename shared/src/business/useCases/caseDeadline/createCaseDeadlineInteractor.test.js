const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  AUTOMATIC_BLOCKED_REASONS,
  CHIEF_JUDGE,
} = require('../../entities/EntityConstants');
const {
  createCaseDeadlineInteractor,
} = require('./createCaseDeadlineInteractor');
const {
  MOCK_CASE,
  MOCK_CASE_WITHOUT_PENDING,
} = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('createCaseDeadlineInteractor', () => {
  const mockCaseDeadline = {
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '123-19',
  };
  let user;
  let mockCase;

  beforeEach(() => {
    user = new User({
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => user);

    applicationContext
      .getPersistenceGateway()
      .createCaseDeadline.mockImplementation(v => v);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockImplementation(() => mockCase);
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([
        { deadline: 'something' },
      ]);
  });

  it('throws an error if the user is not valid or authorized', async () => {
    user = {};
    await expect(
      createCaseDeadlineInteractor(applicationContext, {
        caseDeadline: mockCaseDeadline,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('creates a case deadline, marks the case as automatically blocked, and calls deleteCaseTrialSortMappingRecords when there are no pending items', async () => {
    mockCase = MOCK_CASE_WITHOUT_PENDING;

    const caseDeadline = await createCaseDeadlineInteractor(
      applicationContext,
      { caseDeadline: mockCaseDeadline },
    );

    expect(caseDeadline).toBeDefined();
    expect(caseDeadline.associatedJudge).toEqual(CHIEF_JUDGE); // judge is not set on the mock case, so it defaults to chief judge
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
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
    ).toBeCalled();
  });

  it('creates a case deadline, marks the case as automatically blocked, and calls deleteCaseTrialSortMappingRecords when there are already pending items on the case', async () => {
    mockCase = MOCK_CASE;
    mockCase.associatedJudge = 'Judge Buch';

    const caseDeadline = await createCaseDeadlineInteractor(
      applicationContext,
      { caseDeadline: mockCaseDeadline },
    );

    expect(caseDeadline).toBeDefined();
    expect(caseDeadline.associatedJudge).toEqual('Judge Buch');
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
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
    ).toBeCalled();
  });
});
