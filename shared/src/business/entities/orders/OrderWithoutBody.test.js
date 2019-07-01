const { OrderWithoutBody } = require('./OrderWithoutBody');

describe('OrderWithoutBody', () => {
  describe('validation', () => {
    it('returns true if required fields are passed in', () => {
      expect(
        new OrderWithoutBody({
          documentTitle: 'Order to Eat Cake',
          documentType: 'Order',
        }).isValid(),
      ).toBeTruthy();
    });
    it('returns false if nothing is passed in', () => {
      expect(new OrderWithoutBody({}).isValid()).toBeFalsy();
    });
  });
});
