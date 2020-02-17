const {
  createCaseDeadlineInteractor,
} = require('./createCaseDeadlineInteractor');
const {
  MOCK_CASE,
  MOCK_CASE_WITHOUT_PENDING,
} = require('../../../test/mockCase');
const {
  updateCaseAutomaticBlock,
} = require('../../useCaseHelper/automaticBlock/updateCaseAutomaticBlock');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('createCaseDeadlineInteractor', () => {
  let applicationContext;
  const mockCaseDeadline = {
    caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    caseTitle: 'My Case Title',
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '101-21',
  };
  let user;
  const updateCaseStub = jest.fn();
  let getCaseByCaseIdStub;
  const deleteCaseTrialSortMappingRecordsStub = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    user = new User({
      name: 'Test Petitionsclerk',
      role: User.ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => user,
      getPersistenceGateway: () => ({
        createCaseDeadline: v => v,
        deleteCaseTrialSortMappingRecords: deleteCaseTrialSortMappingRecordsStub,
        getCaseByCaseId: getCaseByCaseIdStub,
        getCaseDeadlinesByCaseId: () => [{ deadline: 'something' }],
        updateCase: updateCaseStub,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCaseHelpers: () => ({
        updateCaseAutomaticBlock,
      }),
    };
  });

  it('throws an error if the user is not valid or authorized', async () => {
    user = {};
    await expect(
      createCaseDeadlineInteractor({
        applicationContext,
        caseDeadline: mockCaseDeadline,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('creates a case deadline, marks the case as automatically blocked, and calls deleteCaseTrialSortMappingRecords when there are no pending items', async () => {
    getCaseByCaseIdStub = jest.fn().mockReturnValue(MOCK_CASE_WITHOUT_PENDING);

    const caseDeadline = await createCaseDeadlineInteractor({
      applicationContext,
      caseDeadline: mockCaseDeadline,
    });

    expect(caseDeadline).toBeDefined();
    expect(updateCaseStub).toBeCalled();
    expect(updateCaseStub.mock.calls[0][0].caseToUpdate).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
    expect(deleteCaseTrialSortMappingRecordsStub).toBeCalled();
  });

  it('creates a case deadline, marks the case as automatically blocked, and calls deleteCaseTrialSortMappingRecords when there are already pending items on the case', async () => {
    getCaseByCaseIdStub = jest.fn().mockReturnValue(MOCK_CASE);

    const caseDeadline = await createCaseDeadlineInteractor({
      applicationContext,
      caseDeadline: mockCaseDeadline,
    });

    expect(caseDeadline).toBeDefined();
    expect(updateCaseStub).toBeCalled();
    expect(updateCaseStub.mock.calls[0][0].caseToUpdate).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    });
    expect(deleteCaseTrialSortMappingRecordsStub).toBeCalled();
  });
});
