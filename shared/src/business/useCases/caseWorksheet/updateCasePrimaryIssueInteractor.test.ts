import { MOCK_CASE } from '../../../test/mockCase';
import { ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '../../../errors/errors';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { omit } from 'lodash';
import { updateCasePrimaryIssueInteractor } from './updateCasePrimaryIssueInteractor';

describe('updateCasePrimaryIssueInteractor', () => {
  const TEST_DOCKET_NUMBER = '999-99';
  const TEST_PRIMARY_ISSUE = 'SOME TEST PRIMARY ISSUE';

  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(MOCK_CASE);

    applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mockImplementation(
        ({ caseToUpdate }) => caseToUpdate,
      );
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCasePrimaryIssueInteractor(applicationContext, {
        docketNumber: TEST_DOCKET_NUMBER,
        primaryIssue: TEST_PRIMARY_ISSUE,
      }),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it("should update the case's primary issue", async () => {
    const mockUser = new User({
      name: 'Judge Colvin',
      role: ROLES.judge,
      section: 'colvinChambers',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockImplementation(() =>
      omit(mockUser, 'section'),
    );

    const results = await updateCasePrimaryIssueInteractor(applicationContext, {
      docketNumber: TEST_DOCKET_NUMBER,
      primaryIssue: TEST_PRIMARY_ISSUE,
    });

    expect(results.primaryIssue).toEqual(TEST_PRIMARY_ISSUE);
  });
});
