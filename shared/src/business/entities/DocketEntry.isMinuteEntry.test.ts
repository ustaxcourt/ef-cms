import { DocketEntry } from './DocketEntry';
import { MINUTE_ENTRIES_MAP } from './EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';

describe('isMinuteEntry', () => {
  it('should return true when the docketEntry eventCode is in the list of minute entries', () => {
    const minuteEntry = new DocketEntry(
      { eventCode: MINUTE_ENTRIES_MAP.captionOfCaseIsAmended.eventCode },
      { applicationContext },
    );

    expect(DocketEntry.isMinuteEntry(minuteEntry.eventCode)).toBe(true);
  });

  it('should return false when the docketEntry eventCode is NOT in the list of minute entries', () => {
    const orderDocketEntry = new DocketEntry(
      { eventCode: 'O' }, // O is the event code for orders, they are NOT minute entries
      { applicationContext },
    );

    expect(DocketEntry.isMinuteEntry(orderDocketEntry.eventCode)).toBe(false);
  });
});
