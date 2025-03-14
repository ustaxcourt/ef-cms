import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocumentSelectedForScanAction } from './setDocumentSelectedForScanAction';
import { SCANNER_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';

describe('setDocumentSelectedForScanAction', () => {
  it('sets state.currentViewMetadata.documentSelectedForScan to the value passed into the action', async () => {
    const { state } = await runAction(
      setDocumentSelectedForScanAction(SCANNER_DOCUMENT_TYPES.petition),
      {
        state: {},
      },
    );
    expect(state.currentViewMetadata.documentSelectedForScan).toEqual(
      SCANNER_DOCUMENT_TYPES.petition,
    );
  });
});
