import { runCompute } from 'cerebral/test';

import documentDetailHelper from './documentDetailHelper';

describe('formatted work queue computed', () => {
  it('formats the workitems', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          status: 'General',
          documents: [],
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showAction('complete', 'abc')).toEqual(true);
  });

  it('sets the showCaseDetailsEdit boolean false when case status is general', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          status: 'General',
          documents: [],
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
          status: 'New',
          documents: [],
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
          status: 'Recalled',
          documents: [],
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showCaseDetailsEdit).toEqual(true);
  });
});
