import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setOpenDeleteCasePrimaryIssueModalStateAction } from './setOpenDeleteCasePrimaryIssueModalStateAction';

describe('setOpenDeleteCasePrimaryIssueModalStateAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const TEST_DOCKET_NUMBER = '999-99';

  it('should setup modal state data for DeleteCasePrimaryIssue Modal', async () => {
    const { state } = await runAction(
      setOpenDeleteCasePrimaryIssueModalStateAction as any,
      {
        modules: {
          presenter,
        },
        props: {
          docketNumber: TEST_DOCKET_NUMBER,
        },
      },
    );

    expect(state.modal.docketNumber).toBe(TEST_DOCKET_NUMBER);
    expect(state.modal.notesLabel).toBe('This action cannot be undone');
  });
});
