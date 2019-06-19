import * as CONSTANTS from '../../../../shared/src/business/entities/WorkQueue';
import { filterWorkItems } from './formattedWorkQueue';

const MY_INBOX = {
  workQueueIsInternal: true,
  workQueueToDisplay: { box: 'inbox', queue: 'my' },
};
const MY_BATCHED = {
  workQueueIsInternal: true,
  workQueueToDisplay: { box: 'batched', queue: 'my' },
};
const MY_OUTBOX = {
  workQueueIsInternal: true,
  workQueueToDisplay: { box: 'outbox', queue: 'my' },
};
const SECTION_INBOX = {
  workQueueIsInternal: false,
  workQueueToDisplay: { box: 'inbox', queue: 'section' },
};
const SECTION_BATCHED = {
  workQueueIsInternal: false,
  workQueueToDisplay: { box: 'batched', queue: 'section' },
};
const SECTION_OUTBOX = {
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

// Section Inbox Messages
// - isInternal === true
// - item.section == user role section
// - !item.completedAt

// Section Outbox Messages
// - isInternal === true
// - item.sentBySection === user role section

// My DocumentQC Inbox
// - isInternal === false
// - item.assigneeId == user.userId
// - item.section == user role section
// - !item.completedAt

// My Document QC Batched
// - isInternal === false
// - item.section === 'irsBatchSection'
// - item.sentByUserId === user.userId

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

// Section Document QC Served
// - isInternal = false
// - item.section === 'irsBatchSection'
// - !!item.completedAt

// Section Document QC Processed (Docket)
// - isInternal === false
// - !!item.completedAt
// - item.section === 'docket'

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
  let workItemDocketMyMessagesProcessed;
  let workItemDocketSectionDocumentQCInbox;
  let workItemDocketSectionDocumentQCProcessed;

  let workQueue;

  beforeEach(() => {
    workItemPetitionsMyMessagesInbox = generateWorkItem({
      assigneeId: petitionsClerk1.userId,
      completedAt: null,
      docketNumber: '100-01',
      isInternal: true,
      section: CONSTANTS.PETITIONS_SECTION,
    });

    workItemPetitionsMyMessagesSent = generateWorkItem({
      assigneeId: petitionsClerk1.userId,
      docketNumber: '100-02',
      isInternal: true,
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
      caseStatus: 'Batched for IRS',
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
      caseStatus: 'Batched for IRS',
      docketNumber: '100-09',
      isInternal: false,
      section: CONSTANTS.IRS_BATCH_SYSTEM_SECTION,
    });

    workItemPetitionsSectionDocumentQCServed = generateWorkItem({
      assigneeId: petitionsClerk2.userId,
      caseStatus: 'Calendared',
      completedAt: '2019-07-18T18:05:54.166Z',
      completedByUserId: petitionsClerk1.userId,
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
      section: CONSTANTS.PETITIONS_SECTION,
    });

    workItemDocketMyMessagesSent = generateWorkItem({
      assigneeId: docketClerk1.userId,
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

    workItemDocketMyMessagesProcessed = generateWorkItem({
      assigneeId: docketClerk1.userId,
      completedByUserId: docketClerk1.userId,
      docketNumber: '100-16',
      isInternal: true,
      section: CONSTANTS.DOCKET_SECTION,
    });

    workItemDocketSectionDocumentQCInbox = generateWorkItem({
      completedAt: null,
      docketNumber: '100-17',
      isInternal: false,
      section: CONSTANTS.DOCKET_SECTION,
    });

    workItemDocketSectionDocumentQCProcessed = generateWorkItem({
      completedAt: '2019-07-18T18:05:54.166Z',
      docketNumber: '100-18',
      isInternal: false,
      section: CONSTANTS.DOCKET_SECTION,
    });

    workQueue = [
      workItemPetitionsMyMessagesInbox,
      workItemPetitionsMyMessagesSent,
      workItemPetitionsSectionMessagesInbox,
      workItemPetitionsSectionMessagesSent,
      workItemPetitionsMyDocumentQCInbox,
      workItemPetitionsMyDocumentQCBatched,
      workItemPetitionsMyDocumentQCServed,
      workItemPetitionsSectionDocumentQCInbox,
      workItemPetitionsSectionDocumentQCBatched,
      workItemPetitionsSectionDocumentQCServed,
      workItemDocketMyMessagesInbox,
      workItemDocketMyMessagesSent,
      workItemDocketSectionMessagesInbox,
      workItemDocketSectionMessagesSent,
      workItemDocketMyDocumentQCInbox,
      workItemDocketMyMessagesProcessed,
      workItemDocketSectionDocumentQCInbox,
      workItemDocketSectionDocumentQCProcessed,
    ];
  });

  it('Returns internal messages for a user in My Inbox', async () => {
    const filtered = workQueue.filter(
      filterWorkItems({ ...MY_INBOX, user: petitionsClerk1 }),
    );
    console.log(filtered);
    expect(filtered.length).toEqual(1);
  });

  it('Returns sent messages for a user in My Outbox', async () => {});
  it('Returns assigned work items for a user in My Document QC', async () => {});
  it('Returns batched work items for Batched for IRS', async () => {});
  it('Returns work items that were previously batched after running IRS Batch Process (Served)', async () => {});
});
