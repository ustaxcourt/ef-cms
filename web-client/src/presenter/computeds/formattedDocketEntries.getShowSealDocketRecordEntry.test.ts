import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  type FormattedDocketEntry,
  getShowSealDocketRecordEntry,
} from './formattedDocketEntries';

describe('getShowSealDocketRecordEntry', () => {
  it('should return true when the entry is NOT an opinion', () => {
    const mockNotOpinionEntry: FormattedDocketEntry = {
      eventCode: 'NOT OPINION',
    } as unknown as FormattedDocketEntry;

    const result = getShowSealDocketRecordEntry({ entry: mockNotOpinionEntry });

    expect(result).toBe(true);
  });

  it('should return false when the entry is an opinion', () => {
    const { OPINION_EVENT_CODES_WITH_BENCH_OPINION } =
      applicationContext.getConstants();

    const mockOpinionEntry: FormattedDocketEntry = {
      eventCode: OPINION_EVENT_CODES_WITH_BENCH_OPINION[0],
    } as unknown as FormattedDocketEntry;

    const result = getShowSealDocketRecordEntry({ entry: mockOpinionEntry });

    expect(result).toBe(false);
  });
});
