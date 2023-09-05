import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@shared/business/test/createTestApplicationContext';
import { deletePrimaryIssueAction } from '@web-client/presenter/actions/CaseWorksheet/deletePrimaryIssueAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('deletePrimaryIssueAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should make a call to delete the primary issue', async () => {
    const RETURNED_WORKSHEET = {
      docketNumber: MOCK_CASE.docketNumber,
    };
    applicationContext
      .getUseCases()
      .deletePrimaryIssueInteractor.mockResolvedValue(RETURNED_WORKSHEET);

    const {
      output: { updatedWorksheet },
    } = await runAction(deletePrimaryIssueAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          docketNumber: MOCK_CASE.docketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().deletePrimaryIssueInteractor.mock
        .calls[0][1],
    ).toEqual({
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(updatedWorksheet).toBe(RETURNED_WORKSHEET);
  });
});
