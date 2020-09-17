import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  formatDateIfToday,
  formatWorkItem,
  formattedWorkQueue as formattedWorkQueueComputed,
  getWorkItemDocumentLink,
} from './formattedWorkQueue';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('formatted work queue computed', () => {
  let globalUser;
  let getBaseState;
  let formattedWorkQueue;

  const {
    CHIEF_JUDGE,
    DOCKET_NUMBER_SUFFIXES,
    DOCKET_SECTION,
    DOCUMENT_RELATIONSHIPS,
    PETITIONS_SECTION,
    SESSION_STATUS_GROUPS,
    STATUS_TYPES,
    USER_ROLES,
  } = applicationContext.getConstants();

  const petitionsClerkUser = {
    role: USER_ROLES.petitionsClerk,
    section: PETITIONS_SECTION,
    userId: 'abc',
  };

  const docketClerkUser = {
    role: USER_ROLES.docketClerk,
    section: DOCKET_SECTION,
    userId: 'abc',
  };

  const WORK_ITEM_ID_1 = '06f09800-2f9c-4040-b133-10966fbf6179';
  const WORK_ITEM_ID_2 = '00557601-2dab-44bc-a5cf-7d1a115bd08d';
  const WORK_ITEM_ID_3 = 'a066204a-6c86-499e-9d98-b45a8f7bf86f';
  const WORK_ITEM_ID_4 = '4bd51fb7-fc46-4d4d-a506-08d48afcf46d';
  const JUDGE_USER_ID_1 = '89c956aa-65c6-4632-a6c8-7f0c6162d615';

  const FORMATTED_WORK_ITEM = {
    assigneeId: 'abc',
    assigneeName: 'Unassigned',
    caseStatus: STATUS_TYPES.generalDocket,
    createdAtFormatted: '12/27/18',
    docketEntry: {
      attachments: true,
      docketEntryId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
      documentType: 'Answer',
    },
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    docketNumberWithSuffix: '101-18S',
    isCourtIssuedDocument: false,
    section: PETITIONS_SECTION,
    selected: true,
    sentBy: 'respondent',
    showComplete: true,
    showSendTo: true,
    workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
  };

  beforeAll(() => {
    applicationContext.getCurrentUser = () => {
      return globalUser;
    };

    getBaseState = user => {
      globalUser = user;
      return {
        permissions: getUserPermissions(user),
      };
    };

    applicationContext
      .getUtilities()
      .filterQcItemsByAssociatedJudge.mockReturnValue(() => true);

    formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed, {
      ...applicationContext,
    });
  });

  const workItem = {
    assigneeId: 'abc',
    assigneeName: null,
    caseStatus: STATUS_TYPES.generalDocket,
    createdAt: '2018-12-27T18:05:54.166Z',
    docketEntry: {
      attachments: true,
      createdAt: '2018-12-27T18:05:54.164Z',
      docketEntryId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
      documentType: 'Answer',
    },
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    docketNumberWithSuffix: '101-18S',
    section: PETITIONS_SECTION,
    sentBy: 'respondent',
    updatedAt: '2018-12-27T18:05:54.164Z',
    workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
  };
  const qcWorkItem = {
    ...workItem,
    section: DOCKET_SECTION,
  };

  it('filters the workitems for section QC inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [qcWorkItem],
        workQueue: [qcWorkItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: DOCKET_SECTION,
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
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: DOCKET_SECTION,
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
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: DOCKET_SECTION,
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
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: DOCKET_SECTION,
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
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: DOCKET_SECTION,
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
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: DOCKET_SECTION,
    });
  });

  it('filters items based on associatedJudge for a given judge or chambers user', () => {
    const judgeUser = {
      name: 'Test Judge',
      role: USER_ROLES.judge,
      userId: JUDGE_USER_ID_1,
    };

    applicationContext
      .getUtilities()
      .filterQcItemsByAssociatedJudge.mockReturnValue(
        item => item.associatedJudge && item.associatedJudge === judgeUser.name,
      );

    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(judgeUser),
        judgeUser,
        workQueue: [
          {
            ...qcWorkItem,
            workItemId: WORK_ITEM_ID_1,
          },
          {
            ...qcWorkItem,
            associatedJudge: judgeUser.name,
            workItemId: WORK_ITEM_ID_2,
          },
          {
            ...qcWorkItem,
            associatedJudge: 'Test Judge 2',
            workItemId: WORK_ITEM_ID_3,
          },
          {
            ...qcWorkItem,
            associatedJudge: CHIEF_JUDGE,
            workItemId: WORK_ITEM_ID_4,
          },
        ],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
        },
      },
    });

    expect(result.length).toEqual(1);
    expect(result[0].workItemId).toEqual(WORK_ITEM_ID_2);
  });

  it('filters items based on associatedJudge for an adc user', () => {
    const adcUser = {
      name: 'Test ADC',
      role: USER_ROLES.adc,
      userId: 'd4d25c47-bb50-4575-9c31-d00bb682a215',
    };

    applicationContext
      .getUtilities()
      .filterQcItemsByAssociatedJudge.mockReturnValue(
        item => !item.associatedJudge || item.associatedJudge === CHIEF_JUDGE,
      );

    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(adcUser),
        workQueue: [
          {
            ...qcWorkItem,
            workItemId: WORK_ITEM_ID_1,
          },
          {
            ...qcWorkItem,
            associatedJudge: 'Test Judge',
            workItemId: WORK_ITEM_ID_2,
          },
          {
            ...qcWorkItem,
            associatedJudge: 'Test Judge 2',
            workItemId: WORK_ITEM_ID_3,
          },
          {
            ...qcWorkItem,
            associatedJudge: CHIEF_JUDGE,
            workItemId: WORK_ITEM_ID_4,
          },
        ],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
        },
      },
    });

    expect(result.length).toEqual(2);
    expect(result[0].workItemId).toEqual(WORK_ITEM_ID_1);
    expect(result[1].workItemId).toEqual(WORK_ITEM_ID_4);
  });

  it('filters items based on in progress cases for a petitionsclerk', () => {
    const petitionsClerkUser = {
      name: 'Test PetitionsClerk',
      role: USER_ROLES.petitionsClerk,
      userId: 'd4d25c47-bb50-4575-9c31-d00bb682a215',
    };

    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        workQueue: [
          {
            ...qcWorkItem,
            workItemId: WORK_ITEM_ID_1,
          },
          {
            ...qcWorkItem,
            associatedJudge: 'Test Judge',
            workItemId: WORK_ITEM_ID_2,
          },
          {
            ...qcWorkItem,
            associatedJudge: 'Test Judge 2',
            workItemId: WORK_ITEM_ID_3,
          },
          {
            ...qcWorkItem,
            associatedJudge: CHIEF_JUDGE,
            caseIsInProgress: true,
            caseStatus: STATUS_TYPES.new,
            docketEntry: {
              ...qcWorkItem.docketEntry,
              status: 'processing',
            },
            workItemId: WORK_ITEM_ID_4,
          },
        ],
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
        },
      },
    });

    expect(result.length).toEqual(1);
    expect(result[0].workItemId).toEqual(WORK_ITEM_ID_4);
  });

  it('sorts high priority work items to the start of the list - qc, my, inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        workQueue: [
          {
            ...qcWorkItem,
            assigneeId: docketClerkUser.userId,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '101-19',
            highPriority: false,
            id: 'c',
            receivedAt: '2019-01-17T15:27:55.801Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '102-19',
            highPriority: true,
            id: 'b',
            receivedAt: '2019-02-17T15:27:55.801Z',
            trialDate: '2019-01-17T00:00:00.000Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '103-19',
            highPriority: true,
            id: 'a',
            receivedAt: '2019-01-17T15:27:55.801Z',
            trialDate: '2019-02-17T00:00:00.000Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '104-19',
            highPriority: false,
            id: 'd',
            receivedAt: '2019-04-17T15:27:55.801Z',
          },
        ],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
        },
      },
    });

    expect(result[0].id).toEqual('b');
    expect(result[1].id).toEqual('a');
    expect(result[2].id).toEqual('c');
    expect(result[3].id).toEqual('d');
  });

  it('sorts high priority work items to the start of the list - qc, my, inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        workQueue: [
          {
            ...qcWorkItem,
            assigneeId: docketClerkUser.userId,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '101-19',
            highPriority: true,
            id: 'c',
            receivedAt: '2019-01-17T15:27:55.801Z',
            trialDate: '2019-02-17T00:00:00.000Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '102-19',
            highPriority: true,
            id: 'b',
            receivedAt: '2019-02-17T15:27:55.801Z',
            trialDate: '2019-02-17T00:00:00.000Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '103-19',
            highPriority: true,
            id: 'a',
            receivedAt: '2019-01-17T15:27:55.801Z',
            trialDate: '2019-01-17T00:00:00.000Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '104-19',
            id: 'd',
            receivedAt: '2019-04-17T15:27:55.801Z',
          },
        ],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
        },
      },
    });

    expect(result[0].id).toEqual('a');
    expect(result[1].id).toEqual('c');
    expect(result[2].id).toEqual('b');
    expect(result[3].id).toEqual('d');
  });

  it('sorts high priority work items to the start of the list - qc, my, inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        workQueue: [
          {
            ...qcWorkItem,
            assigneeId: docketClerkUser.userId,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '101-19',
            id: 'c',
            receivedAt: '2019-01-17T15:27:55.801Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '102-19',
            highPriority: false,
            id: 'b',
            receivedAt: '2019-02-17T15:27:55.801Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '103-19',
            highPriority: false,
            id: 'a',
            receivedAt: '2019-03-17T15:27:55.801Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '104-19',
            id: 'd',
            receivedAt: '2019-04-17T15:27:55.801Z',
          },
        ],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
        },
      },
    });

    expect(result[0].id).toEqual('c');
    expect(result[1].id).toEqual('b');
    expect(result[2].id).toEqual('a');
    expect(result[3].id).toEqual('d');
  });

  describe('getWorkItemDocumentLink', () => {
    const baseWorkItem = {
      assigneeId: null,
      assigneeName: null,
      caseCaption: 'Ori Petersen',
      caseStatus: SESSION_STATUS_GROUPS.new,
      createdAt: '2019-12-16T16:48:02.889Z',
      docketNumber: '114-19',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
      updatedAt: '2019-12-16T16:48:02.889Z',
      workItemId: '36f228c6-0ae5-4adf-aa44-35905b7fc8bd',
    };
    const baseDocument = {
      createdAt: '2019-12-16T16:48:02.888Z',
      docketEntryId: '6db35185-2445-4952-9449-5479a5cadab0',
      filedBy: 'Petr. Ori Petersen',
      partyPrimary: true,
      partySecondary: false,
      processingStatus: 'complete',
      receivedAt: '2019-12-16T16:48:02.888Z',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    };
    const baseWorkItemEditLink =
      '/case-detail/114-19/documents/6db35185-2445-4952-9449-5479a5cadab0';
    const documentViewLink =
      '/case-detail/114-19/document-view?docketEntryId=6db35185-2445-4952-9449-5479a5cadab0';

    it('should return editLink as petition qc page if document is petition, case is not in progress, and user is petitionsclerk viewing a QC box', () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          docketEntry: {
            ...baseDocument,
            documentType: 'Petition',
            eventCode: 'P',
            pending: false,
          },
          isInitializeCase: true,
          section: PETITIONS_SECTION,
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
        },
      });
      expect(result).toEqual('/case-detail/114-19/petition-qc');
    });

    it('should return /edit-court-issued if document is court-issued and not served and user is docketclerk', () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          docketEntry: {
            ...baseDocument,
            documentType: 'Order that case is assigned',
            eventCode: 'OAJ',
            pending: false,
          },
          isInitializeCase: false,
          section: PETITIONS_SECTION,
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
        },
      });
      expect(result).toEqual(`${baseWorkItemEditLink}/edit-court-issued`);
    });

    it('should return editLink as default document detail page if document is court-issued and not served and user is petitionsclerk viewing a QC box', () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          docketEntry: {
            ...baseDocument,
            documentType: 'Order that case is assigned',
            eventCode: 'OAJ',
            pending: false,
          },
          isInitializeCase: false,
          section: DOCKET_SECTION,
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
        },
      });
      expect(result).toEqual(documentViewLink);
    });

    it('should return /complete if work item is in progress and user is docketclerk', () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          docketEntry: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            isFileAttached: false,
            isPaper: true,
            pending: false,
            receivedAt: '2018-01-01',
            relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
            scenario: 'Standard',
          },
          inProgress: true,
          isInitializeCase: false,
          section: DOCKET_SECTION,
        },
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
        },
      });
      expect(result).toEqual(`${baseWorkItemEditLink}/complete`);
    });

    it('should return case detail link if document is processed and user is docketclerk', () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          completedAt: '2019-03-01T21:40:46.415Z',
          docketEntry: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            isFileAttached: true,
            isPaper: true,
            pending: false,
            receivedAt: '2018-01-01',
            relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
            scenario: 'Standard',
            servedAt: '2019-03-01T21:40:46.415Z',
          },
          inProgress: false,
          isInitializeCase: false,
          isRead: true,
          section: DOCKET_SECTION,
        },
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'section',
        },
      });
      expect(result).toEqual(
        `/case-detail/${baseWorkItem.docketNumber}/document-view?docketEntryId=${baseDocument.docketEntryId}`,
      );
    });

    it('should return docket entry edit link if document is in progress and user is docketclerk', () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          completedAt: '2019-03-01T21:40:46.415Z',
          docketEntry: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            isFileAttached: true,
            isPaper: true,
            pending: false,
            receivedAt: '2018-01-01',
            relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
            scenario: 'Standard',
          },
          inProgress: true,
          isInitializeCase: false,
          isRead: true,
          section: DOCKET_SECTION,
        },
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'section',
        },
      });
      expect(result).toEqual(
        `/case-detail/${baseWorkItem.docketNumber}/documents/${baseDocument.docketEntryId}/complete`,
      );
    });

    it('should return default edit link if document is in progress and user is petitionsClerk', () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          docketEntry: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            isFileAttached: false,
            isPaper: true,
            pending: false,
            receivedAt: '2018-01-01',
            relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
            scenario: 'Standard',
          },
          isInitializeCase: false,
          section: DOCKET_SECTION,
        },
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
        },
      });
      expect(result).toEqual(baseWorkItemEditLink);
    });

    it("should return /edit if document is an external doc that has not been qc'd and user is docketclerk", () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          docketEntry: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            pending: false,
            receivedAt: '2018-01-01',
            relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
            scenario: 'Standard',
          },
          isInitializeCase: false,
          section: DOCKET_SECTION,
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
        },
      });
      expect(result).toEqual(`${baseWorkItemEditLink}/edit`);
    });

    it('should return editLink as /edit if the box is my inbox and user is docketClerk', () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          docketEntry: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            pending: false,
            receivedAt: '2018-01-01',
            relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
            scenario: 'Standard',
          },
          isInitializeCase: false,
          section: DOCKET_SECTION,
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
        },
      });
      expect(result).toEqual(`${baseWorkItemEditLink}/edit`);
    });

    it('should return editLink as /review if the box is my inProgress and user is petitionsClerk', () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          caseIsInProgress: true,
          docketEntry: {
            ...baseDocument,
            documentType: 'Petition',
            eventCode: 'P',
            isFileAttached: true,
            isInProgress: true,
            pending: false,
            servedAt: null,
          },
          isInitializeCase: false,
          section: PETITIONS_SECTION,
        },
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'my',
        },
      });
      expect(result).toEqual(`${baseWorkItemEditLink}/review`);
    });
  });

  describe('formatWorkItem', () => {
    it('should return createdAtFormatted as MM/DD/YY format', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        createdAt: '2019-02-28T21:14:39.488Z',
        createdAtFormatted: undefined,
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.createdAtFormatted).toEqual('02/28/19');
    });

    it('should coerce the value of highPriority to a boolean', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        highPriority: 1,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.highPriority).toEqual(true);

      workItem.highPriority = undefined;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.highPriority).toEqual(false);
    });

    it('should capitalize sentBySection', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        sentBySection: 'section',
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.sentBySection).toEqual('Section');
    });

    it('should return completedAtFormatted as MM/DD/YY format for items older than the prior day', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        completedAt: '2019-02-28T21:14:39.488Z',
        completedAtFormatted: undefined,
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.completedAtFormatted).toEqual('02/28/19');
    });

    it('should return completedAtFormatted as Yesterday for items from the prior day', () => {
      const currentTime = applicationContext
        .getUtilities()
        .createISODateString();
      const yesterday = applicationContext
        .getUtilities()
        .calculateISODate({ dateString: currentTime, howMuch: -1 });

      const workItem = {
        ...FORMATTED_WORK_ITEM,
        completedAt: yesterday,
        completedAtFormatted: undefined,
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.completedAtFormatted).toEqual('Yesterday');
    });

    it('should return the current time for items completed today', () => {
      const currentTime = applicationContext
        .getUtilities()
        .createISODateString();

      const workItem = {
        ...FORMATTED_WORK_ITEM,
        completedAt: currentTime,
        completedAtFormatted: undefined,
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.completedAtFormatted).toContain(':');
      expect(result.completedAtFormatted).toContain('ET');
      expect(result.completedAtFormatted).not.toContain('/');
    });

    it('should return completedAtFormattedTZ as DATE_TIME_TZ format', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        completedAt: '2019-02-28T21:14:39.488Z',
        completedAtFormattedTZ: undefined,
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.completedAtFormattedTZ).toEqual('02/28/19 4:14 pm ET');
    });

    it('should return assigneeName as "Unassigned" when assigneeName is falsy', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        assigneeName: '',
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.assigneeName).toEqual('Unassigned');
    });

    it('should show the high priority icon when the work item is high priority', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        highPriority: false,
        showHighPriorityIcon: undefined,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.showHighPriorityIcon).toEqual(undefined);

      workItem.highPriority = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showHighPriorityIcon).toEqual(true);
    });

    it('should show unread indicators when the work item is unread', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        isRead: false,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnreadIndicators).toEqual(true);

      workItem.isRead = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnreadIndicators).toEqual(false);
    });

    it('should show unread status icon when the work item is unread and not high priority', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        highPriority: false,
        isRead: false,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnreadStatusIcon).toEqual(true);

      workItem.isRead = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnreadStatusIcon).toEqual(false);

      workItem.isRead = false;
      workItem.highPriority = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnreadStatusIcon).toEqual(false);
    });

    it('should set showComplete and showSendTo to true when isInitializeCase is false', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        isInitializeCase: false,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.showComplete).toEqual(true);
      expect(result.showSendTo).toEqual(true);

      workItem.isInitializeCase = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showComplete).toEqual(false);
      expect(result.showSendTo).toEqual(false);
    });

    it('should return showUnassignedIcon as true when assigneeName is falsy and highPriority is false', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        assigneeName: '',
        highPriority: false,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnassignedIcon).toEqual(true);

      workItem.highPriority = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnassignedIcon).toBeFalsy();

      workItem.highPriority = false;
      workItem.assigneeName = 'Not Unassigned';

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnassignedIcon).toBeFalsy();
    });

    it('should return selected as true if workItemId is found in selectedWorkItems', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        workItemId: '123',
      };

      const selectedWorkItems = [
        {
          workItemId: '234',
        },
        {
          workItemId: '345',
        },
      ];

      let result = formatWorkItem({
        applicationContext,
        selectedWorkItems,
        workItem,
      });
      expect(result.selected).toEqual(false);

      workItem.workItemId = '234';

      result = formatWorkItem({
        applicationContext,
        selectedWorkItems,
        workItem,
      });
      expect(result.selected).toEqual(true);
    });

    it('should return docketEntry.createdAt for receivedAt', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        docketEntry: {
          ...FORMATTED_WORK_ITEM.docketEntry,
          createdAt: '2018-12-26T18:05:54.166Z',
          receivedAt: '2018-12-27T18:05:54.166Z',
        },
      };

      const result = formatWorkItem({
        applicationContext,
        workItem,
      });
      expect(result.receivedAt).toEqual(result.docketEntry.receivedAt);
    });

    it('should return docketEntry.createdAt for receivedAt when docketEntry.receivedAt is today', () => {
      const now = new Date().toISOString();
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        docketEntry: {
          ...FORMATTED_WORK_ITEM.docketEntry,
          createdAt: '2018-12-27T18:05:54.166Z',
          receivedAt: now,
        },
      };

      const result = formatWorkItem({
        applicationContext,
        workItem,
      });
      expect(result.receivedAt).toEqual(result.docketEntry.createdAt);
    });

    it('should return received as receivedAt when receivedAt is NOT today', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        docketEntry: {
          ...FORMATTED_WORK_ITEM.docketEntry,
          createdAt: '2018-12-27T18:05:54.166Z',
          receivedAt: '2018-12-27T18:05:54.166Z',
        },
      };

      const result = formatWorkItem({
        applicationContext,
        workItem,
      });
      expect(result.received).toEqual('12/27/18');
    });

    it('should return isCourtIssuedDocument as true when the documentType is a court issued document type', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        docketEntry: {
          ...FORMATTED_WORK_ITEM.docketEntry,
          documentType: 'Petition',
        },
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.isCourtIssuedDocument).toEqual(false);

      workItem.docketEntry.documentType = 'Transcript';

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.isCourtIssuedDocument).toEqual(true);
    });

    it('should return isOrder as true when the documentType is a court issued document type', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        docketEntry: {
          ...FORMATTED_WORK_ITEM.docketEntry,
          documentType: 'Petition',
        },
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.isOrder).toEqual(false);

      workItem.docketEntry.documentType = 'Order';

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.isOrder).toEqual(true);
    });

    it('should return the documentType as descriptionDisplay if no documentTitle is present', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        docketEntry: {
          ...FORMATTED_WORK_ITEM.document,
          documentType: 'Document Type',
        },
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.docketEntry.descriptionDisplay).toEqual('Document Type');
    });

    it('should return the documentTitle as descriptionDisplay if no additionalInfo is present', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        docketEntry: {
          ...FORMATTED_WORK_ITEM.docketEntry,
          documentTitle: 'Document Title',
        },
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.docketEntry.descriptionDisplay).toEqual('Document Title');
    });

    it('should return the documentTitle with additionalInfo as descriptionDisplay if documentTitle and additionalInfo are present', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        docketEntry: {
          ...FORMATTED_WORK_ITEM.docketEntry,
          additionalInfo: 'with Additional Info',
          documentTitle: 'Document Title',
        },
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.docketEntry.descriptionDisplay).toEqual(
        'Document Title with Additional Info',
      );
    });
  });

  describe('formatDateIfToday', () => {
    it('returns a time if the date is today', () => {
      const currentTime = applicationContext
        .getUtilities()
        .createISODateString();

      const result = formatDateIfToday(currentTime, applicationContext);

      expect(result).toContain(':');
      expect(result).toContain('ET');
      expect(result).not.toContain('/');
    });

    it('returns "Yesterday" if the date is yesterday', () => {
      const currentTime = applicationContext
        .getUtilities()
        .createISODateString();
      const yesterday = applicationContext
        .getUtilities()
        .calculateISODate({ dateString: currentTime, howMuch: -1 });

      const result = formatDateIfToday(yesterday, applicationContext);

      expect(result).toEqual('Yesterday');
    });

    it('returns the formatted date if older than one day', () => {
      const date = applicationContext
        .getUtilities()
        .formatDateString('2019-01-01T17:29:13.122Z');

      const result = formatDateIfToday(date, applicationContext);

      expect(result).toContain('01/01/19');
    });
  });
});
