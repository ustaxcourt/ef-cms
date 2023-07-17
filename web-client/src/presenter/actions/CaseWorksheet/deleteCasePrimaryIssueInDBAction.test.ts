import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteCasePrimaryIssueInDBAction } from './deleteCasePrimaryIssueInDBAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('deleteCasePrimaryIssueInDBAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call update case primary issue interactor with correct parameters', async () => {
    const TEST_DOCKET_NUMBER = '999-99';

    applicationContext
      .getUseCases()
      .updateCasePrimaryIssueInteractor.mockReturnValue(null);

    await runAction(deleteCasePrimaryIssueInDBAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
      },
    });

    expect(
      applicationContext.getUseCases().updateCasePrimaryIssueInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: TEST_DOCKET_NUMBER,
      primaryIssue: undefined,
    });
  });
});
