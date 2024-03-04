import { getCreateOrderSelectedCases } from '@web-client/presenter/actions/getCreateOrderSelectedCases';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCreateOrderSelectedCases', () => {
  it('should return createOrderSelectedCases prop', async () => {
    const result = await runAction(getCreateOrderSelectedCases, {
      state: {
        createOrderSelectedCases: 'JOHN_TEST',
      },
    });

    expect(result.output.createOrderSelectedCases).toEqual('JOHN_TEST');
  });
});
