import { runCompute } from 'cerebral/test';

import { documentDetailHelper as documentDetailHelperComputed } from './documentDetailHelper';
import { withAppContextDecorator } from '../../../src/withAppContext';

import {
  createISODateString,
  formatDateString,
  prepareDateFromString,
} from '../../../../shared/src/business/utilities/DateHandler';

import { formatDocument } from '../../../../shared/src/business/utilities/getFormattedCaseDetail';

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
        formatDocument,
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

    it('should show the serve button when a docketclerk and the document is a Stipulated Decision and the document is not served already', () => {
      role = 'docketclerk';
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
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
                documentType: 'Stipulated Decision',
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

  it('should NOT show the serve button when a docketclerk and the document is a Stipulated Decision and document has already been served', () => {
    role = 'docketclerk';
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Stipulated Decision',
              status: 'served',
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(result.showServeDocumentButton).toEqual(false);
  });

  it('should filter out completed work items with Served on IRS messages', () => {
    role = 'seniorattorney';

    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentType: 'Proposed Stipulated Decision',
              processingStatus: 'pending',
              reviewDate: '2018-11-21T20:49:28.192Z',
              userId: 'taxpayer',
              workItems: [
                {
                  caseStatus: 'New',
                  completedAt: '2018-11-21T20:49:28.192Z',
                  document: {
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
                {
                  assigneeId: 'abc',
                  caseStatus: 'New',
                  document: {
                    documentType: 'Proposed Stipulated Decision',
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
              ],
            },
          ],
        },
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        workQueueToDisplay: { workQueueIsInternal: true },
      },
    });

    expect(result.formattedDocument.workItems).toHaveLength(1);
  });

  it('default to empty array when caseDetail.documents is undefined', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: undefined,
        },
      },
    });

    expect(result.formattedDocument).toMatchObject({});
  });

  it("default to empty array when a document's workItems are non-existent", () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItems: undefined,
            },
          ],
        },
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      },
    });

    expect(result.formattedDocument.documentId).toEqual(
      'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
    );
  });
});
