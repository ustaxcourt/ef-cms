import { runAction } from '@web-client/presenter/test.cerebral';
import { setCurrentPaginationPageAction } from './setCurrentPaginationPageAction';

describe('setCurrentPaginationPageAction', () => {
  it('sets orderCurrentPaginationPage when advancedSearchTab is order', async () => {
    const { state } = await runAction(setCurrentPaginationPageAction, {
      props: { advancedSearchTab: 'order', currentPaginationPage: 3 },
      state: {
        advancedSearchTab: 'order',
        orderCurrentPaginationPage: 0,
        opinionCurrentPaginationPage: 0,
      },
    });

    expect(state.orderCurrentPaginationPage).toEqual(3);
    expect(state.opinionCurrentPaginationPage).toEqual(0);
  });

  it('sets opinionCurrentPaginationPage when advancedSearchTab is opinion', async () => {
    const { state } = await runAction(setCurrentPaginationPageAction, {
      props: { advancedSearchTab: 'opinion', currentPaginationPage: 5 },
      state: {
        advancedSearchTab: 'opinion',
        orderCurrentPaginationPage: 2,
        opinionCurrentPaginationPage: 0,
      },
    });

    expect(state.opinionCurrentPaginationPage).toEqual(5);
    expect(state.orderCurrentPaginationPage).toEqual(2);
  });

  it('defaults to order when advancedSearchTab is unrecognized', async () => {
    const { state } = await runAction(setCurrentPaginationPageAction, {
      props: { advancedSearchTab: 'somethingElse', currentPaginationPage: 7 },
      state: {
        advancedSearchTab: 'somethingElse',
        orderCurrentPaginationPage: 1,
        opinionCurrentPaginationPage: 4,
      },
    });

    expect(state.orderCurrentPaginationPage).toEqual(7);
    expect(state.opinionCurrentPaginationPage).toEqual(4);
  });
});
