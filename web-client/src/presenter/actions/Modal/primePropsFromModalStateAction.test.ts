import { presenter } from '../../presenter-mock';
import { primePropsFromModalStateAction } from './primePropsFromModalStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('primePropsFromModalStateAction', () => {
  it('should update the props from state', async () => {
    const result = await runAction(primePropsFromModalStateAction, {
      modules: { presenter },
      state: { modal: { docketNumber: '123-45', name: 'Billy' } },
    });

    expect(result.output).toEqual({
      docketNumber: '123-45',
      name: 'Billy',
    });
  });
});
