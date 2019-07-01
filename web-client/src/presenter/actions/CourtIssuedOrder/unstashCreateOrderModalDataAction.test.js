import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { unstashCreateOrderModalDataAction } from './unstashCreateOrderModalDataAction';

describe('unstashCreateOrderModalDataAction', () => {
  it('unstashes state.screenMetadata.orderData values into state.form', async () => {
    const result = await runAction(unstashCreateOrderModalDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
        screenMetadata: {
          orderData: {
            documentTitle: 'Order to Do Something',
            documentType: 'Order',
            eventCode: 'O',
          },
        },
      },
    });
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.documentTitle).toEqual('Order to Do Something');
    expect(result.state.form.documentType).toEqual('Order');
  });

  it('does not error if screenMetadata is empty', async () => {
    const result = await runAction(unstashCreateOrderModalDataAction, {
      modules: {
        presenter,
      },
      screenMetadata: {},
      state: {
        form: {},
      },
    });
    expect(result.state.form).toEqual({});
  });
});
