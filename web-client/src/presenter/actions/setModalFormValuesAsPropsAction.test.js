import { runAction } from 'cerebral/test';
import { setModalFormValuesAsPropsAction } from './setModalFormValuesAsPropsAction';

describe('setModalFormValuesAsPropsAction', () => {
  it('sets docketNumber, documentType and documentTitle on props from state.modal and state.caseDetail', async () => {
    const docketNumber = '999-99';
    const documentType = 'Order';
    const documentTitle = 'Order to do something.';

    const result = await runAction(setModalFormValuesAsPropsAction, {
      props: {},
      state: {
        caseDetail: { docketNumber },
        modal: { documentTitle, documentType },
      },
    });
    expect(result.output).toEqual({
      docketNumber,
      documentTitle,
      documentType,
    });
  });
});
