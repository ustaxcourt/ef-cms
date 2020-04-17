import { runAction } from 'cerebral/test';
import { setCaseAction } from './setCaseAction';

describe('setCaseAction', () => {
  it('sets state.caseDetail from props', async () => {
    const { state } = await runAction(setCaseAction, {
      props: {
        caseDetail: {
          caseId: '1234',
        },
      },
    });

    expect(state.caseDetail).toEqual({
      caseId: '1234',
    });
  });
});
