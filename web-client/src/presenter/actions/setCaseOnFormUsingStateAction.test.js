import { runAction } from 'cerebral/test';
import { setCaseOnFormUsingStateAction } from './setCaseOnFormUsingStateAction';

describe('setCaseOnFormUsingStateAction', () => {
  it('sets caseDetail on state.form from props', async () => {
    const { state } = await runAction(setCaseOnFormUsingStateAction, {
      state: {
        caseDetail: {
          caseId: '1234',
        },
      },
    });

    expect(state.form).toEqual({
      caseId: '1234',
    });
  });
});
