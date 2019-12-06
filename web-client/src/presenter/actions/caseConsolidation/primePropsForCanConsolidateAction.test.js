import { presenter } from '../../presenter';
import { primePropsForCanConsolidateAction } from './primePropsForCanConsolidateAction';
import { runAction } from 'cerebral/test';

describe('primePropsForCanConsolidateAction', () => {
  it('should update the props from state', async () => {
    const result = await runAction(primePropsForCanConsolidateAction, {
      modules: { presenter },
      state: { caseDetail: '123', modal: { caseDetail: '345' } },
    });

    expect(result.output).toEqual({
      caseDetail: '123',
      caseToConsolidate: '345',
      confirmSelection: false,
    });
  });
});
