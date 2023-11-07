import { Order } from './Order';
import { getTextByCount } from '../../utilities/getTextByCount';

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

    it('should be invalid when documentTitle is over 100 characters long', () => {
      const order = new Order({
        documentTitle: getTextByCount(1001),
        documentType: 'Order',
        orderBody: 'some text',
      });

      expect(order.getFormattedValidationErrors()).toEqual({
        documentTitle:
          'Limit is 100 characters. Enter 100 or fewer characters.',
      });
    });
  });
});
