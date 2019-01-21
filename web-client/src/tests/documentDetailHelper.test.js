import { runCompute } from 'cerebral/test';

import helper from '../presenter/computeds/documentDetailHelper';

describe('formatted work queue computed', () => {
  it('formats the workitems', () => {
    const result = runCompute(helper.showAction, {
      state: {
        workItemActions: {
          abc: 'complete',
        },
      },
    })('complete', 'abc');
    expect(result).toEqual(true);
  });
});
