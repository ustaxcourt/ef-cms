import { presenter } from '../../presenter';
import { primePropsFromCaseDetailAction } from './primePropsFromCaseDetailAction';
import { runAction } from 'cerebral/test';

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
