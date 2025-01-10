import { CASE_STATUS_TYPES, PETITIONS_SECTION, ROLES } from './EntityConstants';
import { DocketEntry } from './DocketEntry';
import { WorkItem } from './WorkItem';

describe('setWorkItem', () => {
  const mockPrimaryId = '7111b30b-ad38-42c8-9db0-d938cb2cb16b';
  const mockSecondaryId = '55e5129c-ab54-4a9d-a8cf-5a4479ec08b6';

  const A_VALID_DOCKET_ENTRY = {
    createdAt: '2020-07-17T19:28:29.675Z',
    docketEntryId: '0f5e035c-efa8-49e4-ba69-daf8a166a98f',
    docketNumber: '101-21',
    documentType: 'Petition',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    filedByRole: ROLES.petitioner,
    filers: [mockPrimaryId],
    receivedAt: '2020-07-17T19:28:29.675Z',
    userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
  };

  const MOCK_PETITIONERS = [
    { contactId: mockPrimaryId, name: 'Bob' },
    { contactId: mockSecondaryId, name: 'Bill' },
  ];
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
