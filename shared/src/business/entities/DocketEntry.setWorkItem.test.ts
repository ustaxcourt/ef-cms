import { A_VALID_DOCKET_ENTRY, MOCK_PETITIONERS } from './DocketEntry.test';
import { CASE_STATUS_TYPES, PETITIONS_SECTION } from './EntityConstants';
import { DocketEntry } from './DocketEntry';
import { WorkItem } from './WorkItem';

describe('setWorkItem', () => {
  it('should set work item on docket entry to the passed in work item and validate the nested work item', () => {
    const myDoc = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
      },
      { authorizedUser: undefined, petitioners: MOCK_PETITIONERS },
    );
    const workItem = new WorkItem({
      assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
      assigneeName: 'bob',
      caseStatus: CASE_STATUS_TYPES.new,
      caseTitle: 'Johnny Joe Jacobson',
      docketEntry: A_VALID_DOCKET_ENTRY,
      docketNumber: '101-18',
      section: PETITIONS_SECTION,
      sentBy: 'bob',
    });

    myDoc.setWorkItem(workItem);

    expect(myDoc.isValid()).toBeTruthy();

    myDoc.setWorkItem(new WorkItem({}));

    expect(myDoc.isValid()).toBeFalsy();
  });
});
