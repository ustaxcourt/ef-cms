import {
  AUTOMATIC_BLOCKED_REASONS,
  ROLES,
} from '../../entities/EntityConstants';
import { MOCK_CASE_WITHOUT_PENDING } from '../../../test/mockCase';
import { UnauthorizedError } from '../../../errors/errors';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { deleteCaseDeadlineInteractor } from './deleteCaseDeadlineInteractor';

describe('deleteCaseDeadlineInteractor', () => {
  let user;
  let mockCase;
  let mockDeadlines;

  beforeAll(() => {
    mockCase = MOCK_CASE_WITHOUT_PENDING;

    applicationContext.environment.stage = 'local';
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);

    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockImplementation(() => mockDeadlines);
  });

  beforeEach(() => {
    user = new User({
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockImplementation(() => user);
  });

  it('throws an error if the user is not valid or authorized', async () => {
    user = {};
    await expect(
      deleteCaseDeadlineInteractor(applicationContext, {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: '123-20',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('calls persistence to delete a case deadline and sets the case as no longer automatically blocked if there are no more deadlines', async () => {
    mockDeadlines = [];

    await deleteCaseDeadlineInteractor(applicationContext, {
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      docketNumber: '123-20',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteCaseDeadline.mock
        .calls[0][0],
    ).toMatchObject({
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      docketNumber: '123-20',
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('calls persistence to delete a case deadline and leaves the case automatically blocked if there are more deadlines', async () => {
    mockDeadlines = [{ deadline: 'something' }];

    await deleteCaseDeadlineInteractor(applicationContext, {
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      docketNumber: '123-20',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteCaseDeadline.mock
        .calls[0][0],
    ).toMatchObject({
      caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      docketNumber: '123-20',
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
});
