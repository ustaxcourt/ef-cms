import { runAction } from 'cerebral/test';
import { setCaseDetailPageTabFrozenAction } from './setCaseDetailPageTabFrozenAction';

describe('setCaseDetailPageTabFrozenAction', () => {
  it('should set the caseDetailPage.frozen state to true', async () => {
    const result = await runAction(setCaseDetailPageTabFrozenAction);

    expect(result.state.caseDetailPage.frozen).toEqual(true);
  });
});
