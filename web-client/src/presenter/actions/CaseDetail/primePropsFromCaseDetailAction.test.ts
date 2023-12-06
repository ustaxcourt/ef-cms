import { presenter } from '../../presenter-mock';
import { primePropsFromCaseDetailAction } from './primePropsFromCaseDetailAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('primePropsFromCaseDetailAction', () => {
  it('should update the props from state', async () => {
    const result = await runAction(primePropsFromCaseDetailAction, {
      modules: { presenter },
      state: { caseDetail: '123456' },
    });

    expect(result.output).toEqual({
      caseDetail: '123456',
    });
  });
});
