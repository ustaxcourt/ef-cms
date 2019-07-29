import { runAction } from 'cerebral/test';
import { selectDocumentForScanAction } from './selectDocumentForScanAction';

describe('selectDocumentForScanAction', () => {
  it('sets the documentType and resets batches and indices to defaults', async () => {
    const result = await runAction(selectDocumentForScanAction, {
      props: {
        documentType: 'stinFile',
      },
      state: {
        batches: [1, 2, 3, 4],
        currentPageIndex: 2,
        selectedBatchIndex: 3,
      },
    });

    expect(result.state.documentSelectedForScan).toEqual('stinFile');
    expect(result.state.batches).toHaveLength(0);
    expect(result.state.currentPageIndex).toEqual(0);
    expect(result.state.selectedBatchIndex).toEqual(0);
  });
});
