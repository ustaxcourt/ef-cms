import { ORDER_TYPES, US_STATES } from './EntityConstants';
import { OrderWithoutBody } from './orders/OrderWithoutBody';

describe('EntityConstants', () => {
  describe('ORDER_TYPES', () => {
    it('should validate all non-standard order types', () => {
      ORDER_TYPES.forEach(orderType => {
        if (!['O', 'NOT'].includes(orderType.eventCode)) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(new OrderWithoutBody(orderType).isValid()).toBeTruthy();
        }
      });
    });
  });

  describe('US_STATES', () => {
    it('should be sorted alphabetically by full state name', () => {
      const stateNames = Object.values(US_STATES);

      expect(stateNames).toEqual(
        [...stateNames].sort((firstState, secondState) => {
          return firstState.localeCompare(secondState);
        }),
      );
    });
  });
});
