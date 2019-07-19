import { runCompute } from 'cerebral/test';

import { documentDetailHelper as documentDetailHelperComputed } from './documentDetailHelper';
import { withAppContextDecorator } from '../../../src/withAppContext';

import {
  createISODateString,
  formatDateString,
  prepareDateFromString,
} from '../../../../shared/src/business/utilities/DateHandler';

let role = 'petitionsclerk';

const documentDetailHelper = withAppContextDecorator(
  documentDetailHelperComputed,
  {
    getCurrentUser: () => ({
      role,
      userId: 'abc',
    }),
    getUtilities: () => {
      return {
        createISODateString,
        formatDateString,
        prepareDateFromString,
      };
    },
  },
);

describe('formatted work queue computed', () => {
  beforeEach(() => {
    role = 'petitionsclerk';
  });

  it('formats the workitems', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [],
          status: 'General Docket - Not at Issue',
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showAction('complete', 'abc')).toEqual(true);
  });

  it('sets the showCaseDetailsEdit boolean false when case status is general docket', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [],
          status: 'General Docket - Not at Issue',
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showCaseDetailsEdit).toEqual(false);
  });

  it('sets the showCaseDetailsEdit boolean true when case status new', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [],
          status: 'New',
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showCaseDetailsEdit).toEqual(true);
  });

  it('sets the showCaseDetailsEdit boolean true when case status recalled', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [],
          status: 'Recalled',
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showCaseDetailsEdit).toEqual(true);
  });

  describe('showDocumentInfoTab', () => {
    it('should be false if document is not a petition', () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'NotAPetition',
              },
            ],
            status: 'Recalled',
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showDocumentInfoTab).toEqual(false);
    });

    it('should be true if document is a petition and status is New, Recalled, or Batched for IRS', () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: 'Recalled',
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showDocumentInfoTab).toEqual(true);
    });

    it('should be false if document is a petition and status is not New, Recalled, or Batched for IRS', () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: 'General Docket - Not at Issue',
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showDocumentInfoTab).toEqual(false);
    });

    it('should show the serve button when a docketclerk and the document is a signed stipulated decision and the document is not served already', () => {
      role = 'docketclerk';
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Signed Stipulated Decision',
                status: 'new',
              },
            ],
          },
          documentId: 'abc',
        },
      });
      expect(result.showServeDocumentButton).toEqual(true);
    });

    it('should NOT show the serve button when user is a NOT a docketclerk', () => {
      role = 'petitionsclerk';
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Signed Stipulated Decision',
              },
            ],
          },
          documentId: 'abc',
        },
      });
      expect(result.showServeDocumentButton).toEqual(false);
    });

    it('should NOT show the serve button when the document is NOT a signed stipulated decisiion', () => {
      role = 'petitionsclerk';
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Proposed Stipulated Decision',
              },
            ],
          },
          documentId: 'abc',
        },
      });
      expect(result.showServeDocumentButton).toEqual(false);
    });
  });

  it('should NOT show the serve button when a docketclerk and the document is a signed stipulated decision and document has already been served', () => {
    role = 'docketclerk';
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Signed Stipulated Decision',
              status: 'served',
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(result.showServeDocumentButton).toEqual(false);
  });
});
