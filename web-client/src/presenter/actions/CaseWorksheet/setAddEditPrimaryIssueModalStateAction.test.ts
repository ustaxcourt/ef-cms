import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setAddEditPrimaryIssueModalStateAction } from '@web-client/presenter/actions/CaseWorksheet/setAddEditPrimaryIssueModalStateAction';

describe('setAddEditPrimaryIssueModalStateAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should setup modal state data for AddEditPrimaryIssue Modal', async () => {
    const TEST_PRIMARY_ISSUE = 'SOME TEST NOTES';

    const { state } = await runAction(setAddEditPrimaryIssueModalStateAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: MOCK_CASE.docketNumber,
      },
      state: {
        submittedAndCavCases: {
          worksheets: [
            {
              docketNumber: MOCK_CASE.docketNumber,
              primaryIssue: TEST_PRIMARY_ISSUE,
            },
          ],
        },
      },
    });

    expect(state.modal.docketNumber).toBe(MOCK_CASE.docketNumber);
    expect(state.modal.primaryIssue).toBe(TEST_PRIMARY_ISSUE);
  });

  it('should default primary issue to an empty string when a worksheet was not found for the docket number', async () => {
    const { state } = await runAction(setAddEditPrimaryIssueModalStateAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: MOCK_CASE.docketNumber,
      },
      state: {
        submittedAndCavCases: {
          worksheets: [],
        },
      },
    });

    expect(state.modal.primaryIssue).toBe('');
  });
});
