import {
  ALLOWED_EVENT_CODES,
  JUDGE_ACTIVITY_REPORT_ORDER_EVENT_CODES,
  ORDER_TYPES,
  STANDING_ORDER_EVENT_CODES,
  US_STATES,
  US_STATES_OTHER,
  US_STATES_SORTED,
  US_STATES_OTHER_SORTED,
} from './EntityConstants';
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

  describe('US_STATES_OTHER_SORTED', () => {
    it('lists every US_STATES territory abbreviation ordered by full state name', () => {
      const fullNames = US_STATES_OTHER_SORTED.map(
        abbrev => US_STATES_OTHER[abbrev],
      );

      expect([...US_STATES_OTHER_SORTED].sort()).toEqual(
        Object.keys(US_STATES_OTHER).sort(),
      );
      expect(fullNames).toEqual(
        [...fullNames].sort((firstName, secondName) =>
          firstName.localeCompare(secondName),
        ),
      );
    });
  });

  describe('JUDGE_ACTIVITY_REPORT_ORDER_EVENT_CODES', () => {
    it('excludes every standing order event code', () => {
      STANDING_ORDER_EVENT_CODES.forEach(eventCode => {
        expect(JUDGE_ACTIVITY_REPORT_ORDER_EVENT_CODES).not.toContain(
          eventCode,
        );
      });
    });

    it('still includes order event codes that are not excluded', () => {
      expect(JUDGE_ACTIVITY_REPORT_ORDER_EVENT_CODES).toContain('O');
      expect(JUDGE_ACTIVITY_REPORT_ORDER_EVENT_CODES).not.toContain('OAJ');
      expect(JUDGE_ACTIVITY_REPORT_ORDER_EVENT_CODES).not.toContain('OST');
    });
  });

  describe('ALLOWED_EVENT_CODES', () => {
    it('includes every standing order event code so external users can access them before service', () => {
      STANDING_ORDER_EVENT_CODES.forEach(eventCode => {
        expect(ALLOWED_EVENT_CODES).toContain(eventCode);
      });
    });
  });
});
