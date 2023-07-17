import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateCasePrimaryIssueInDbAction } from './updateCasePrimaryIssueInDbAction';

describe('updateCasePrimaryIssueInDbAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call update case primary issue interactor with correct parameters', async () => {
    const TEST_DOCKET_NUMBER = '999-99';
    const TEST_PRIMARY_ISSUE = 'SOME TEST PRIMARY ISSUE';

    applicationContext
      .getUseCases()
      .updateCasePrimaryIssueInteractor.mockReturnValue(null);

    await runAction(updateCasePrimaryIssueInDbAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: TEST_DOCKET_NUMBER,
        primaryIssue: TEST_PRIMARY_ISSUE,
      },
    });

    expect(
      applicationContext.getUseCases().updateCasePrimaryIssueInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: TEST_DOCKET_NUMBER,
      primaryIssue: TEST_PRIMARY_ISSUE,
    });
  });
});
