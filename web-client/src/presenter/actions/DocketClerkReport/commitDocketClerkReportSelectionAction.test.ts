import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { commitDocketClerkReportSelectionAction } from './commitDocketClerkReportSelectionAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('commitDocketClerkReportSelectionAction', () => {
  const mockClerks = [
    {
      name: 'Alice Jones',
      role: 'docketClerk',
      section: 'docket',
      userId: 'a1',
    },
    { name: 'Bob Smith', role: 'docketClerk', section: 'docket', userId: 'b1' },
  ];

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should commit selectedClerk matching docketClerkUserId from form', async () => {
    const { state } = await runAction(commitDocketClerkReportSelectionAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          docketClerks: mockClerks,
          form: { docketClerkUserId: 'b1', pageType: 'documentQC' },
          selectedClerk: null,
        },
      },
    });

    expect(state.docketClerkReport.selectedClerk).toMatchObject({
      name: 'Bob Smith',
      userId: 'b1',
    });
  });

  it('should commit the pageType from form', async () => {
    const { state } = await runAction(commitDocketClerkReportSelectionAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          docketClerks: mockClerks,
          form: { docketClerkUserId: 'a1', pageType: 'messages' },
          selectedClerk: null,
        },
      },
    });

    expect(state.docketClerkReport.pageType).toBe('messages');
  });

  it('should reset box to inbox', async () => {
    const { state } = await runAction(commitDocketClerkReportSelectionAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          box: 'processed',
          docketClerks: mockClerks,
          form: { docketClerkUserId: 'a1', pageType: 'documentQC' },
          selectedClerk: null,
        },
      },
    });

    expect(state.docketClerkReport.box).toBe('inbox');
  });

  it('should clear all prior result data arrays', async () => {
    const { state } = await runAction(commitDocketClerkReportSelectionAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          completedMessages: [{ messageId: 'm3' }],
          docketClerks: mockClerks,
          form: { docketClerkUserId: 'a1', pageType: 'documentQC' },
          inboxMessages: [{ messageId: 'm1' }],
          inboxWorkItems: [{ workItemId: 'w1' }],
          selectedClerk: null,
          sentMessages: [{ messageId: 'm2' }],
          servedWorkItems: [{ workItemId: 'w2' }],
        },
      },
    });

    expect(state.docketClerkReport.inboxWorkItems).toEqual([]);
    expect(state.docketClerkReport.servedWorkItems).toEqual([]);
    expect(state.docketClerkReport.inboxMessages).toEqual([]);
    expect(state.docketClerkReport.sentMessages).toEqual([]);
    expect(state.docketClerkReport.completedMessages).toEqual([]);
  });

  it('should set selectedClerk to null when docketClerkUserId is not found in docketClerks', async () => {
    const { state } = await runAction(commitDocketClerkReportSelectionAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          docketClerks: mockClerks,
          form: { docketClerkUserId: 'unknown-id', pageType: 'documentQC' },
          selectedClerk: { name: 'Old Clerk', userId: 'old' },
        },
      },
    });

    expect(state.docketClerkReport.selectedClerk).toBeNull();
  });

  it('should reset tableSort to createdAt desc', async () => {
    const { state } = await runAction(commitDocketClerkReportSelectionAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          docketClerks: mockClerks,
          form: { docketClerkUserId: 'a1', pageType: 'documentQC' },
          selectedClerk: null,
        },
        tableSort: { sortField: 'receivedAt', sortOrder: 'asc' },
      },
    });

    expect(state.tableSort).toEqual({
      sortField: 'createdAt',
      sortOrder: 'desc',
    });
  });
});
