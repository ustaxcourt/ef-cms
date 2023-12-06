import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseOnFormAction } from './setCaseOnFormAction';

describe('setCaseOnFormAction', () => {
  it('sets caseDetail on state.form from props', async () => {
    const { state } = await runAction(setCaseOnFormAction, {
      props: {
        caseDetail: {
          docketNumber: '123-45',
        },
      },
    });

    expect(state.form).toEqual({
      docketNumber: '123-45',
    });
  });
});
