import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { docketClerkUser } from '../../../../shared/src/test/mockUsers';
import { formatWorkItem } from './formattedWorkQueue';

describe('formatWorkItem', () => {
  const currentTime = applicationContext.getUtilities().createISODateString();
  const yesterday = applicationContext
    .getUtilities()
    .calculateISODate({ dateString: currentTime, howMuch: -1 });

  const { DOCKET_NUMBER_SUFFIXES, DOCKET_SECTION, STATUS_TYPES } =
    applicationContext.getConstants();

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

  it('should return createdAtFormatted as MM/DD/YY format', () => {
    const workItem = {
      ...baseWorkItem,
      createdAt: '2019-02-28T21:14:39.488Z',
      createdAtFormatted: undefined,
    };

    const result = formatWorkItem({ applicationContext, workItem });

    expect(result.createdAtFormatted).toEqual('02/28/19');
  });

  it('should coerce the value of highPriority to a boolean', () => {
    const workItem = {
      ...baseWorkItem,
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
      ...baseWorkItem,
      sentBySection: 'section',
    };

    const result = formatWorkItem({ applicationContext, workItem });

    expect(result.sentBySection).toEqual('Section');
  });

  it('should return completedAtFormatted as MM/DD/YY format for items older than the prior day', () => {
    const workItem = {
      ...baseWorkItem,
      completedAt: '2019-02-28T21:14:39.488Z',
      completedAtFormatted: undefined,
    };

    const result = formatWorkItem({ applicationContext, workItem });

    expect(result.completedAtFormatted).toEqual('02/28/19');
  });

  it('should return completedAtFormatted as Yesterday for items from the prior day', () => {
    const workItem = {
      ...baseWorkItem,
      completedAt: yesterday,
      completedAtFormatted: undefined,
    };

    const result = formatWorkItem({ applicationContext, workItem });

    expect(result.completedAtFormatted).toEqual('Yesterday');
  });

  it('should return the current time for items completed today', () => {
    const workItem = {
      ...baseWorkItem,
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
      ...baseWorkItem,
      completedAt: '2019-02-28T21:14:39.488Z',
      completedAtFormattedTZ: undefined,
    };

    const result = formatWorkItem({ applicationContext, workItem });

    expect(result.completedAtFormattedTZ).toEqual('02/28/19 4:14 pm ET');
  });

  it('should return assigneeName as "Unassigned" when assigneeName is falsy', () => {
    const workItem = {
      ...baseWorkItem,
      assigneeName: '',
    };

    const result = formatWorkItem({ applicationContext, workItem });

    expect(result.assigneeName).toEqual('Unassigned');
  });

  it('should show the high priority icon when the work item is high priority', () => {
    const workItem = {
      ...baseWorkItem,
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
      ...baseWorkItem,
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
      ...baseWorkItem,
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
      ...baseWorkItem,
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
      ...baseWorkItem,
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

  it('should return selected as true if `isSelected` attribute passed in as true', () => {
    const workItem = {
      ...baseWorkItem,
      workItemId: '123',
    };

    let result = formatWorkItem({
      applicationContext,
      isSelected: undefined,
      workItem,
    });

    expect(result.selected).toEqual(false);

    workItem.workItemId = '234';

    result = formatWorkItem({
      applicationContext,
      isSelected: true,
      workItem,
    });

    expect(result.selected).toEqual(true);
  });

  it('should return docketEntry.createdAt for receivedAt', () => {
    const workItem = {
      ...baseWorkItem,
      docketEntry: {
        ...baseWorkItem.docketEntry,
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
    const workItem = {
      ...baseWorkItem,
      docketEntry: {
        ...baseWorkItem.docketEntry,
        createdAt: '2018-12-27T18:05:54.166Z',
        receivedAt: currentTime,
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
      ...baseWorkItem,
      docketEntry: {
        ...baseWorkItem.docketEntry,
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

  it('should return isCourtIssuedDocument as false when the eventCode is NOT court issued document type', () => {
    const workItem = {
      ...baseWorkItem,
      docketEntry: {
        ...baseWorkItem.docketEntry,
        documentType: 'Petition',
        eventCode: 'P',
      },
    };

    const result = formatWorkItem({ applicationContext, workItem });

    expect(result.isCourtIssuedDocument).toBeFalsy();
  });

  it('should return isCourtIssuedDocument as true when the eventCode is a court issued document type', () => {
    const workItem = {
      ...baseWorkItem,
      docketEntry: {
        ...baseWorkItem.docketEntry,
        documentType: 'Miscellaneous',
        eventCode: 'O',
      },
    };

    const result = formatWorkItem({ applicationContext, workItem });

    expect(result.isCourtIssuedDocument).toBeTruthy();
  });

  it('should return isOrder as true when the documentType is a court issued document type', () => {
    const workItem = {
      ...baseWorkItem,
      docketEntry: {
        ...baseWorkItem.docketEntry,
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
      ...baseWorkItem,
      docketEntry: {
        ...baseWorkItem.document,
        documentType: 'Document Type',
      },
    };

    const result = formatWorkItem({ applicationContext, workItem });

    expect(result.docketEntry.descriptionDisplay).toEqual('Document Type');
  });

  it('should return the documentTitle as descriptionDisplay if no additionalInfo is present', () => {
    const workItem = {
      ...baseWorkItem,
      docketEntry: {
        ...baseWorkItem.docketEntry,
        documentTitle: 'Document Title',
      },
    };

    const result = formatWorkItem({ applicationContext, workItem });

    expect(result.docketEntry.descriptionDisplay).toEqual('Document Title');
  });

  it('should return the documentTitle with additionalInfo as descriptionDisplay if documentTitle and additionalInfo are present', () => {
    const workItem = {
      ...baseWorkItem,
      docketEntry: {
        ...baseWorkItem.docketEntry,
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
