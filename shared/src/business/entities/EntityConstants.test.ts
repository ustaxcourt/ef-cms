import { ORDER_TYPES } from './EntityConstants';
import { OrderWithoutBody } from './orders/OrderWithoutBody';

describe('EntityConstants', () => {
  describe('ORDER_TYPES', () => {
    it('should validate all non-standard order types', () => {
      ORDER_TYPES.forEach(orderType => {
        if (!['O', 'NOT'].includes(orderType.eventCode)) {
          expect(new OrderWithoutBody(orderType).isValid()).toBeTruthy();
        }
      });
    });
  });
});
