import { Document } from '../../../../shared/src/business/entities/Document';
import { runCompute } from 'cerebral/test';
import { selectDocumentSelectHelper } from './selectDocumentSelectHelper';

describe('selectDocumentSelectHelper', () => {
  it('returns documentTypes for select components (regular and sorted)', () => {
    const result = runCompute(selectDocumentSelectHelper, {
      state: {
        constants: {
          CATEGORY_MAP: Document.CATEGORY_MAP,
        },
      },
    });

    expect(result.documentTypesForSelect).toBeTruthy();
    expect(result.documentTypesForSelectSorted).toBeTruthy();
  });
});
