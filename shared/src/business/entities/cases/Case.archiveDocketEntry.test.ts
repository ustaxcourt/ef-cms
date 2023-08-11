import { Case } from './Case';
import { DocketEntry } from '../DocketEntry';
import { MOCK_CASE } from '../../../test/mockCase';
import { PENDING_DOCKET_ENTRY } from '../../../test/mockDocketEntry';
import { applicationContext } from '../../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';

describe('archiveDocketEntry', () => {
  let caseRecord: Case;
  let docketEntryToArchive: DocketEntry;

  beforeEach(() => {
    docketEntryToArchive = new DocketEntry(cloneDeep(PENDING_DOCKET_ENTRY), {
      applicationContext,
    });
    docketEntryToArchive.servedAt = undefined;

    caseRecord = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [...MOCK_CASE.docketEntries, docketEntryToArchive],
      },
      {
        applicationContext,
      },
    );
  });

  it('should mark the docket entry as archived', () => {
    caseRecord.archiveDocketEntry(docketEntryToArchive);

    const archivedDocketEntry = caseRecord.archivedDocketEntries.find(
      d => d.docketEntryId === docketEntryToArchive.docketEntryId,
    );
    expect(archivedDocketEntry!.archived).toEqual(true);
  });

  it('should add the provided docket entry to the case archivedDocketEntries', () => {
    caseRecord.archiveDocketEntry(docketEntryToArchive);

    expect(
      caseRecord.archivedDocketEntries.find(
        d => d.docketEntryId === docketEntryToArchive.docketEntryId,
      ),
    ).toBeDefined();
  });

  it('should remove the provided docket entry from the case docketEntries array', () => {
    caseRecord.archiveDocketEntry(docketEntryToArchive);

    expect(
      caseRecord.docketEntries.find(
        d => d.docketEntryId === docketEntryToArchive.docketEntryId,
      ),
    ).toBeUndefined();
  });

  it('should not allow a docket entry that has already been served to be archived', () => {
    docketEntryToArchive.servedAt = '2014-02-01T05:00:00.000Z';

    expect(() => caseRecord.archiveDocketEntry(docketEntryToArchive)).toThrow(
      'Cannot archive docket entry that has already been served.',
    );
  });

  it('should not allow a docket entry that is already on the docket record be archived', () => {
    docketEntryToArchive.servedAt = undefined;
    docketEntryToArchive.isOnDocketRecord = true;

    expect(() => caseRecord.archiveDocketEntry(docketEntryToArchive)).toThrow(
      'Cannot archive docket entry that has already been served.',
    );
  });
});
