import { ADVANCED_SEARCH_TABS } from '@shared/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCurrentPaginationPageAction } from './setCurrentPaginationPageAction';

describe('setCurrentPaginationPageAction', () => {
  it('should set caseCurrentPaginationPage when advancedSearchTab is CASE', async () => {
    const { state } = await runAction(setCurrentPaginationPageAction, {
      props: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.CASE,
        currentPaginationPage: 2,
      },
      state: {
        caseCurrentPaginationPage: 0,
        orderCurrentPaginationPage: 0,
        opinionCurrentPaginationPage: 0,
      },
    });

    expect(state.caseCurrentPaginationPage).toEqual(2);
    expect(state.orderCurrentPaginationPage).toEqual(0);
    expect(state.opinionCurrentPaginationPage).toEqual(0);
  });

  it('should set orderCurrentPaginationPage when advancedSearchTab is ORDER', async () => {
    const { state } = await runAction(setCurrentPaginationPageAction, {
      props: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.ORDER,
        currentPaginationPage: 3,
      },
      state: {
        caseCurrentPaginationPage: 0,
        orderCurrentPaginationPage: 0,
        opinionCurrentPaginationPage: 0,
      },
    });

    expect(state.caseCurrentPaginationPage).toEqual(0);
    expect(state.orderCurrentPaginationPage).toEqual(3);
    expect(state.opinionCurrentPaginationPage).toEqual(0);
  });

  it('should set opinionCurrentPaginationPage when advancedSearchTab is OPINION', async () => {
    const { state } = await runAction(setCurrentPaginationPageAction, {
      props: {
        advancedSearchTab: ADVANCED_SEARCH_TABS.OPINION,
        currentPaginationPage: 5,
      },
      state: {
        caseCurrentPaginationPage: 0,
        orderCurrentPaginationPage: 2,
        opinionCurrentPaginationPage: 0,
      },
    });

    expect(state.caseCurrentPaginationPage).toEqual(0);
    expect(state.orderCurrentPaginationPage).toEqual(2);
    expect(state.opinionCurrentPaginationPage).toEqual(5);
  });

  it('should not change the current pagination page when advancedSearchTab is unrecognized', async () => {
    const { state } = await runAction(setCurrentPaginationPageAction, {
      props: { advancedSearchTab: 'somethingElse', currentPaginationPage: 10 },
      state: {
        caseCurrentPaginationPage: 0,
        orderCurrentPaginationPage: 1,
        opinionCurrentPaginationPage: 4,
      },
    });

    expect(state.caseCurrentPaginationPage).toEqual(0);
    expect(state.orderCurrentPaginationPage).toEqual(1);
    expect(state.opinionCurrentPaginationPage).toEqual(4);
  });
});
