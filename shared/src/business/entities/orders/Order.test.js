const { Order } = require('./Order');

describe('Order', () => {
  describe('validation', () => {
    it('returns true if required fields are passed in', () => {
      expect(
        new Order({
          orderBody: 'some text',
          orderTitle: 'Order to Eat Cake',
          orderType: 'Order',
        }).isValid(),
      ).toBeTruthy();
    });
    it('returns false if nothing is passed in', () => {
      expect(new Order({}).isValid()).toBeFalsy();
    });
  });
});
