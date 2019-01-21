import { runCompute } from 'cerebral/test';

import documentDetailHelper from '../presenter/computeds/documentDetailHelper';

describe('formatted work queue computed', () => {
  it('formats the workitems', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showAction('complete', 'abc')).toEqual(true);
  });
});
