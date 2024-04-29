import { DocketEntry } from '../../entities/DocketEntry';
import { applicationContext } from '../../test/createTestApplicationContext';
import { shouldGenerateCoversheetForDocketEntry } from './updateDocketEntryMetaInteractor';

describe('updateDocketEntryMetaInteractor shouldGenerateCoversheetForDocketEntry', () => {
  let mockDocketEntry = new DocketEntry(
    {
      docketEntryId: 'e110995d-b825-4f7e-899e-1773aa8e7016',
      documentTitle: 'Summary Opinion',
      documentType: 'Summary Opinion',
      eventCode: 'SOP',
      filingDate: '2011-02-22T00:01:00.000Z',
      index: 7,
      judge: 'Buch',
      userId: '38c36925-c936-44c5-b219-e13039f7d235',
    },
    { applicationContext },
  );

  let entryRequiresCoverSheet = false;
  let filingDateUpdated = false;
  let originalDocketEntry = mockDocketEntry;
  let servedAtUpdated = false;
  let shouldAddNewCoverSheet = false;

  it('should return true when shouldAddNewCoverSheet and entryRequiresCoverSheet are true for a non-minute entry', () => {
    shouldAddNewCoverSheet = true;
    entryRequiresCoverSheet = true;

    const result = shouldGenerateCoversheetForDocketEntry({
      entryRequiresCoverSheet,
      filingDateUpdated,
      originalDocketEntry,
      servedAtUpdated,
      shouldAddNewCoverSheet,
    } as any);

    expect(result).toBe(true);
  });

  it('should return true when servedAtUpdated and entryRequiresCoverSheet are true for a non-minute entry', () => {
    shouldAddNewCoverSheet = true;
    entryRequiresCoverSheet = true;

    const result = shouldGenerateCoversheetForDocketEntry({
      entryRequiresCoverSheet,
      filingDateUpdated,
      originalDocketEntry,
      servedAtUpdated,
      shouldAddNewCoverSheet,
    } as any);

    expect(result).toBe(true);
  });

  it('should return true when the certificateOfService changes', () => {
    shouldAddNewCoverSheet = false;
    entryRequiresCoverSheet = true;

    const result = shouldGenerateCoversheetForDocketEntry({
      certificateOfServiceUpdated: true,
      entryRequiresCoverSheet,
      filingDateUpdated,
      originalDocketEntry,
      servedAtUpdated,
      shouldAddNewCoverSheet,
    } as any);

    expect(result).toBe(true);
  });

  it('should return true when the documentTitle changes', () => {
    shouldAddNewCoverSheet = false;
    entryRequiresCoverSheet = true;

    const result = shouldGenerateCoversheetForDocketEntry({
      certificateOfServiceUpdated: false,
      documentTitleUpdated: true,
      entryRequiresCoverSheet,
      filingDateUpdated,
      originalDocketEntry,
      servedAtUpdated,
      shouldAddNewCoverSheet,
    });

    expect(result).toBe(true);
  });

  it('should return false if nothing related to the coversheet has changed on the metadata', () => {
    shouldAddNewCoverSheet = false;
    entryRequiresCoverSheet = true;
    servedAtUpdated = false;
    filingDateUpdated = false;
    servedAtUpdated = false;
    shouldAddNewCoverSheet = false;

    const result = shouldGenerateCoversheetForDocketEntry({
      certificateOfServiceUpdated: false,
      documentTitleUpdated: false,
      entryRequiresCoverSheet,
      filingDateUpdated,
      originalDocketEntry,
      servedAtUpdated,
      shouldAddNewCoverSheet,
    });

    expect(result).toBe(false);
  });
});
