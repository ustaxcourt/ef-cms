import { runAction } from 'cerebral/test';
import { setCaseDetailPageTabFrozenAction } from './setCaseDetailPageTabFrozenAction';

describe('setCaseDetailPageTabFrozenAction', () => {
  it('should set the currentViewMetadata.caseDetail.frozen state to true', async () => {
    const result = await runAction(setCaseDetailPageTabFrozenAction);

    expect(result.state.currentViewMetadata.caseDetail.frozen).toEqual(true);
  });
});
