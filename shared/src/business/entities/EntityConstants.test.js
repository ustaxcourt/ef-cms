const { ORDER_TYPES, ROLES } = require('./EntityConstants');
const { OrderWithoutBody } = require('./orders/OrderWithoutBody');

describe('EntityConstants', () => {
  'use strict';
  it('receives constants as read-only (frozen)', () => {
    expect(ROLES.docketClerk).toBeDefined();
    expect(Object.isFrozen(ROLES)).toBe(true);
    expect(() => (ROLES.docketClerk = 'clark kent')).toThrow();
    expect(ROLES.docketClerk).toBe('docketclerk');
  });

  describe('ORDER_TYPES', () => {
    it('should validate all non-standard order types', () => {
      ORDER_TYPES.forEach(orderType => {
        console.log('orderType', orderType);
        if (!['O', 'NOT'].includes(orderType.eventCode)) {
          expect(new OrderWithoutBody(orderType).isValid()).toBeTruthy();
        }
      });
    });
  });
});
