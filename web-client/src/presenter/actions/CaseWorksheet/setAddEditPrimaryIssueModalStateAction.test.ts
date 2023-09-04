import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setAddEditPrimaryIssueModalStateAction } from '@web-client/presenter/actions/CaseWorksheet/setAddEditPrimaryIssueModalStateAction';

describe('setAddEditPrimaryIssueModalStateAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const TEST_DOCKET_NUMBER = '999-99';
  const TEST_PRIMARY_ISSUE = 'SOME TEST NOTES';

  it('should setup modal state data for AddEditPrimaryIssue Modal', async () => {
    const { state } = await runAction(
      setAddEditPrimaryIssueModalStateAction as any,
      {
        modules: {
          presenter,
        },
        props: {
          case: {
            docketNumber: TEST_DOCKET_NUMBER,
            petitioners: [
              { entityName: 'entityName1' },
              { entityName: 'entityName2' },
            ],
            primaryIssue: TEST_PRIMARY_ISSUE,
          },
        },
      },
    );

    expect(state.modal.docketNumber).toBe(TEST_DOCKET_NUMBER);
    expect(state.modal.heading).toBe('Docket 999-99: entityName1,entityName2');
    expect(state.modal.primaryIssue).toBe(TEST_PRIMARY_ISSUE);
  });
});
