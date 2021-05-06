const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../EntityConstants');

describe('archiveDocketEntry', () => {
  let caseRecord;
  let docketEntryToArchive;
  beforeEach(() => {
    docketEntryToArchive = {
      archived: undefined,
      docketEntryId: '79c29d3f-d292-482c-b722-388577154664',
      documentType: 'Order',
      eventCode: 'O',
      filedBy: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
    };

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
});
