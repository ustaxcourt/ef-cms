import { DocketEntry } from './DocketEntry';
import { UNSERVABLE_EVENT_CODES } from './EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';

describe('isUnservable', () => {
  UNSERVABLE_EVENT_CODES.forEach(eventCode => {
    it(`returns true when the docketEntry event code is in the list of unservable event codes (${eventCode})`, () => {
      const unservableDocketEntry = new DocketEntry(
        { eventCode },
        { applicationContext },
      );

      expect(DocketEntry.isUnservable(unservableDocketEntry)).toBe(true);
    });
  });

  it('should return false when the docketEntry event code is NOT in the list of unservable event codes', () => {
    const servableDocketEntry = new DocketEntry(
      { eventCode: 'O' }, // O is the Order event code, Orders are servable
      { applicationContext },
    );

    expect(DocketEntry.isUnservable(servableDocketEntry)).toBe(false);
  });
});
