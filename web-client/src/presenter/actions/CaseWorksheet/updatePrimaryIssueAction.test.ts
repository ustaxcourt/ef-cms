import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updatePrimaryIssueAction } from './updatePrimaryIssueAction';

describe('updatePrimaryIssueAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const TEST_PRIMARY_ISSUE = 'SOME TEST PRIMARY ISSUE';

  it('should persist the primary issue and return the updated case worksheet to props', async () => {
    applicationContext
      .getUseCases()
      .updateCaseWorksheetInteractor.mockResolvedValue({
        docketNumber: MOCK_CASE.docketNumber,
        primaryIssue: TEST_PRIMARY_ISSUE,
      });

    const { output } = await runAction(updatePrimaryIssueAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          docketNumber: MOCK_CASE.docketNumber,
          primaryIssue: TEST_PRIMARY_ISSUE,
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseWorksheetInteractor.mock
        .calls[0][1],
    ).toEqual({
      docketNumber: MOCK_CASE.docketNumber,
      updatedProps: {
        primaryIssue: TEST_PRIMARY_ISSUE,
      },
    });
    expect(output.updatedWorksheet).toEqual({
      docketNumber: MOCK_CASE.docketNumber,
      primaryIssue: TEST_PRIMARY_ISSUE,
    });
  });
});
