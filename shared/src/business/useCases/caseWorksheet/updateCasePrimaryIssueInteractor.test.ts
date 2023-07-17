import { UnauthorizedError } from '../../../errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { updateCasePrimaryIssueInteractor } from './updateCasePrimaryIssueInteractor';

describe('updateCasePrimaryIssueInteractor', () => {
  const TEST_DOCKET_NUMBER = '999-99';
  const TEST_PRIMARY_ISSUE = 'SOME TEST PRIMARY ISSUE';

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCasePrimaryIssueInteractor(applicationContext, {
        docketNumber: TEST_DOCKET_NUMBER,
        primaryIssue: TEST_PRIMARY_ISSUE,
      }),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });
});
