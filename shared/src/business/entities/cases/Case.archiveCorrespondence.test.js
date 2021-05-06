const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { Correspondence } = require('../Correspondence');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('archiveCorrespondence', () => {
  let caseRecord;
  let correspondenceToArchive;
  beforeEach(() => {
    correspondenceToArchive = new Correspondence({
      correspondenceId: '123-abc',
      documentTitle: 'My Correspondence',
      filedBy: 'Docket clerk',
    });

    caseRecord = new Case(
      {
        ...MOCK_CASE,
        correspondence: [correspondenceToArchive],
      },
      {
        applicationContext,
      },
    );
  });

  it('marks the correspondence document as archived', () => {
    caseRecord.archiveCorrespondence(correspondenceToArchive, {
      applicationContext,
    });
    const archivedDocketEntry = caseRecord.archivedCorrespondences.find(
      d => d.correspondenceId === correspondenceToArchive.correspondenceId,
    );
    expect(archivedDocketEntry.archived).toBeTruthy();
  });

  it('adds the provided document to the case archivedDocketEntries', () => {
    caseRecord.archiveCorrespondence(correspondenceToArchive, {
      applicationContext,
    });

    expect(
      caseRecord.archivedCorrespondences.find(
        d => d.correspondenceId === correspondenceToArchive.correspondenceId,
      ),
    ).toBeDefined();
  });
});
