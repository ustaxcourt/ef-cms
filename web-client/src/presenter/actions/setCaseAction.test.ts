import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseAction } from './setCaseAction';

describe('setCaseAction', () => {
  it('sets state.caseDetail from props', async () => {
    const { state } = await runAction(setCaseAction, {
      props: {
        caseDetail: {
          docketNumber: '123-45',
        },
      },
    });

    expect(state.caseDetail).toEqual({
      docketNumber: '123-45',
    });
  });
});
