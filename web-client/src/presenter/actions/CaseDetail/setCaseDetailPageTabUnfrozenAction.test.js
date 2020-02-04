import { runAction } from 'cerebral/test';
import { setCaseDetailPageTabUnfrozenAction } from './setCaseDetailPageTabUnfrozenAction';

describe('setCaseDetailPageTabUnfrozenAction', () => {
  it('should set the caseDetailPage.frozen state to false', async () => {
    const result = await runAction(setCaseDetailPageTabUnfrozenAction);

    expect(result.state.caseDetailPage.frozen).toEqual(false);
  });
});
