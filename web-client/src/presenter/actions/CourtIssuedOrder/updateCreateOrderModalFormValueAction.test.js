import { Order } from '../../../../../shared/src/business/entities/orders/Order';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateCreateOrderModalFormValueAction } from './updateCreateOrderModalFormValueAction';

describe('updateCreateOrderModalFormValueAction', () => {
  it('sets state.form values correctly if valid event code is passed in', async () => {
    const result = await runAction(updateCreateOrderModalFormValueAction, {
      modules: {
        presenter,
      },
      props: { eventCode: 'ODD' },
      state: {
        constants: {
          ORDER_TYPES_MAP: Order.ORDER_TYPES,
        },
        form: {},
      },
    });
    expect(result.state.form.eventCode).toEqual('ODD');
    expect(result.state.form.documentTitle).toEqual(
      'Order of Dismissal and Decision',
    );
    expect(result.state.form.documentType).toEqual(
      'Order of Dismissal and Decision',
    );
  });

  it('unsets state.form values if event code is empty', async () => {
    const params = {
      modules: {
        presenter,
      },
      props: { eventCode: '' },
      state: {
        constants: {
          ORDER_TYPES_MAP: Order.ORDER_TYPES,
        },
        form: {
          documentTitle: 'Order of Dismissal and Decision',
          documentType: 'Order of Dismissal and Decision',
          eventCode: 'ODD',
        },
      },
    };
    let result = await runAction(updateCreateOrderModalFormValueAction, params);
    expect(result.state.form.eventCode).toBeUndefined();
    expect(result.state.form.documentTitle).toBeUndefined();
    expect(result.state.form.documentType).toBeUndefined();

    params.props.eventCode = undefined;
    result = await runAction(updateCreateOrderModalFormValueAction, params);
    expect(result.state.form.eventCode).toBeUndefined();
    expect(result.state.form.documentTitle).toBeUndefined();
    expect(result.state.form.documentType).toBeUndefined();

    params.props = {};
    result = await runAction(updateCreateOrderModalFormValueAction, params);
    expect(result.state.form.eventCode).toBeUndefined();
    expect(result.state.form.documentTitle).toBeUndefined();
    expect(result.state.form.documentType).toBeUndefined();
  });
});
