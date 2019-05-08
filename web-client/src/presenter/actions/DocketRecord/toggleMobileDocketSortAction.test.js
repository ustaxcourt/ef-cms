import { runAction } from 'cerebral/test';
import { toggleMobileDocketSortAction } from './toggleMobileDocketSortAction';

describe('toggleMobileDocketSortAction', () => {
  it('should set sessionMetadata.docketRecordSort to byDateDesc if it is currently byDate', async () => {
    const result = await runAction(toggleMobileDocketSortAction, {
      state: {
        sessionMetadata: { docketRecordSort: 'byDate' },
      },
    });

    expect(result.state.sessionMetadata.docketRecordSort).toEqual('byDateDesc');
  });

  it('should set sessionMetadata.docketRecordSort to byDate if it is currently byDateDesc', async () => {
    const result = await runAction(toggleMobileDocketSortAction, {
      state: {
        sessionMetadata: { docketRecordSort: 'byDateDesc' },
      },
    });

    expect(result.state.sessionMetadata.docketRecordSort).toEqual('byDate');
  });
});
