import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseDetailPageTabUnfrozenAction } from './setCaseDetailPageTabUnfrozenAction';

describe('setCaseDetailPageTabUnfrozenAction', () => {
  it('should set the currentViewMetadata.caseDetail.frozen state to be undefined', async () => {
    const result = await runAction(setCaseDetailPageTabUnfrozenAction);

    expect(result.state.currentViewMetadata.caseDetail.frozen).toEqual(
      undefined,
    );
  });
});
