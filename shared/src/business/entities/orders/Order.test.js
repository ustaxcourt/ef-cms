const { Order } = require('./Order');

describe('Order', () => {
  describe('validation', () => {
    it('returns true if required fields are passed in', () => {
      expect(
        new Order({
          documentTitle: 'Order to Eat Cake',
          documentType: 'Order',
          orderBody: 'some text',
        }).isValid(),
      ).toBeTruthy();
    });
    it('returns false if nothing is passed in', () => {
      expect(new Order({}).isValid()).toBeFalsy();
    });
  });
});
