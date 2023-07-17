import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { fetchUpdatedCasePrimaryIssueFromModalStateAction } from './fetchUpdatedCasePrimaryIssueFromModalStateAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('fetchUpdatedCasePrimaryIssueFromModalStateAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const TEST_DOCKET_NUMBER = '999-99';
  const TEST_NOTES = 'SOME TEST NOTES';

  it('should return the correct output from state', async () => {
    const { output } = await runAction(
      fetchUpdatedCasePrimaryIssueFromModalStateAction as any,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          modal: {
            docketNumber: TEST_DOCKET_NUMBER,
            notes: TEST_NOTES,
          },
        },
      },
    );

    const expectedProps = {
      docketNumber: TEST_DOCKET_NUMBER,
      primaryIssue: TEST_NOTES,
    };
    expect(output).toMatchObject(expectedProps);
  });
});
