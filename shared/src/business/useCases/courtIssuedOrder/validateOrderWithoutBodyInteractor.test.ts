import { applicationContext } from '../../test/createTestApplicationContext';
import { validateOrderWithoutBodyInteractor } from './validateOrderWithoutBodyInteractor';

describe('validateOrderWithoutBodyInteractor', () => {
  it('returns the expected errors object on an empty order object', () => {
    const errors = validateOrderWithoutBodyInteractor(applicationContext, {
      orderMetadata: {},
    });

    expect(errors).toEqual({
      documentTitle: 'Enter the title of this order',
      documentType: 'Select an order type',
      eventCode: 'Select an order type',
    });
  });

  it('returns no errors when a valid order object is passed through', async () => {
    const errors = await validateOrderWithoutBodyInteractor(
      applicationContext,
      {
        orderMetadata: {
          documentTitle: 'Order to Be Awesome',
          documentType: 'Order',
          eventCode: 'O',
        },
      },
    );

    expect(errors).toEqual(null);
  });
});
