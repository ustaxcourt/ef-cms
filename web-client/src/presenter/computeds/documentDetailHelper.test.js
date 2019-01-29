import { runCompute } from 'cerebral/test';

import documentDetailHelper from './documentDetailHelper';

describe('formatted work queue computed', () => {
  it('formats the workitems', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          status: 'general',
        },
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showAction('complete', 'abc')).toEqual(true);
  });

  it('sets the isEditablePetition boolean false when case status is general', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          status: 'general',
        },
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.isEditablePetition).toEqual(false);
  });

  it('sets the isEditablePetition boolean true when case status new', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          status: 'New',
        },
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.isEditablePetition).toEqual(true);
  });

  it('sets the isEditablePetition boolean true when case status recalled', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          status: 'Recalled',
        },
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.isEditablePetition).toEqual(true);
  });
});
