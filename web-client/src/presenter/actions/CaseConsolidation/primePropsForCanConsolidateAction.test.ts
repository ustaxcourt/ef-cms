import { presenter } from '../../presenter-mock';
import { primePropsForCanConsolidateAction } from './primePropsForCanConsolidateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

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
