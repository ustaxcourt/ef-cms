import { MOCK_ANSWER, MOCK_MINUTE_ENTRY } from '@shared/test/mockDocketEntry';
import { isSelectableForDownload } from './formattedDocketEntries';

describe('formattedDocketEntries.isSelectableForDownload', () => {
  it('should return false if the entry is a minute entry', () => {
    const entry = {
      ...MOCK_MINUTE_ENTRY,
      isFileAttached: true,
      isOnDocketRecord: true,
    };
    const result = isSelectableForDownload(entry);
    expect(result).toBe(false);
  });

  it('should return false if the entry has no file attached', () => {
    const entry = {
      ...MOCK_ANSWER,
      isFileAttached: false,
      isOnDocketRecord: true,
    };
    const result = isSelectableForDownload(entry);
    expect(result).toBe(false);
  });

  it('should return false if the entry is not on the docket record', () => {
    const entry = {
      ...MOCK_ANSWER,
      isFileAttached: true,
      isOnDocketRecord: false,
    };
    const result = isSelectableForDownload(entry);
    expect(result).toBe(false);
  });

  it('should return true if the entry is not a minute entry, has a file attached, and is on the docket record', () => {
    const entry = {
      ...MOCK_ANSWER,
      isFileAttached: true,
      isOnDocketRecord: true,
    };
    const result = isSelectableForDownload(entry);
    expect(result).toBe(true);
  });
});
