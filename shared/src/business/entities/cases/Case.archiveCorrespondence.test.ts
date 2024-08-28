import { Case } from './Case';
import { Correspondence } from '../Correspondence';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

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
        authorizedUser: mockDocketClerkUser,
      },
    );
  });

  it('marks the correspondence document as archived', () => {
    caseRecord.archiveCorrespondence(correspondenceToArchive, {
      authorizedUser: mockDocketClerkUser,
    });
    const archivedDocketEntry = caseRecord.archivedCorrespondences.find(
      d => d.correspondenceId === correspondenceToArchive.correspondenceId,
    );
    expect(archivedDocketEntry.archived).toBeTruthy();
  });

  it('adds the provided document to the case archivedDocketEntries', () => {
    caseRecord.archiveCorrespondence(correspondenceToArchive, {
      authorizedUser: mockDocketClerkUser,
    });

    expect(
      caseRecord.archivedCorrespondences.find(
        d => d.correspondenceId === correspondenceToArchive.correspondenceId,
      ),
    ).toBeDefined();
  });
});
