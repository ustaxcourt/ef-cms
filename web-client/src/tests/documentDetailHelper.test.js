import { runCompute } from 'cerebral/test';

import { showAction } from '../presenter/computeds/documentDetailHelper';

describe('formatted work queue computed', () => {
  it('formats the workitems', () => {
    const result = runCompute(showAction, {
      state: {
        workItemActions: {
          abc: 'complete',
        },
      },
    })('complete', 'abc');
    expect(result).toEqual(true);
  });
});
