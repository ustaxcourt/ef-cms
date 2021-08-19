import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  docketClerkUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { getWorkItemDocumentLink } from './formattedWorkQueue';

describe('getWorkItemDocumentLink', () => {
  const {
    DOCKET_NUMBER_SUFFIXES,
    DOCKET_SECTION,
    DOCUMENT_RELATIONSHIPS,
    PETITIONS_SECTION,
    STATUS_TYPES,
  } = applicationContext.getConstants();

  let globalUser;

  applicationContext.getCurrentUser = () => {
    return globalUser;
  };

  const getBaseState = user => {
    globalUser = user;
    return {
      permissions: getUserPermissions(user),
    };
  };

  const baseWorkItem = {
    assigneeId: docketClerkUser.userId,
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
    section: DOCKET_SECTION,
    sentBy: 'respondent',
    updatedAt: '2018-12-27T18:05:54.164Z',
    workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
  };

  const baseDocketEntry = {
    createdAt: '2019-12-16T16:48:02.888Z',
    docketEntryId: '6db35185-2445-4952-9449-5479a5cadab0',
    documentType: 'Administrative Record',
    eventCode: 'ADMR',
    filedBy: 'Petr. Ori Petersen',
    partyPrimary: true,
    partySecondary: false,
    processingStatus: 'complete',
    receivedAt: '2019-12-16T16:48:02.888Z',
    userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
  };
  const baseWorkItemEditLink = `/case-detail/${baseWorkItem.docketNumber}/documents/6db35185-2445-4952-9449-5479a5cadab0`;
  const documentViewLink = `/case-detail/${baseWorkItem.docketNumber}/document-view?docketEntryId=6db35185-2445-4952-9449-5479a5cadab0`;

  it('should return editLink as petition qc page if document is petition, case is not in progress, and user is petitionsclerk viewing a QC box', () => {
    const { permissions } = getBaseState(petitionsClerkUser);

    const result = getWorkItemDocumentLink({
      applicationContext,
      permissions,
      workItem: {
        ...baseWorkItem,
        docketEntry: {
          ...baseDocketEntry,
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
    expect(result).toEqual(
      `/case-detail/${baseWorkItem.docketNumber}/petition-qc`,
    );
  });

  it('should return /edit-court-issued if document is court-issued and not served and user is docketclerk', () => {
    const { permissions } = getBaseState(docketClerkUser);

    const result = getWorkItemDocumentLink({
      applicationContext,
      permissions,
      workItem: {
        ...baseWorkItem,
        docketEntry: {
          ...baseDocketEntry,
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
          ...baseDocketEntry,
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
          ...baseDocketEntry,
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
          ...baseDocketEntry,
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
      `/case-detail/${baseWorkItem.docketNumber}/document-view?docketEntryId=${baseDocketEntry.docketEntryId}`,
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
          ...baseDocketEntry,
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
      `/case-detail/${baseWorkItem.docketNumber}/documents/${baseDocketEntry.docketEntryId}/complete`,
    );
  });

  it('should return default document view link when the document has been processed, is unservable, and the user is docketClerk', () => {
    const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();
    const { permissions } = getBaseState(docketClerkUser);

    const result = getWorkItemDocumentLink({
      applicationContext,
      permissions,
      workItem: {
        ...baseWorkItem,
        completedAt: '2019-02-28T21:14:39.488Z',
        docketEntry: {
          ...baseDocketEntry,
          documentTitle: 'Hearing Exhibits for A document from the west',
          documentType: 'Hearing Exhibits',
          eventCode: UNSERVABLE_EVENT_CODES[0],
          isFileAttached: true,
          pending: false,
          receivedAt: '2018-01-01',
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
          scenario: 'Standard',
        },
        isInitializeCase: false,
        section: DOCKET_SECTION,
      },
      workQueueToDisplay: {
        box: 'outbox',
        queue: 'my',
      },
    });

    expect(result).toEqual(documentViewLink);
  });

  it('should return default document view link if document is in progress and user is petitionsClerk', () => {
    const { permissions } = getBaseState(petitionsClerkUser);

    const result = getWorkItemDocumentLink({
      applicationContext,
      permissions,
      workItem: {
        ...baseWorkItem,
        docketEntry: {
          ...baseDocketEntry,
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

    expect(result).toEqual(documentViewLink);
  });

  it("should return /edit if document is an external doc that has not been qc'd and user is docketclerk", () => {
    const { permissions } = getBaseState(docketClerkUser);

    const result = getWorkItemDocumentLink({
      applicationContext,
      permissions,
      workItem: {
        ...baseWorkItem,
        docketEntry: {
          ...baseDocketEntry,
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
          ...baseDocketEntry,
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
          ...baseDocketEntry,
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
