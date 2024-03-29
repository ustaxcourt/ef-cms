import { DocketEntry } from './DocketEntry';
import { MINUTE_ENTRIES_MAP } from './EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';

describe('isMinuteEntry', () => {
  describe('non RQT event codes', () => {
    const nonRQTMinuteEntries = Object.keys(MINUTE_ENTRIES_MAP)
      .map(key => MINUTE_ENTRIES_MAP[key].eventCode)
      .filter(eventCode => eventCode !== 'RQT');

    it.each(nonRQTMinuteEntries)(
      'should return true when the docketEntry eventCode is in the list of minute entries that are not RQT %s',
      eventCode => {
        const minuteEntry = new DocketEntry(
          { eventCode },
          { applicationContext },
        );

        expect(DocketEntry.isMinuteEntry(minuteEntry)).toBe(true);
      },
    );

    it('should return false when the docketEntry eventCode is NOT in the list of minute entries', () => {
      const orderDocketEntry = new DocketEntry(
        { eventCode: 'O', isFileAttached: true },
        { applicationContext },
      );

      expect(DocketEntry.isMinuteEntry(orderDocketEntry)).toBe(false);
    });
  });

  describe('RQT event code', () => {
    it('should return false when there is a file attached', () => {
      const orderDocketEntry = new DocketEntry(
        { eventCode: 'RQT', isFileAttached: true },
        { applicationContext },
      );

      expect(DocketEntry.isMinuteEntry(orderDocketEntry)).toBe(false);
    });

    it('should return true when there is a not file attached', () => {
      const orderDocketEntry = new DocketEntry(
        { eventCode: 'RQT', isFileAttached: false },
        { applicationContext },
      );

      expect(DocketEntry.isMinuteEntry(orderDocketEntry)).toBe(true);
    });
  });
});
