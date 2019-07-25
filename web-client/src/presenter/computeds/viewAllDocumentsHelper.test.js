import { Document } from '../../../../shared/src/business/entities/Document';
import { runCompute } from 'cerebral/test';
import { viewAllDocumentsHelper } from './viewAllDocumentsHelper';

describe('viewAllDocumentsHelper', () => {
  it('returns all document categories, document types, reasons, and sections', () => {
    const result = runCompute(viewAllDocumentsHelper, {
      state: {
        constants: {
          CATEGORIES: Document.CATEGORIES,
          CATEGORY_MAP: Document.CATEGORY_MAP,
        },
      },
    });

    expect(result.categoryMap).toBeTruthy();
    expect(result.documentTypesForSelect).toBeTruthy();
    expect(result.documentTypesForSelectSorted).toBeTruthy();
    expect(result.reasons).toBeTruthy();
    expect(result.sections).toBeTruthy();
  });

  it("doesn't return any categories when looking for a secondary document", () => {
    const result = runCompute(viewAllDocumentsHelper, {
      state: {
        constants: {
          CATEGORIES: Document.CATEGORIES,
          CATEGORY_MAP: Document.CATEGORY_MAP,
        },
        modal: {
          forSecondary: false,
        },
      },
    });

    expect(
      result.categoryMap.Motion.some(
        motion => motion.scenario === 'Nonstandard H',
      ),
    ).toEqual(true);
  });
});
