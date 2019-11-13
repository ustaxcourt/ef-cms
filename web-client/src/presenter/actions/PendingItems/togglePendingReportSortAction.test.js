import { runAction } from 'cerebral/test';
import { togglePendingReportSortAction } from './togglePendingReportSortAction';

describe('togglePendingReportSortAction', () => {
  it('sets state.screenMetadata.sort and sets the default sort to state.screenMetadata.sortOrder', async () => {
    const { state } = await runAction(togglePendingReportSortAction, {
      props: {
        sort: 'stuff',
      },
    });
    expect(state.screenMetadata.sort).toEqual('stuff');
    expect(state.screenMetadata.sortOrder).toEqual('asc');
  });

  it('when state.screenMetadata.sort is the same it toggles sortOrder', async () => {
    const { state } = await runAction(togglePendingReportSortAction, {
      props: {
        sort: 'stuff',
      },
      state: {
        screenMetadata: {
          sort: 'stuff',
          sortOrder: 'asc',
        },
      },
    });
    expect(state.screenMetadata.sort).toEqual('stuff');
    expect(state.screenMetadata.sortOrder).toEqual('desc');
  });
});
