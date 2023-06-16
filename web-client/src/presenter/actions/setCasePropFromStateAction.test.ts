import { runAction } from '@web-client/presenter/test.cerebral';
import { setCasePropFromStateAction } from './setCasePropFromStateAction';

describe('setCasePropFromStateAction', () => {
  const DOCKET_NUMBER = '101-20';

  it('returns docketNumber from state.caseDetail.docketNumber', async () => {
    const result = await runAction(setCasePropFromStateAction, {
      state: { caseDetail: { docketNumber: DOCKET_NUMBER } },
    });

    expect(result.output).toEqual({
      docketNumber: DOCKET_NUMBER,
    });
  });
});
