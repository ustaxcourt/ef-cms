import * as CONSTANTS from '../../../../shared/src/business/entities/WorkQueue';
import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { filterWorkItems } from './formattedWorkQueue';

const MY_MESSAGES_INBOX = {
  workQueueIsInternal: true,
  workQueueToDisplay: { box: 'inbox', queue: 'my' },
};
const MY_MESSAGES_OUTBOX = {
  workQueueIsInternal: true,
  workQueueToDisplay: { box: 'outbox', queue: 'my' },
};

const SECTION_MESSAGES_INBOX = {
  workQueueIsInternal: true,
  workQueueToDisplay: { box: 'inbox', queue: 'section' },
};

const SECTION_MESSAGES_OUTBOX = {
  workQueueIsInternal: true,
  workQueueToDisplay: { box: 'outbox', queue: 'section' },
};

const MY_DOCUMENT_QC_INBOX = {
  workQueueIsInternal: false,
  workQueueToDisplay: { box: 'inbox', queue: 'my' },
};

const MY_DOCUMENT_QC_BATCHED = {
  workQueueIsInternal: false,
  workQueueToDisplay: { box: 'batched', queue: 'my' },
};

const MY_DOCUMENT_QC_OUTBOX = {
  workQueueIsInternal: false,
  workQueueToDisplay: { box: 'outbox', queue: 'my' },
};

const SECTION_DOCUMENT_QC_INBOX = {
  workQueueIsInternal: false,
  workQueueToDisplay: { box: 'inbox', queue: 'section' },
};

const SECTION_DOCUMENT_QC_BATCHED = {
  workQueueIsInternal: false,
  workQueueToDisplay: { box: 'batched', queue: 'section' },
};

const SECTION_DOCUMENT_QC_OUTBOX = {
  workQueueIsInternal: false,
  workQueueToDisplay: { box: 'outbox', queue: 'section' },
};

const petitionsClerk1 = {
  role: 'petitionsclerk',
  userId: 'p1',
};

const petitionsClerk2 = {
  role: 'petitionsclerk',
  userId: 'p2',
};

const docketClerk1 = {
  role: 'docketclerk',
  userId: 'd1',
};

const docketClerk2 = {
  role: 'docketclerk',
  userId: 'd2',
};

const seniorAttorney = {
  role: 'seniorattorney',
  userId: 'd2',
};

const generateWorkItem = data => {
  const baseWorkItem = {
    assigneeId: null,
    assigneeName: null,
    caseId: '123',
    caseStatus: 'New',
    createdAt: '2018-12-27T18:05:54.166Z',
    docketNumber: '100-01',
    document: {
      createdAt: '2018-12-27T18:05:54.164Z',
      documentId: '456',
      documentType: 'Answer',
    },
    messages: [
      {
        createdAt: '2018-12-27T18:05:54.164Z',
        from: 'Test Respondent',
        fromUserId: 'respondent',
        message: 'Answer filed by respondent is ready for review',
        messageId: '789',
      },
      {
        createdAt: '2018-12-27T18:05:54.164Z',
        from: 'Test Docketclerk',
        fromUserId: 'docketclerk',
        message: '012',
        messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      },
    ],
    section: 'docket',
    sentBy: 'respondent',
    updatedAt: '2018-12-27T18:05:54.164Z',
    workItemId: 'abc',
  };

  return { ...baseWorkItem, ...data };
};

// My Messages Inbox
// - isInternal === true
// - item.assigneeId == user.userId
// - item.section == user role section
// - !item.completedAt

// My Messages Sent
// - isInternal === true
// - item.sentByUserId == user.userId
// - !item.completedAt

// Section Inbox Messages
// - isInternal === true
// - item.section == user role section
// - !item.completedAt

// Section Outbox Messages
// - isInternal === true
// - item.sentBySection === user role section
// - !item.completedAt

// My DocumentQC Inbox
// - isInternal === false
// - item.assigneeId == user.userId
// - item.section == user role section
// - !item.completedAt

// My Document QC Batched
// - isInternal === false
// - item.section === 'irsBatchSection'
// - item.sentByUserId === user.userId
// - item.caseStatus = 'Batched for IRS'
// - !item.completedAt

// My Document QC Served
// - isInternal === false
// - item.section === 'irsBatchSection'
// - item.completedByUserId === user.userId
// - !!item.completedAt

// My Document QC Processed (Docket)
// - isInternal === true
// - item.completedByUserId == user.userId
// - item.section === 'docket'

