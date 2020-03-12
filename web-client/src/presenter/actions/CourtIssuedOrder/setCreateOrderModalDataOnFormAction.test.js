import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setCreateOrderModalDataOnFormAction } from './setCreateOrderModalDataOnFormAction';

describe('setCreateOrderModalDataOnFormAction', () => {
  it('unstashes state.modal values into state.form', async () => {
    const result = await runAction(setCreateOrderModalDataOnFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
        modal: {
          documentTitle: 'Order to Do Something',
          documentType: 'Order',
          eventCode: 'O',
        },
      },
    });
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.documentTitle).toEqual('Order to Do Something');
    expect(result.state.form.documentType).toEqual('Order');
  });

  it('does not error if modal is empty', async () => {
    const result = await runAction(setCreateOrderModalDataOnFormAction, {
      modal: {},
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });
    expect(result.state.form).toEqual({});
  });
});
