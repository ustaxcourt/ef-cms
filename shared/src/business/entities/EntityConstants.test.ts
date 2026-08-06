import { ORDER_TYPES, US_STATES, US_STATES_SORTED } from './EntityConstants';
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

  describe('US_STATES_SORTED', () => {
    it('lists every US_STATES abbreviation ordered by full state name', () => {
      const fullNames = US_STATES_SORTED.map(abbrev => US_STATES[abbrev]);

      expect([...US_STATES_SORTED].sort()).toEqual(
        Object.keys(US_STATES).sort(),
      );
      expect(fullNames).toEqual(
        [...fullNames].sort((firstName, secondName) =>
          firstName.localeCompare(secondName),
        ),
      );
    });
  });
});
