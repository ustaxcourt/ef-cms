import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseOnFormUsingStateAction } from './setCaseOnFormUsingStateAction';

describe('setCaseOnFormUsingStateAction', () => {
  it('sets caseDetail on state.form from state.caseDetail and returns caseDetail', async () => {
    const result = await runAction(setCaseOnFormUsingStateAction, {
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
      },
    });

    expect(result.state.form).toEqual({
      docketNumber: '123-45',
    });
    expect(result.output).toEqual({
      caseDetail: {
        docketNumber: '123-45',
      },
    });
  });
});
