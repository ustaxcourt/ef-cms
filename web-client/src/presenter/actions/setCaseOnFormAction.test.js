import { runAction } from 'cerebral/test';
import { setCaseOnFormAction } from './setCaseOnFormAction';

describe('setCaseOnFormAction', () => {
  it('sets caseDetail on state.form from props', async () => {
    const { state } = await runAction(setCaseOnFormAction, {
      props: {
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
