import { DocketEntry } from './DocketEntry';
import {
  EXTERNAL_DOCUMENT_TYPES,
  ROLES,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from './EntityConstants';

describe('isAutoServed', () => {
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
  it('should return true if the documentType is an external document and the document is not a Simultaneous Document', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle: 'Answer to Second Amendment to Petition',
        documentType: 'Answer to Second Amendment to Petition',
      },
      { authorizedUser: undefined, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isAutoServed()).toBeTruthy();
  });

  it('should return true if the documentType is a practitioner association document and the document is not a Simultaneous Document', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle: 'Notice of Election to Participate',
        documentType: 'Notice of Election to Participate',
      },
      { authorizedUser: undefined, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isAutoServed()).toBeTruthy();

    docketEntry.documentTitle = 'Entry of Appearance';
    docketEntry.documentType = 'Entry of Appearance';
    expect(docketEntry.isAutoServed()).toBeTruthy();

    docketEntry.documentTitle = 'Notice of Election to Intervene';
    docketEntry.documentType = 'Notice of Election to Intervene';
    expect(docketEntry.isAutoServed()).toBeTruthy();

    docketEntry.documentTitle = 'Notice of Election to Participate';
    docketEntry.documentType = 'Notice of Election to Participate';
    expect(docketEntry.isAutoServed()).toBeTruthy();

    docketEntry.documentTitle = 'Notice of Intervention';
    docketEntry.documentType = 'Notice of Intervention';
    expect(docketEntry.isAutoServed()).toBeTruthy();
  });

  it('should return false if the documentType is an external document and the document title includes "Simultaneous" as these could be modified simultaneous briefs, not directly simultaneous', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle: 'Second Amended Simultaneous Reply Brief',
        documentType: EXTERNAL_DOCUMENT_TYPES[0],
        eventCode: 'AMAT',
      },
      { authorizedUser: undefined, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isAutoServed()).toBeFalsy();
  });

  it('should return false if the document type includes "Simultaneous"', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentType: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
        eventCode: 'SIAB',
      },
      { authorizedUser: undefined, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isAutoServed()).toBeFalsy();
  });

  it('should return false if the documentType is an internally-filed document', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle: 'Application for Examination Pursuant to Rule 73',
        documentType: 'Application for Examination Pursuant to Rule 73',
      },
      { authorizedUser: undefined, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isAutoServed()).toBeFalsy();
  });
});
