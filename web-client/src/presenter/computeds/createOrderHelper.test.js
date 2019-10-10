import { createOrderHelper } from './createOrderHelper';
import { runCompute } from 'cerebral/test';

describe('createOrderHelper', () => {
  it('runs create order helper when not editing', () => {
    const result = runCompute(createOrderHelper, {
      state: {
        form: {
          documentTitle: 'Order',
        },
      },
    });

    expect(result.pageTitle).toEqual('Create Order');
    expect(result.isEditing).toEqual(false);
  });

  it('runs create order helper when editing', () => {
    const result = runCompute(createOrderHelper, {
      state: {
        documentToEdit: {},
        form: {
          documentTitle: 'Order',
        },
      },
    });

    expect(result.pageTitle).toEqual('Edit Order');
    expect(result.isEditing).toEqual(true);
    expect(result.documentToEdit).toMatchObject({});
  });
});
