import { presenter } from '../../presenter';
import { primePropsFromModalStateAction } from './primePropsFromModalStateAction';
import { runAction } from 'cerebral/test';

describe('primePropsFromModalStateAction', () => {
  it('should update the props from state', async () => {
    const result = await runAction(primePropsFromModalStateAction, {
      modules: { presenter },
      state: { modal: { caseId: '123', name: 'Billy' } },
    });

    expect(result.output).toEqual({
      caseId: '123',
      name: 'Billy',
    });
  });
});
