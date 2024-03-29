import { clearDocumentsSelectedForDownload } from './clearDocumentsSelectedForDownload';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearDocumentsSelectedForDownload', () => {
  it('should clear the value of state.documentsSelectedForDownload', async () => {
    const result = await runAction(clearDocumentsSelectedForDownload, {
      state: {
        documentsSelectedForDownload: [{ docketEntryId: 'id' }],
      },
    });

    expect(result.state.documentsSelectedForDownload).toEqual([]);
  });
});
