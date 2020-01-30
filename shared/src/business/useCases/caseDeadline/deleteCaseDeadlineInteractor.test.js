const {
  deleteCaseDeadlineInteractor,
} = require('./deleteCaseDeadlineInteractor');
const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE_WITHOUT_PENDING } = require('../../../test/mockCase');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('deleteCaseDeadlineInteractor', () => {
  let applicationContext;
  let user;
  const deleteCaseDeadlineMock = jest.fn();
  const updateCaseMock = jest.fn();
  let getCaseDeadlinesByCaseIdMock;

  beforeEach(() => {
    jest.clearAllMocks();

    user = new User({
      name: 'Test Petitionsclerk',
      role: User.ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    getCaseDeadlinesByCaseIdMock = jest.fn();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => user,
      getPersistenceGateway: () => ({
        deleteCaseDeadline: deleteCaseDeadlineMock,
        getCaseByCaseId: () => MOCK_CASE_WITHOUT_PENDING,
        getCaseDeadlinesByCaseId: getCaseDeadlinesByCaseIdMock,
        updateCase: updateCaseMock,
      }),
    };
  });

  it('throws an error if the user is not valid or authorized', async () => {
    user = {};
    await expect(
      deleteCaseDeadlineInteractor({
        applicationContext,
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('calls persistence to delete a case deadline and sets the case as no longer automatically blocked if there are no more deadlines', async () => {
    getCaseDeadlinesByCaseIdMock = jest.fn().mockReturnValue([]);

    await deleteCaseDeadlineInteractor({
      applicationContext,
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(deleteCaseDeadlineMock.mock.calls[0][0]).toMatchObject({
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(updateCaseMock.mock.calls[0][0].caseToUpdate).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
  });

  it('calls persistence to delete a case deadline and leaves the case automatically blocked if there are more deadlines', async () => {
    getCaseDeadlinesByCaseIdMock = jest
      .fn()
      .mockReturnValue([{ deadline: 'something' }]);

    await deleteCaseDeadlineInteractor({
      applicationContext,
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(deleteCaseDeadlineMock.mock.calls[0][0]).toMatchObject({
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(updateCaseMock.mock.calls[0][0].caseToUpdate).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
  });
});
