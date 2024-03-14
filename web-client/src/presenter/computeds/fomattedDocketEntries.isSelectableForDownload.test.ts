import { isSelectableForDownload } from './formattedDocketEntries';

describe('formattedDocketEntries.isSelectableForDownload', () => {
  it('should return false if the entry is a minute entry', () => {
    const entry = {
      isFileAttached: true,
      isMinuteEntry: true,
      isOnDocketRecord: true,
    };
    const result = isSelectableForDownload(entry);
    expect(result).toBe(false);
  });

  it('should return false if the entry has no file attached', () => {
    const entry = {
      isFileAttached: false,
      isMinuteEntry: false,
      isOnDocketRecord: true,
    };
    const result = isSelectableForDownload(entry);
    expect(result).toBe(false);
  });

  it('should return false if the entry is on the docket record', () => {
    const entry = {
      isFileAttached: true,
      isMinuteEntry: false,
      isOnDocketRecord: false,
    };
    const result = isSelectableForDownload(entry);
    expect(result).toBe(false);
  });

  it('should return true if the entry is not a minute entry, has a file attached, and is on the docket record', () => {
    const entry = {
      isFileAttached: true,
      isMinuteEntry: false,
      isOnDocketRecord: true,
    };
    const result = isSelectableForDownload(entry);
    expect(result).toBe(true);
  });
});
