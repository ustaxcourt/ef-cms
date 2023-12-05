import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getShowSealDocketRecordEntry } from './formattedDocketEntries';

describe('getShowSealDocketRecordEntry', () => {
  it('should return true when the entry is NOT an opinion', () => {
    const mockNotOpinionEntry = {
      eventCode: 'NOT OPINION',
    };

    const result = getShowSealDocketRecordEntry({
      applicationContext,
      entry: mockNotOpinionEntry,
    });

    expect(result).toBe(true);
  });

  it('should return false when the entry is an opinion', () => {
    const { OPINION_EVENT_CODES_WITH_BENCH_OPINION } =
      applicationContext.getConstants();

    const mockOpinionEntry = {
      eventCode: OPINION_EVENT_CODES_WITH_BENCH_OPINION[0],
    };

    const result = getShowSealDocketRecordEntry({
      applicationContext,
      entry: mockOpinionEntry,
    });

    expect(result).toBe(false);
  });
});
