import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setQCWorkItemIdToMarkAsReadIfNeededAction } from './setQCWorkItemIdToMarkAsReadIfNeededAction';

describe('setQCWorkItemIdToMarkAsReadIfNeededAction', () => {
  presenter.providers.applicationContext = applicationContextForClient;

  it('should return undefined when the docket entry was not found', async () => {
    const result = await runAction(setQCWorkItemIdToMarkAsReadIfNeededAction, {
      props: {
        docketEntryId: '123-abc-123-abc',
      },
      state: {
        caseDetail: {
          docketEntries: [],
        },
      },
    });

    expect(result.output.workItemIdToMarkAsRead).toBe(undefined);
  });

  it('should return undefined when the provided docket entry does not have a work item', async () => {
    const result = await runAction(setQCWorkItemIdToMarkAsReadIfNeededAction, {
      props: {
        docketEntryId: '123-abc-123-abc',
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123-abc-123-abc',
              lodged: true,
            },
          ],
        },
      },
    });

    expect(result.output.workItemIdToMarkAsRead).toBe(undefined);
  });

  it('should return undefined when the provided docket entry has a work item but it has already been read', async () => {
    const result = await runAction(setQCWorkItemIdToMarkAsReadIfNeededAction, {
      props: {
        docketEntryId: '123-abc-123-abc',
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123-abc-123-abc',
              workItem: { isRead: true, workItemId: 'ThisIsAnId' },
            },
          ],
        },
      },
    });

    expect(result.output.workItemIdToMarkAsRead).toBe(undefined);
  });

  it('should return the work item id to mark as read when the provided docket entry id has an unread work item', async () => {
    const result = await runAction(setQCWorkItemIdToMarkAsReadIfNeededAction, {
      props: {
        docketEntryId: '123-abc-123-abc',
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123-abc-123-abc',
              workItem: { isRead: false, workItemId: 'ThisIsAnId' },
            },
          ],
        },
      },
    });

    expect(result.output.workItemIdToMarkAsRead).toEqual('ThisIsAnId');
  });
});
