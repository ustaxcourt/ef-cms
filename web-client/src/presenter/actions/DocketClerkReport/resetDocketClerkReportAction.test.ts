import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { resetDocketClerkReportAction } from './resetDocketClerkReportAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetDocketClerkReportAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should reset all docketClerkReport state slices to their initial values', async () => {
    const { state } = await runAction(resetDocketClerkReportAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          box: 'processed',
          completedMessages: [{ messageId: 'abc' }],
          docketClerks: [{ userId: 'u1', name: 'Alice' }],
          errors: { docketClerkUserId: 'Select a Docket Clerk' },
          form: { docketClerkUserId: 'u1', pageType: 'documentQC' },
          inboxMessages: [{ messageId: 'def' }],
          inboxWorkItems: [{ workItemId: 'w1' }],
          pageType: 'documentQC',
          selectedClerk: { userId: 'u1', name: 'Alice' },
          sentMessages: [{ messageId: 'ghi' }],
          servedWorkItems: [{ workItemId: 'w2' }],
        },
      },
    });

    expect(state.docketClerkReport.form).toEqual({});
    expect(state.docketClerkReport.selectedClerk).toBeNull();
    expect(state.docketClerkReport.pageType).toBeNull();
    expect(state.docketClerkReport.box).toBe('inbox');
    expect(state.docketClerkReport.inboxWorkItems).toEqual([]);
    expect(state.docketClerkReport.servedWorkItems).toEqual([]);
    expect(state.docketClerkReport.inboxMessages).toEqual([]);
    expect(state.docketClerkReport.sentMessages).toEqual([]);
    expect(state.docketClerkReport.completedMessages).toEqual([]);
    expect(state.docketClerkReport.errors).toBeNull();
  });
});
