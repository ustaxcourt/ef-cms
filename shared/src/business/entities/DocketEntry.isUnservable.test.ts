import { DocketEntry } from './DocketEntry';
import { MINUTE_ENTRIES_MAP, UNSERVABLE_EVENT_CODES } from './EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';

describe('isUnservable', () => {
  it('should return true when the docketEntry eventCode is in the list of minute entries', () => {
    const minuteEntry = new DocketEntry(
      { eventCode: MINUTE_ENTRIES_MAP.captionOfCaseIsAmended.eventCode },
      { applicationContext },
    );

    expect(DocketEntry.isUnservable(minuteEntry)).toBe(true);
  });

  it.each(UNSERVABLE_EVENT_CODES)(
    'should return true when the docketEntry event code is in the list of unservable event codes',
    eventCode => {
      const unservableDocketEntry = new DocketEntry(
        { eventCode },
        { applicationContext },
      );

      expect(DocketEntry.isUnservable(unservableDocketEntry)).toBe(true);
    },
  );

  it('should return false when the docketEntry event code is NOT in the list of unservable event codes and it is NOT a minute entry', () => {
    const servableDocketEntry = new DocketEntry(
      { eventCode: 'O' }, // O is the Order event code, Orders are servable and NOT minute entries
      { applicationContext },
    );

    expect(DocketEntry.isUnservable(servableDocketEntry)).toBe(false);
  });
});
