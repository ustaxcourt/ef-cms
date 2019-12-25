import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { IRS_BATCH_SYSTEM_SECTION } from '../../../../shared/src/business/entities/WorkQueue';
import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { cloneDeep } from 'lodash';
import {
  formattedWorkQueue as formattedWorkQueueComputed,
  getWorkItemDocumentLink,
} from './formattedWorkQueue';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

let globalUser;

applicationContext.getCurrentUser = () => {
  return globalUser;
};

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed, {
  ...applicationContext,
});

const petitionsClerkUser = {
  role: User.ROLES.petitionsClerk,
  section: 'petitions',
  userId: 'abc',
};

const docketClerkUser = {
  role: User.ROLES.docketClerk,
  section: 'docket',
  userId: 'abc',
};

const getBaseState = user => {
  globalUser = user;
  return {
    permissions: getUserPermissions(user),
  };
};

const FORMATTED_WORK_ITEM = {
  assigneeId: 'abc',
  assigneeName: 'Unassigned',
  caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
  caseStatus: Case.STATUS_TYPES.generalDocket,
  createdAtFormatted: '12/27/18',
  currentMessage: {
    createdAtFormatted: '12/27/18',
    from: 'Test Respondent',
    fromUserId: 'respondent',
    message: 'Answer filed by respondent is ready for review',
    messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
    to: 'Unassigned',
  },
  docketNumber: '101-18',
  document: {
    attachments: true,
    documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
    documentType: 'Answer',
  },
  historyMessages: [
    {
      createdAtFormatted: '12/27/18',
      from: 'Test Docketclerk',
      fromUserId: 'docketclerk',
      message: 'a message',
      messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      to: 'Unassigned',
    },
  ],
  isCourtIssuedDocument: false,
  messages: [
    {
      createdAtFormatted: '12/27/18',
      from: 'Test Respondent',
      fromUserId: 'respondent',
      message: 'Answer filed by respondent is ready for review',
      messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      to: 'Unassigned',
    },
    {
      createdAtFormatted: '12/27/18',
      from: 'Test Docketclerk',
      fromUserId: 'docketclerk',
      message: 'a message',
      messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      to: 'Unassigned',
    },
  ],
  section: 'petitions',
  selected: true,
  sentBy: 'respondent',
  showComplete: true,
  showSendTo: true,
  workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
};

