import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseDetailPageTabUnfrozenAction } from './setCaseDetailPageTabUnfrozenAction';

describe('setCaseDetailPageTabUnfrozenAction', () => {
  it('should set the currentViewMetadata.caseDetail.frozen state to be undefined', () => {
    const result = runAction(setCaseDetailPageTabUnfrozenAction, {
      state: {},
    });

    expect(result.state.currentViewMetadata.caseDetail.frozen).toEqual(
      undefined,
    );
  });
});