// Section Document QC Inbox
// - isInternal === false
// - item.section === user role section
// - !item.completedAt

// Section Document QC Batched
// - isInternal === false
// - item.section === 'irsBatchSection'
// - item.caseStatus = 'Batched for IRS'
// - !item.completedAt

// Section Document QC Served
// - isInternal = false
// - item.section === 'irsBatchSection'
// - !!item.completedAt

// Section Document QC Processed (Docket)
// - isInternal === false
// - !!item.completedAt
// - item.section === 'docket'

// Sr Attny Document QC Inbox
// - item.section == 'docket'
// - isInternal === false
// - !item.completedAt

describe('filterWorkItems', () => {
  // Petitions
  let workItemPetitionsMyMessagesInbox;
  let workItemPetitionsMyMessagesSent;
  let workItemPetitionsSectionMessagesInbox;
  let workItemPetitionsSectionMessagesSent;
  let workItemPetitionsMyDocumentQCInbox;
  let workItemPetitionsMyDocumentQCBatched;
  let workItemPetitionsMyDocumentQCServed;
  let workItemPetitionsSectionDocumentQCInbox;
  let workItemPetitionsSectionDocumentQCBatched;
  let workItemPetitionsSectionDocumentQCServed;
  // Docket
  let workItemDocketMyMessagesInbox;
  let workItemDocketMyMessagesSent;
  let workItemDocketSectionMessagesInbox;
  let workItemDocketSectionMessagesSent;
  let workItemDocketMyDocumentQCInbox;
  let workItemDocketSectionDocumentQCInbox;

  let workQueueInbox;
  let workQueueBatched;
  let workQueueOutbox;

  beforeEach(() => {
    workItemPetitionsMyMessagesInbox = generateWorkItem({
      assigneeId: petitionsClerk1.userId,
      completedAt: null,
      docketNumber: '100-01',
      isInternal: true,
      section: CONSTANTS.PETITIONS_SECTION,
    });

    workItemPetitionsMyMessagesSent = generateWorkItem({
      assigneeId: petitionsClerk2.userId,
      docketNumber: '100-02',
      isInternal: true,
      section: CONSTANTS.PETITIONS_SECTION,
      sentBySection: CONSTANTS.PETITIONS_SECTION,
      sentByUserId: petitionsClerk1.userId,
    });

    workItemPetitionsSectionMessagesInbox = generateWorkItem({
      completedAt: null,
      docketNumber: '100-03',
      isInternal: true,
      section: CONSTANTS.PETITIONS_SECTION,
    });

    workItemPetitionsSectionMessagesSent = generateWorkItem({
      docketNumber: '100-04',
      isInternal: true,
      sentBySection: CONSTANTS.PETITIONS_SECTION,
      sentByUserId: petitionsClerk2.userId,
    });

    workItemPetitionsMyDocumentQCInbox = generateWorkItem({
      assigneeId: petitionsClerk1.userId,
      docketNumber: '100-05',
      isInternal: false,
      section: CONSTANTS.PETITIONS_SECTION,
    });

    workItemPetitionsMyDocumentQCBatched = generateWorkItem({
      caseStatus: Case.STATUS_TYPES.batchedForIRS,
      docketNumber: '100-06',
      isInternal: false,
      section: CONSTANTS.IRS_BATCH_SYSTEM_SECTION,
      sentByUserId: petitionsClerk1.userId,
    });

    workItemPetitionsMyDocumentQCServed = generateWorkItem({
      assigneeId: petitionsClerk1.userId,
      caseStatus: 'Calendared',
      completedAt: '2019-07-18T18:05:54.166Z',
      completedByUserId: petitionsClerk1.userId,
      docketNumber: '100-07',
      isInternal: false,
      section: CONSTANTS.IRS_BATCH_SYSTEM_SECTION,
      sentByUserId: petitionsClerk1.userId,
    });

    workItemPetitionsSectionDocumentQCInbox = generateWorkItem({
      completedAt: null,
      docketNumber: '100-08',
      isInternal: false,
      section: CONSTANTS.PETITIONS_SECTION,
    });

    workItemPetitionsSectionDocumentQCBatched = generateWorkItem({
      assigneeId: petitionsClerk2.userId,
      caseStatus: Case.STATUS_TYPES.batchedForIRS,
      docketNumber: '100-09',
      isInternal: false,
      section: CONSTANTS.IRS_BATCH_SYSTEM_SECTION,
    });

    workItemPetitionsSectionDocumentQCServed = generateWorkItem({
      assigneeId: petitionsClerk2.userId,
      caseStatus: 'Calendared',
      completedAt: '2019-07-18T18:05:54.166Z',
      completedByUserId: petitionsClerk2.userId,
      docketNumber: '100-10',
      isInternal: false,
      section: CONSTANTS.IRS_BATCH_SYSTEM_SECTION,
      sentByUserId: petitionsClerk2.userId,
    });

    workItemDocketMyMessagesInbox = generateWorkItem({
      assigneeId: docketClerk1.userId,
      completedAt: null,
      docketNumber: '100-11',
      isInternal: true,
      section: CONSTANTS.DOCKET_SECTION,
    });

    workItemDocketMyMessagesSent = generateWorkItem({
      assigneeId: docketClerk2.userId,
      docketNumber: '100-12',
      isInternal: true,
      sentBySection: CONSTANTS.DOCKET_SECTION,
      sentByUserId: docketClerk1.userId,
    });

    workItemDocketSectionMessagesInbox = generateWorkItem({
      completedAt: null,
      docketNumber: '100-13',
      isInternal: true,
      section: CONSTANTS.DOCKET_SECTION,
    });

    workItemDocketSectionMessagesSent = generateWorkItem({
      docketNumber: '100-14',
      isInternal: true,
      sentBySection: CONSTANTS.DOCKET_SECTION,
      sentByUserId: docketClerk2.userId,
    });

    workItemDocketMyDocumentQCInbox = generateWorkItem({
      assigneeId: docketClerk1.userId,
      completedAt: null,
      docketNumber: '100-15',
      isInternal: false,
      section: CONSTANTS.DOCKET_SECTION,
    });

    workItemDocketSectionDocumentQCInbox = generateWorkItem({
      completedAt: null,
      docketNumber: '100-17',
      isInternal: false,
      section: CONSTANTS.DOCKET_SECTION,
    });

    workQueueInbox = [
      workItemPetitionsMyMessagesInbox,
      workItemPetitionsSectionMessagesInbox,
      workItemPetitionsMyDocumentQCInbox,
      workItemPetitionsSectionDocumentQCInbox,
      workItemDocketMyMessagesInbox,
      workItemDocketSectionMessagesInbox,
      workItemDocketMyDocumentQCInbox,
      workItemDocketSectionDocumentQCInbox,
    ];

    workQueueBatched = [
      workItemPetitionsMyDocumentQCBatched,
      workItemPetitionsSectionDocumentQCBatched,
    ];

    workQueueOutbox = [
      workItemPetitionsMyMessagesSent,
      workItemPetitionsSectionMessagesSent,
      workItemPetitionsMyDocumentQCServed,
      workItemPetitionsSectionDocumentQCServed,
      workItemDocketMyMessagesSent,
      workItemDocketSectionMessagesSent,
    ];
  });

  // PETITIONS CLERK

  it('Returns internal messages for a Petitions Clerk in My Messages Inbox', () => {
    const filtered = workQueueInbox.filter(
      filterWorkItems({ ...MY_MESSAGES_INBOX, user: petitionsClerk1 }),
    );

    expect(filtered.length).toEqual(1);
    expect(filtered[0].docketNumber).toEqual(
      workItemPetitionsMyMessagesInbox.docketNumber,
    );
  });

  it('Returns sent messages for a Petitions Clerk in My Messages Outbox', () => {
    const completedItemDoNotShow = {
      ...workItemPetitionsMyMessagesSent,
      completedAt: '2019-07-18T18:05:54.166Z',
    };
    const filtered = [...workQueueOutbox, completedItemDoNotShow].filter(
      filterWorkItems({ ...MY_MESSAGES_OUTBOX, user: petitionsClerk1 }),
    );
    expect(filtered.length).toEqual(1);
    expect(filtered[0].docketNumber).toEqual(
      workItemPetitionsMyMessagesSent.docketNumber,
    );
  });

  it('Returns work items for a Petitions Clerk in Section Messages Inbox', () => {
    const user = petitionsClerk1;
    const filtered = workQueueInbox.filter(
      filterWorkItems({ ...SECTION_MESSAGES_INBOX, user }),
    );
    let assigned = null;
    let unassigned = null;

    filtered.forEach(item => {
      if (item.assigneeId === user.userId) {
        assigned = item.docketNumber;
      } else {
        unassigned = item.docketNumber;
      }
    });
    // Two total items in the section queue
    expect(filtered.length).toEqual(2);
    // One item is assigned to user
    expect(assigned).toEqual(workItemPetitionsMyMessagesInbox.docketNumber);
    // One item is assigend to another user
    expect(unassigned).toEqual(
      workItemPetitionsSectionMessagesInbox.docketNumber,
    );
  });

  it('Returns sent work items for a Petitions Clerk in Section Messages Outbox', () => {
    const user = petitionsClerk1;
    const completedItemDoNotShow = {
      ...workItemPetitionsSectionMessagesSent,
      completedAt: '2019-07-18T18:05:54.166Z',
    };
    const filtered = [...workQueueOutbox, completedItemDoNotShow].filter(
      filterWorkItems({ ...SECTION_MESSAGES_OUTBOX, user }),
    );

    let sentByUser = null;
    let sentByOtherUser = null;

    filtered.forEach(item => {
      if (item.sentByUserId === user.userId) {
        sentByUser = item.docketNumber;
      } else {
        sentByOtherUser = item.docketNumber;
      }
    });
    // Two total items in the section queue
    expect(filtered.length).toEqual(2);
    // One item is sent from our user
    expect(sentByUser).toEqual(workItemPetitionsMyMessagesSent.docketNumber);
    // One item is from another user
    expect(sentByOtherUser).toEqual(
      workItemPetitionsSectionMessagesSent.docketNumber,
    );
  });

  it('Returns assigned messages for a Petitions Clerk in My Document QC Inbox', () => {
    const filtered = workQueueInbox.filter(
      filterWorkItems({ ...MY_DOCUMENT_QC_INBOX, user: petitionsClerk1 }),
    );
    expect(filtered.length).toEqual(1);
  });

  it('Returns batched items for a Petitions Clerk in My Document QC Batched', () => {
    const filtered = workQueueBatched.filter(
      filterWorkItems({ ...MY_DOCUMENT_QC_BATCHED, user: petitionsClerk1 }),
    );

    expect(filtered.length).toEqual(1);
    expect(filtered[0].docketNumber).toEqual(
      workItemPetitionsMyDocumentQCBatched.docketNumber,
    );
  });

  it('Returns sent messages for a Petitions Clerk in My Document QC Outbox', () => {
    const filtered = workQueueOutbox.filter(
      filterWorkItems({ ...MY_DOCUMENT_QC_OUTBOX, user: petitionsClerk1 }),
    );

    expect(filtered.length).toEqual(1);
    expect(filtered[0].docketNumber).toEqual(
      workItemPetitionsMyDocumentQCServed.docketNumber,
    );
  });

  it('Returns section work items for a Petitions Clerk in Section Document QC Inbox', () => {
    const user = petitionsClerk1;
    const filtered = workQueueInbox.filter(
      filterWorkItems({ ...SECTION_DOCUMENT_QC_INBOX, user }),
    );
    let assigned = null;
    let unassigned = null;

    filtered.forEach(item => {
      if (item.assigneeId === user.userId) {
        assigned = item.docketNumber;
      } else {
        unassigned = item.docketNumber;
      }
    });
    // Two total items in the section queue
    expect(filtered.length).toEqual(2);
    // One item is assigned to user
    expect(assigned).toEqual(workItemPetitionsMyDocumentQCInbox.docketNumber);
    // One item is assigend to another user
    expect(unassigned).toEqual(
      workItemPetitionsSectionDocumentQCInbox.docketNumber,
    );
  });

  it('Returns batched work items for a Petitions Clerk in Section Document QC Batched', () => {
    const user = petitionsClerk1;
    const filtered = workQueueBatched.filter(
      filterWorkItems({ ...SECTION_DOCUMENT_QC_BATCHED, user }),
    );
    let sentByUser = null;
    let sentByOtherUser = null;

    filtered.forEach(item => {
      if (item.sentByUserId === user.userId) {
        sentByUser = item.docketNumber;
      } else {
        sentByOtherUser = item.docketNumber;
      }
    });

    // Two total items in the section queue
    expect(filtered.length).toEqual(2);
    // One item is sent from our user
    expect(sentByUser).toEqual(
      workItemPetitionsMyDocumentQCBatched.docketNumber,
    );
    // One item is sent from another user
    expect(sentByOtherUser).toEqual(
      workItemPetitionsSectionDocumentQCBatched.docketNumber,
    );
  });

  it('Returns sent work items for a Petitions Clerk in Section Document QC Outbox', () => {
    const user = petitionsClerk1;
    const filtered = workQueueOutbox.filter(
      filterWorkItems({ ...SECTION_DOCUMENT_QC_OUTBOX, user }),
    );
    let sentByUser = null;
    let sentByOtherUser = null;

    filtered.forEach(item => {
      if (item.sentByUserId === user.userId) {
        sentByUser = item.docketNumber;
      } else {
        sentByOtherUser = item.docketNumber;
      }
    });

    // Two total items in the section queue
    expect(filtered.length).toEqual(2);
    // One item is sent from our user
    expect(sentByUser).toEqual(
      workItemPetitionsMyDocumentQCServed.docketNumber,
    );
    // One item is from another user
    expect(sentByOtherUser).toEqual(
      workItemPetitionsSectionDocumentQCServed.docketNumber,
    );
  });

  // DOCKET CLERK

  it('Returns internal messages for a Docket Clerk in My Messages Inbox', () => {
    const filtered = workQueueInbox.filter(
      filterWorkItems({ ...MY_MESSAGES_INBOX, user: docketClerk1 }),
    );
    expect(filtered.length).toEqual(1);
  });

  it('Returns sent messages for a Docket Clerk in My Messages Outbox', () => {
    const filtered = workQueueOutbox.filter(
      filterWorkItems({ ...MY_MESSAGES_OUTBOX, user: docketClerk1 }),
    );
    expect(filtered.length).toEqual(1);
  });

  it('Returns work items for a Docket Clerk in Section Messages Inbox', () => {
    const user = docketClerk1;
    const filtered = workQueueInbox.filter(
      filterWorkItems({ ...SECTION_MESSAGES_INBOX, user }),
    );
    let assigned = null;
    let unassigned = null;

    filtered.forEach(item => {
      if (item.assigneeId === user.userId) {
        assigned = item.docketNumber;
      } else {
        unassigned = item.docketNumber;
      }
    });
    // Two total items in the section queue
    expect(filtered.length).toEqual(2);
    // One item is assigned to user
    expect(assigned).toEqual(workItemDocketMyMessagesInbox.docketNumber);
    // One item is assigend to another user
    expect(unassigned).toEqual(workItemDocketSectionMessagesInbox.docketNumber);
  });

  it('Returns sent work items for a Docket Clerk in Section Messages Outbox', () => {
    const user = docketClerk1;
    const filtered = workQueueOutbox.filter(
      filterWorkItems({ ...SECTION_MESSAGES_OUTBOX, user }),
    );
    let sentByUser = null;
    let sentByOtherUser = null;

    filtered.forEach(item => {
      if (item.sentByUserId === user.userId) {
        sentByUser = item.docketNumber;
      } else {
        sentByOtherUser = item.docketNumber;
      }
    });

    // Two total items in the section queue
    expect(filtered.length).toEqual(2);
    // One item is from our user
    expect(sentByUser).toEqual(workItemDocketMyMessagesSent.docketNumber);
    // One item is from another user
    expect(sentByOtherUser).toEqual(
      workItemDocketSectionMessagesSent.docketNumber,
    );
  });

  it('Returns assigned messages for a Docket Clerk in My Document QC Inbox', () => {
    const filtered = workQueueInbox.filter(
      filterWorkItems({ ...MY_DOCUMENT_QC_INBOX, user: docketClerk1 }),
    );
    expect(filtered.length).toEqual(1);
  });

  it('Returns section work items for a Docket Clerk in Section Document QC Inbox', () => {
    const user = docketClerk1;
    const filtered = workQueueInbox.filter(
      filterWorkItems({ ...SECTION_DOCUMENT_QC_INBOX, user }),
    );
    let assigned = null;
    let unassigned = null;

    filtered.forEach(item => {
      if (item.assigneeId === user.userId) {
        assigned = item.docketNumber;
      } else {
        unassigned = item.docketNumber;
      }
    });
    // Two total items in the section queue
    expect(filtered.length).toEqual(2);
    // One item is assigned to user
    expect(assigned).toEqual(workItemDocketMyDocumentQCInbox.docketNumber);
    // One item is assigend to another user
    expect(unassigned).toEqual(
      workItemDocketSectionDocumentQCInbox.docketNumber,
    );
  });

  it('Returns docket section work items for a Senior Attorney in Document QC Inbox', () => {
    const user = seniorAttorney;
    const filtered = workQueueInbox.filter(
      filterWorkItems({ ...SECTION_DOCUMENT_QC_INBOX, user }),
    );

    expect(filtered).toMatchObject([
      workItemDocketMyDocumentQCInbox,
      workItemDocketSectionDocumentQCInbox,
    ]);
  });
});