describe('formatted work queue computed', () => {
  const workItem = {
    assigneeId: 'abc',
    assigneeName: null,
    caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    caseStatus: Case.STATUS_TYPES.generalDocket,
    createdAt: '2018-12-27T18:05:54.166Z',
    docketNumber: '101-18',
    document: {
      attachments: true,
      createdAt: '2018-12-27T18:05:54.164Z',
      documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
      documentType: 'Answer',
    },
    isQC: false, // not in QC state - should not show in QC boxes
    messages: [
      {
        createdAt: '2018-12-27T18:05:54.164Z',
        from: 'Test Respondent',
        fromUserId: 'respondent',
        message: 'Answer filed by respondent is ready for review',
        messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      },
      {
        createdAt: '2018-12-27T18:05:54.164Z',
        from: 'Test Docketclerk',
        fromUserId: 'docketclerk',
        message: 'a message',
        messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      },
    ],
    section: 'petitions',
    sentBy: 'respondent',
    updatedAt: '2018-12-27T18:05:54.164Z',
    workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
  };
  const qcWorkItem = {
    ...workItem,
    isQC: true, // in QC state - should show in QC boxes
    section: 'docket',
  };

  it('formats the workitems for my inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [workItem],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result[0]).toMatchObject(FORMATTED_WORK_ITEM);
  });

  it('formats the workitems for section inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [workItem],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result[0]).toMatchObject(FORMATTED_WORK_ITEM);
  });

  it('should set isCourtIssuedDocument to true for a court-issued document in the selected work item', () => {
    const workItemCopy = cloneDeep(workItem);
    workItemCopy.document.documentType = 'O - Order';
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [workItemCopy],
        workQueue: [workItemCopy],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result2[0].isCourtIssuedDocument).toEqual(true);
  });

  it('adds a currentMessage', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [workItem],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result[0].currentMessage.messageId).toEqual(
      '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
    );
  });

  it('adds a historyMessages array without the current message', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [workItem],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result[0].historyMessages.length).toEqual(1);
    expect(result[0].historyMessages[0].messageId).toEqual(
      '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
    );
  });

  it('sets showSendTo and showComplete to false when isInitializeCase is true', () => {
    workItem.isInitializeCase = true;
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result2[0].showSendTo).toBeFalsy();
    expect(result2[0].showComplete).toBeFalsy();
  });
  it('sets showBatchedStatusIcon to false when caseStatus is NOT batchedForIRS', () => {
    // workItem.caseStatus is generalDocket
    workItem.isInitializeCase = true;
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result2[0].showBatchedStatusIcon).toBeFalsy();
  });
  it('sets showBatchedStatusIcon to true when caseStatus is batchedForIRS', () => {
    workItem.isInitializeCase = true;
    workItem.caseStatus = Case.STATUS_TYPES.batchedForIRS;
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result2[0].showBatchedStatusIcon).toBeTruthy();
  });

  it('sets showBatchedStatusIcon to recalled', () => {
    workItem.isInitializeCase = true;
    workItem.caseStatus = Case.STATUS_TYPES.recalled;
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result2[0].showRecalledStatusIcon).toBeTruthy();
    expect(result2[0].showUnreadIndicators).toEqual(true);
  });

  it('filters the workitems for section QC inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [qcWorkItem],
        workQueue: [qcWorkItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  it('filters the workitems for my QC inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [qcWorkItem],
        workQueue: [qcWorkItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  it('filters the workitems for section QC in progress', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [{ ...qcWorkItem, inProgress: true }],
        workQueue: [{ ...qcWorkItem, inProgress: true }],
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  it('filters the workitems for my QC in progress', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [{ ...qcWorkItem, inProgress: true }],
        workQueue: [{ ...qcWorkItem, inProgress: true }],
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  it('filters the workitems for section batched', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [
          {
            ...qcWorkItem,
            caseStatus: Case.STATUS_TYPES.batchedForIRS,
            section: IRS_BATCH_SYSTEM_SECTION,
          },
        ],
        workQueue: [
          {
            ...qcWorkItem,
            caseStatus: Case.STATUS_TYPES.batchedForIRS,
            section: IRS_BATCH_SYSTEM_SECTION,
          },
        ],
        workQueueToDisplay: {
          box: 'batched',
          queue: 'section',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      caseStatus: Case.STATUS_TYPES.batchedForIRS,
      section: IRS_BATCH_SYSTEM_SECTION,
    });
  });

  it('filters the workitems for my batched', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [
          {
            ...qcWorkItem,
            caseStatus: Case.STATUS_TYPES.batchedForIRS,
            section: IRS_BATCH_SYSTEM_SECTION,
            sentByUserId: petitionsClerkUser.userId,
          },
        ],
        workQueue: [
          {
            ...qcWorkItem,
            caseStatus: Case.STATUS_TYPES.batchedForIRS,
            section: IRS_BATCH_SYSTEM_SECTION,
            sentByUserId: petitionsClerkUser.userId,
          },
        ],
        workQueueToDisplay: {
          box: 'batched',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      caseStatus: Case.STATUS_TYPES.batchedForIRS,
      section: IRS_BATCH_SYSTEM_SECTION,
    });
  });

  it('should not show a workItem in user messages outbox if it is completed', () => {
    workItem.completedAt = '2019-06-17T15:27:55.801Z';

    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result).toEqual([]);
  });

  it('should not show a workItem in section messages outbox if it is completed', () => {
    workItem.completedAt = '2019-06-17T15:27:55.801Z';

    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'section',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result).toEqual([]);
  });

  it('filters the workitems for section QC outbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [
          { ...qcWorkItem, completedAt: '2019-06-17T15:27:55.801Z' },
        ],
        workQueue: [{ ...qcWorkItem, completedAt: '2019-06-17T15:27:55.801Z' }],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  it('filters the workitems for my QC outbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [
          {
            ...qcWorkItem,
            completedAt: '2019-06-17T15:27:55.801Z',
            completedByUserId: docketClerkUser.userId,
          },
        ],
        workQueue: [
          {
            ...qcWorkItem,
            completedAt: '2019-06-17T15:27:55.801Z',
            completedByUserId: docketClerkUser.userId,
          },
        ],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  describe('getWorkItemDocumentLink', () => {
    const baseWorkItem = {
      assigneeId: null,
      assigneeName: null,
      caseId: 'fa73b4ed-4b3d-43b3-b704-8b2af5bdecc1',
      caseStatus: 'New',
      caseTitle: 'Ori Petersen',
      createdAt: '2019-12-16T16:48:02.889Z',
      docketNumber: '114-19',
      docketNumberSuffix: 'S',
      sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
      updatedAt: '2019-12-16T16:48:02.889Z',
      workItemId: '36f228c6-0ae5-4adf-aa44-35905b7fc8bd',
    };
    const baseDocument = {
      createdAt: '2019-12-16T16:48:02.888Z',
      documentId: '6db35185-2445-4952-9449-5479a5cadab0',
      filedBy: 'Petr. Ori Petersen',
      partyPrimary: true,
      partySecondary: false,
      processingStatus: 'complete',
      receivedAt: '2019-12-16T16:48:02.888Z',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    };
    const baseMessage = {
      createdAt: '2019-12-16T16:48:02.889Z',
      from: 'Test Petitioner',
      fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'Petition filed by Ori Petersen is ready for review.',
      messageId: '9ad0fceb-41be-4902-8294-9f505fb7a353',
    };

    it('should return editLink with a direct link to the message if document is petition and user is petitionsclerk', () => {
      const permissions = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            documentType: 'Petition',
            eventCode: 'P',
            pending: false,
          },
          isInitializeCase: true,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'petitions',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('/messages/9ad0fceb-41be-4902-8294-9f505fb7a353');
    });

    it('should return /edit-court-issued if document is court-issued and not served and user is docketclerk', () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            documentType: 'OAJ - Order that case is assigned',
            eventCode: 'OAJ',
            pending: false,
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'petitions',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('/edit-court-issued');
    });

    it('should return editLink with a direct link to the message if document is court-issued and not served and user is petitionsclerk', () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            documentType: 'OAJ - Order that case is assigned',
            eventCode: 'OAJ',
            pending: false,
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('/messages/9ad0fceb-41be-4902-8294-9f505fb7a353');
    });

    it('should return /complete if document is in progress and user is docketclerk', () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            isFileAttached: false,
            isPaper: true,
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('/complete');
    });

    it('should return default edit link if document is in progress and user is petitionsClerk', () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            isFileAttached: false,
            isPaper: true,
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('');
    });

    it("should return /edit if document is an external doc that has not been qc'd and user is docketclerk", () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('/edit');
    });

    it("should return editLink with a direct link to the message if document is an external doc that has not been qc'd and user is petitionsClerk", () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('/messages/9ad0fceb-41be-4902-8294-9f505fb7a353');
    });

    it('should return editLink with message id to mark as read if the box is my inbox and user is petitionsClerk', () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual(
        '/messages/9ad0fceb-41be-4902-8294-9f505fb7a353/mark/36f228c6-0ae5-4adf-aa44-35905b7fc8bd',
      );
    });

    it('should return editLink as /edit if the box is my inbox and user is docketClerk', () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('/edit');
    });
  });
});
