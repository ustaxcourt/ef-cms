import { runAction } from '@web-client/presenter/test.cerebral';
import { setFilingFeeReturnPageAction } from '@web-client/presenter/actions/FilingFee/setFilingFeeReturnPageAction';
import { presenter } from '../../presenter-mock';

describe('setFilingFeeReturnPageAction', () => {
  it('should set dashboardCaseListPageIndex when page is a one-based page greater than 1', async () => {
    const { state } = await runAction(setFilingFeeReturnPageAction, {
      modules: { presenter },
      props: { page: '3' },
    });

    expect(state.dashboardCaseListPageIndex).toEqual(2);
  });

  it('should unset dashboardCaseListPageIndex when page is the first page', async () => {
    const { state } = await runAction(setFilingFeeReturnPageAction, {
      modules: { presenter },
      props: { page: '1' },
      state: {
        dashboardCaseListPageIndex: 4,
      },
    });

    expect(state.dashboardCaseListPageIndex).toBeUndefined();
  });

  it('should unset dashboardCaseListPageIndex when page is missing', async () => {
    const { state } = await runAction(setFilingFeeReturnPageAction, {
      modules: { presenter },
      props: {},
      state: {
        dashboardCaseListPageIndex: 2,
      },
    });

    expect(state.dashboardCaseListPageIndex).toBeUndefined();
  });
});
