const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { PENDING_DOCKET_ENTRY } from '../../../test/mockDocuments';
import { cloneDeep } from 'lodash';

describe('archiveDocketEntry', () => {
  let caseRecord: Case;
  let docketEntryToArchive: RawDocketEntry;
  beforeEach(() => {
    docketEntryToArchive = cloneDeep(PENDING_DOCKET_ENTRY);

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

  it('marks the docket entry as archived', () => {
    caseRecord.archiveDocketEntry(docketEntryToArchive, {
      applicationContext,
    });
    const archivedDocketEntry = caseRecord.archivedDocketEntries.find(
      d => d.docketEntryId === docketEntryToArchive.docketEntryId,
    );
    expect(archivedDocketEntry.archived).toBeTruthy();
  });

  it('adds the provided docket entry to the case archivedDocketEntries', () => {
    caseRecord.archiveDocketEntry(docketEntryToArchive, {
      applicationContext,
    });

    expect(
      caseRecord.archivedDocketEntries.find(
        d => d.docketEntryId === docketEntryToArchive.docketEntryId,
      ),
    ).toBeDefined();
  });

  it('removes the provided docket entry from the case docketEntries array', () => {
    caseRecord.archiveDocketEntry(docketEntryToArchive, {
      applicationContext,
    });

    expect(
      caseRecord.docketEntries.find(
        d => d.docketEntryId === docketEntryToArchive.docketEntryId,
      ),
    ).toBeUndefined();
  });

  it('should not allow a docket entry that has already been served to be archived', () => {
    docketEntryToArchive.servedAt = '2014-02-01T05:00:00.000Z';

    expect(() =>
      caseRecord.archiveDocketEntry(docketEntryToArchive, {
        applicationContext,
      }),
    ).toThrow('Cannot archive docket entry that has already been served.');
  });
});
