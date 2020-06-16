import { runAction } from 'cerebral/test';
import { setCaseOnFormUsingStateAction } from './setCaseOnFormUsingStateAction';

describe('setCaseOnFormUsingStateAction', () => {
  it('sets caseDetail on state.form from state.caseDetail and returns caseDetail', async () => {
    const result = await runAction(setCaseOnFormUsingStateAction, {
      state: {
        caseDetail: {
          caseId: '1234',
        },
      },
    });

    expect(result.state.form).toEqual({
      caseId: '1234',
    });
    expect(result.output).toEqual({
      caseDetail: {
        caseId: '1234',
      },
    });
  });
});
