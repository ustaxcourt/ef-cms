const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateOrderWithoutBodyInteractor,
} = require('./validateOrderWithoutBodyInteractor');
const { OrderWithoutBody } = require('../../entities/orders/OrderWithoutBody');

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

describe('validateOrderWithoutBodyInteractor', () => {
  it('returns the expected errors object on an empty order object', () => {
    const errors = validateOrderWithoutBodyInteractor(applicationContext, {
      orderMetadata: {},
    });

    expect(errors).toEqual({
      documentTitle: errorMessages.documentTitle[0].message,
      documentType: errorMessages.documentType,
      eventCode: errorMessages.eventCode,
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
