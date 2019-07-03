import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { stashCreateOrderModalDataAction } from './stashCreateOrderModalDataAction';

describe('stashCreateOrderModalDataAction', () => {
  it('stashes state.form values into state.screenMetadata.orderData', async () => {
    const result = await runAction(stashCreateOrderModalDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          documentTitle: 'Order to Do Something',
          documentType: 'Order',
          eventCode: 'O',
        },
        screenMetadata: {},
      },
    });
    expect(result.state.screenMetadata.orderData.eventCode).toEqual('O');
    expect(result.state.screenMetadata.orderData.documentTitle).toEqual(
      'Order to Do Something',
    );
    expect(result.state.screenMetadata.orderData.documentType).toEqual('Order');
  });

  it('does not error if form is empty', async () => {
    const result = await runAction(stashCreateOrderModalDataAction, {
      modules: {
        presenter,
      },
      screenMetadata: {},
      state: {
        form: {},
      },
    });
    expect(result.state.screenMetadata).toEqual({
      orderData: {
        documentTitle: undefined,
        documentType: undefined,
        eventCode: undefined,
      },
    });
  });
});
