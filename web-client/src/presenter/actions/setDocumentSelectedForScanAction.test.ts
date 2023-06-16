import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocumentSelectedForScanAction } from './setDocumentSelectedForScanAction';

describe('setDocumentSelectedForScanAction', () => {
  it('sets state.currentViewMetadata.documentSelectedForScan to the value passed into the action', async () => {
    const documentType = 'petitonFile';
    const { state } = await runAction(
      setDocumentSelectedForScanAction(documentType),
      {
        state: {},
      },
    );
    expect(state.currentViewMetadata.documentSelectedForScan).toEqual(
      documentType,
    );
  });
});
