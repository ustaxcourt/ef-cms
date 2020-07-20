import {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  IRS_SYSTEM_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { filterWorkItems } from './formattedWorkQueue';

const MY_MESSAGES_INBOX = {
  workQueueToDisplay: { box: 'inbox', queue: 'my', workQueueIsInternal: true },
};
const MY_MESSAGES_OUTBOX = {
  workQueueToDisplay: { box: 'outbox', queue: 'my', workQueueIsInternal: true },
};

const SECTION_MESSAGES_INBOX = {
  workQueueToDisplay: {
    box: 'inbox',
    queue: 'section',
    workQueueIsInternal: true,
  },
};

const SECTION_MESSAGES_OUTBOX = {
  workQueueToDisplay: {
    box: 'outbox',
    queue: 'section',
    workQueueIsInternal: true,
  },
};

const MY_DOCUMENT_QC_INBOX = {
  workQueueToDisplay: { box: 'inbox', queue: 'my', workQueueIsInternal: false },
};

const MY_DOCUMENT_QC_IN_PROGRESS = {
  workQueueToDisplay: {
    box: 'inProgress',
    queue: 'my',
    workQueueIsInternal: false,
  },
};

const MY_DOCUMENT_QC_OUTBOX = {
  workQueueToDisplay: {
    box: 'outbox',
    queue: 'my',
    workQueueIsInternal: false,
  },
};

const SECTION_DOCUMENT_QC_INBOX = {
  workQueueToDisplay: {
    box: 'inbox',
    queue: 'section',
    workQueueIsInternal: false,
  },
};

const SECTION_DOCUMENT_QC_IN_PROGRESS = {
  workQueueToDisplay: {
    box: 'inProgress',
    queue: 'section',
    workQueueIsInternal: false,
  },
};

const SECTION_DOCUMENT_QC_OUTBOX = {
  workQueueToDisplay: {
    box: 'outbox',
    queue: 'section',
    workQueueIsInternal: false,
  },
};

const petitionsClerk1 = {
  role: ROLES.petitionsClerk,
  section: 'petitions',
  userId: 'p1',
};

const petitionsClerk2 = {
  role: ROLES.petitionsClerk,
  section: 'petitions',
  userId: 'p2',
};

const docketClerk1 = {
  role: ROLES.docketClerk,
  section: 'docket',
  userId: 'd1',
};

const docketClerk2 = {
  role: ROLES.docketClerk,
  section: 'docket',
  userId: 'd2',
};

const adc = {
  role: ROLES.adc,
  section: 'adc',
  userId: 'd3',
};

const generateWorkItem = (data, document) => {
  const baseWorkItem = {
    assigneeId: null,
    assigneeName: null,
    caseId: '123',
    caseStatus: CASE_STATUS_TYPES.new,
    createdAt: '2018-12-27T18:05:54.166Z',
    docketNumber: '100-01',
    document: {
      createdAt: '2018-12-27T18:05:54.164Z',
      documentId: '456',
      documentType: 'Answer',
      ...document,
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

// Section Document QC Served
// - isInternal = false
// - item.section === 'irsBatchSection'
// - !!item.completedAt

// Section Document QC Processed (Docket)
// - isInternal === false
// - !!item.completedAt
// - item.section === 'docket'

// ADC Document QC Inbox
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
  let workItemPetitionsMyDocumentQCServed;
  let workItemPetitionsSectionDocumentQCInbox;
  let workItemPetitionsSectionDocumentQCServed;
  // Docket
  let workItemDocketMyMessagesInbox;
  let workItemDocketMyMessagesSent;
  let workItemDocketSectionMessagesInbox;
  let workItemDocketSectionMessagesSent;
  let workItemDocketMyDocumentQCInbox;
  let workItemDocketSectionDocumentQCInbox;
  let workItemDocketMyDocumentQCInProgress;
  let workItemDocketSectionDocumentQCInProgress;

  let workQueueInbox;
  let workQueueInProgress;
  let workQueueOutbox;

  beforeAll(() => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.docketClerk,
      userId: '7f87f5d1-dfce-4515-a1e4-5231ceac61bb',
    });

    workItemPetitionsMyMessagesInbox = generateWorkItem({
      assigneeId: petitionsClerk1.userId,
      completedAt: null,
      docketNumber: '100-01',
      isQC: false,
      section: PETITIONS_SECTION,
    });

    workItemPetitionsMyMessagesSent = generateWorkItem({
      assigneeId: petitionsClerk2.userId,
      docketNumber: '100-02',
      isQC: false,
      section: PETITIONS_SECTION,
      sentBySection: PETITIONS_SECTION,
      sentByUserId: petitionsClerk1.userId,
    });

    workItemPetitionsSectionMessagesInbox = generateWorkItem({
      completedAt: null,
      docketNumber: '100-03',
      isQC: false,
      section: PETITIONS_SECTION,
    });

    workItemPetitionsSectionMessagesSent = generateWorkItem({
      docketNumber: '100-04',
      isQC: false,
      sentBySection: PETITIONS_SECTION,
      sentByUserId: petitionsClerk2.userId,
    });

    workItemPetitionsMyDocumentQCInbox = generateWorkItem({
      assigneeId: petitionsClerk1.userId,
      docketNumber: '100-05',
      isQC: true,
      section: PETITIONS_SECTION,
    });

    workItemPetitionsMyDocumentQCServed = generateWorkItem({
      assigneeId: petitionsClerk1.userId,
      caseStatus: CASE_STATUS_TYPES.calendared,
      completedAt: '2019-07-18T18:05:54.166Z',
      completedByUserId: petitionsClerk1.userId,
      docketNumber: '100-07',
      isQC: true,
      section: IRS_SYSTEM_SECTION,
      sentByUserId: petitionsClerk1.userId,
    });

    workItemPetitionsSectionDocumentQCInbox = generateWorkItem({
      completedAt: null,
      docketNumber: '100-08',
      isQC: true,
      section: PETITIONS_SECTION,
    });

    workItemPetitionsSectionDocumentQCServed = generateWorkItem({
      assigneeId: petitionsClerk2.userId,
      caseStatus: CASE_STATUS_TYPES.calendared,
      completedAt: '2019-07-18T18:05:54.166Z',
      completedByUserId: petitionsClerk2.userId,
      docketNumber: '100-10',
      isQC: true,
      section: IRS_SYSTEM_SECTION,
      sentByUserId: petitionsClerk2.userId,
    });

    workItemDocketMyMessagesInbox = generateWorkItem({
      assigneeId: docketClerk1.userId,
      completedAt: null,
      docketNumber: '100-11',
      isQC: false,
      section: DOCKET_SECTION,
    });

    workItemDocketMyMessagesSent = generateWorkItem({
      assigneeId: docketClerk2.userId,
      docketNumber: '100-12',
      isQC: false,
      sentBySection: DOCKET_SECTION,
      sentByUserId: docketClerk1.userId,
    });

    workItemDocketSectionMessagesInbox = generateWorkItem({
      completedAt: null,
      docketNumber: '100-13',
      isQC: false,
      section: DOCKET_SECTION,
    });

    workItemDocketSectionMessagesSent = generateWorkItem({
      docketNumber: '100-14',
      isQC: false,
      sentBySection: DOCKET_SECTION,
      sentByUserId: docketClerk2.userId,
    });

    workItemDocketMyDocumentQCInbox = generateWorkItem({
      assigneeId: docketClerk1.userId,
      completedAt: null,
      docketNumber: '100-15',
      isQC: true,
      section: DOCKET_SECTION,
    });

    workItemDocketSectionDocumentQCInbox = generateWorkItem({
      completedAt: null,
      docketNumber: '100-17',
      isQC: true,
      section: DOCKET_SECTION,
    });

    workItemDocketMyDocumentQCInProgress = generateWorkItem(
      {
        assigneeId: docketClerk1.userId,
        completedAt: null,
        docketNumber: '100-18',
        isQC: true,
        section: DOCKET_SECTION,
      },
      {
        isFileAttached: false,
      },
    );

    workItemDocketSectionDocumentQCInProgress = generateWorkItem(
      {
        assigneeId: docketClerk2.userId,
        completedAt: null,
        docketNumber: '100-19',
        isQC: true,
        section: DOCKET_SECTION,
      },
      {
        isFileAttached: false,
      },
    );

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

    workQueueInProgress = [
      workItemPetitionsMyMessagesInbox,
      workItemPetitionsMyMessagesSent,
      workItemDocketMyDocumentQCInProgress,
      workItemDocketSectionDocumentQCInProgress,
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
      filterWorkItems({
        applicationContext,
        ...MY_MESSAGES_INBOX,
        user: petitionsClerk1,
      }),
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
      filterWorkItems({
        applicationContext,
        ...MY_MESSAGES_OUTBOX,
        user: petitionsClerk1,
      }),
    );
    expect(filtered.length).toEqual(1);
    expect(filtered[0].docketNumber).toEqual(
      workItemPetitionsMyMessagesSent.docketNumber,
    );
  });

  it('Returns work items for a Petitions Clerk in Section Messages Inbox', () => {
    const user = petitionsClerk1;
    const filtered = workQueueInbox.filter(
      filterWorkItems({ applicationContext, ...SECTION_MESSAGES_INBOX, user }),
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
    // One item is assigned to another user
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
      filterWorkItems({ applicationContext, ...SECTION_MESSAGES_OUTBOX, user }),
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
      filterWorkItems({
        applicationContext,
        ...MY_DOCUMENT_QC_INBOX,
        user: petitionsClerk1,
      }),
    );
    expect(filtered.length).toEqual(1);
  });

  it('Returns sent messages for a Petitions Clerk in My Document QC Outbox', () => {
    const filtered = workQueueOutbox.filter(
      filterWorkItems({
        USER_ROLES: ROLES,
        applicationContext,
        ...MY_DOCUMENT_QC_OUTBOX,
        user: petitionsClerk1,
      }),
    );

    expect(filtered.length).toEqual(1);
    expect(filtered[0].docketNumber).toEqual(
      workItemPetitionsMyDocumentQCServed.docketNumber,
    );
  });

  it('Returns section work items for a Petitions Clerk in Section Document QC Inbox', () => {
    const user = petitionsClerk1;
    const filtered = workQueueInbox.filter(
      filterWorkItems({
        applicationContext,
        ...SECTION_DOCUMENT_QC_INBOX,
        user,
      }),
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
    // One item is assigned to another user
    expect(unassigned).toEqual(
      workItemPetitionsSectionDocumentQCInbox.docketNumber,
    );
  });

  it('Returns sent work items for a Petitions Clerk in Section Document QC Outbox', () => {
    const user = petitionsClerk1;
    const filtered = workQueueOutbox.filter(
      filterWorkItems({
        USER_ROLES: ROLES,
        applicationContext,
        ...SECTION_DOCUMENT_QC_OUTBOX,
        user,
      }),
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
      filterWorkItems({
        applicationContext,
        ...MY_MESSAGES_INBOX,
        user: docketClerk1,
      }),
    );
    expect(filtered.length).toEqual(1);
  });

  it('Returns sent messages for a Docket Clerk in My Messages Outbox', () => {
    const filtered = workQueueOutbox.filter(
      filterWorkItems({
        applicationContext,
        ...MY_MESSAGES_OUTBOX,
        user: docketClerk1,
      }),
    );
    expect(filtered.length).toEqual(1);
  });

  it('Returns work items for a Docket Clerk in Section Messages Inbox', () => {
    const user = docketClerk1;
    const filtered = workQueueInbox.filter(
      filterWorkItems({ applicationContext, ...SECTION_MESSAGES_INBOX, user }),
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
    // One item is assigned to another user
    expect(unassigned).toEqual(workItemDocketSectionMessagesInbox.docketNumber);
  });

  it('Returns sent work items for a Docket Clerk in Section Messages Outbox', () => {
    const user = docketClerk1;
    const filtered = workQueueOutbox.filter(
      filterWorkItems({ applicationContext, ...SECTION_MESSAGES_OUTBOX, user }),
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
      filterWorkItems({
        applicationContext,
        ...MY_DOCUMENT_QC_INBOX,
        user: docketClerk1,
      }),
    );
    expect(filtered.length).toEqual(1);
  });

  it('Returns section work items for a Docket Clerk in Section Document QC Inbox', () => {
    const user = docketClerk1;
    const filtered = workQueueInbox.filter(
      filterWorkItems({
        applicationContext,
        ...SECTION_DOCUMENT_QC_INBOX,
        user,
      }),
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
    // One item is assigned to another user
    expect(unassigned).toEqual(
      workItemDocketSectionDocumentQCInbox.docketNumber,
    );
  });

  it('Returns docket section work items for an ADC in Document QC Inbox', () => {
    const user = adc;
    const filtered = workQueueInbox.filter(
      filterWorkItems({
        applicationContext,
        ...SECTION_DOCUMENT_QC_INBOX,
        user,
      }),
    );

    expect(filtered).toMatchObject([
      workItemDocketMyDocumentQCInbox,
      workItemDocketSectionDocumentQCInbox,
    ]);
  });

  it('Returns docket section work items for a Docket Clerk in My Document QC In Progress', () => {
    const user = docketClerk1;
    const filtered = workQueueInProgress.filter(
      filterWorkItems({
        applicationContext,
        ...MY_DOCUMENT_QC_IN_PROGRESS,
        user,
      }),
    );

    expect(filtered).toEqual([workItemDocketMyDocumentQCInProgress]);
  });

  it('Returns docket section work items for a Docket Clerk in Section Document QC In Progress', () => {
    const user = docketClerk1;
    const filtered = workQueueInProgress.filter(
      filterWorkItems({
        applicationContext,
        ...SECTION_DOCUMENT_QC_IN_PROGRESS,
        user,
      }),
    );

    expect(filtered).toEqual([
      workItemDocketMyDocumentQCInProgress,
      workItemDocketSectionDocumentQCInProgress,
    ]);
  });
});
