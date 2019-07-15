import { Document } from '../../../../shared/src/business/entities/Document';
import { completeDocumentTypeSectionHelper } from './completeDocumentTypeSectionHelper';
import { runCompute } from 'cerebral/test';

describe('completeDocumentTypeSectionHelper', () => {
  it("should return an empty object given there's no caseDetail", () => {
    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {},
        form: {},
      },
    });

    expect(result).toEqual({});
  });

  it('returns document info with a primary document only', () => {
    const categoryKey = 'Application';
    const categoryIdx = 0;

    const { category, documentType } = Document.CATEGORY_MAP[categoryKey][
      categoryIdx
    ];

    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {
          caseId: 'case-id-123',
        },
        constants: {
          CATEGORY_MAP: Document.CATEGORY_MAP,
        },
        form: {
          category,
          documentType,
        },
      },
    });

    expect(result.primary).toBeTruthy();
    expect(result.primary.showNonstandardForm).toBe(false);
  });

  it('returns document info with primary and secondaryDocument info', () => {
    const categoryKey = 'Application';
    const categoryIdx = 0;

    const { category, documentType } = Document.CATEGORY_MAP[categoryKey][
      categoryIdx
    ];

    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {
          caseId: 'case-id-123',
        },
        constants: {
          CATEGORY_MAP: Document.CATEGORY_MAP,
        },
        form: {
          category,
          documentType,
          secondaryDocument: {
            category,
            documentType,
          },
        },
      },
    });

    expect(result.primary).toBeTruthy();
    expect(result.secondary).toBeTruthy();
    expect(result.primary.showNonstandardForm).toBe(false);
    expect(result.secondary.showNonstandardForm).toBe(false);
  });
});
