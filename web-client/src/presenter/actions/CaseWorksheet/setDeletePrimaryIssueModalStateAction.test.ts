import { MOCK_CASE } from '@shared/test/mockCase';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDeletePrimaryIssueModalStateAction } from '@web-client/presenter/actions/CaseWorksheet/setDeletePrimaryIssueModalStateAction';

describe('setDeletePrimaryIssueModalStateAction', () => {
  it('should setup modal state for delete primary issue action', async () => {
    const { state } = await runAction(setDeletePrimaryIssueModalStateAction, {
      props: {
        docketNumber: MOCK_CASE.docketNumber,
      },
      state: {
        modal: {},
      },
    });

    expect(state.modal.docketNumber).toEqual(MOCK_CASE.docketNumber);
  });
});
