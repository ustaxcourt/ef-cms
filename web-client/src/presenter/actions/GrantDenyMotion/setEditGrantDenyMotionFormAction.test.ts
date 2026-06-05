import {
  GRANT_DENY_MOTION_OPTIONS,
  MOTION_DISPOSITIONS,
} from '@shared/business/entities/EntityConstants';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setEditGrantDenyMotionFormAction } from './setEditGrantDenyMotionFormAction';

describe('setEditGrantDenyMotionFormAction', () => {
  const caseDetail = {
    docketNumber: '123-26',
  };

  const draftOrderState = {
    additionalOrderText: ['some text'],
    deniedAsMoot: true,
    deniedWithoutPrejudice: false,
    disposition: MOTION_DISPOSITIONS.DENIED,
    dueDate: '2026-12-31',
    dueDateMessage:
      GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport,
    filingParty: GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.respondent,
    issueOrder: GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.justThisCase,
    jurisdiction: GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.retained,
    strickenFromTrialSession: true,
  };

  it('hydrates state.form from documentToEdit.draftOrderState and returns case-detail edit path', async () => {
    const result = await runAction(setEditGrantDenyMotionFormAction, {
      modules: { presenter },
      props: { caseDetail, docketEntryIdToEdit: 'doc-1' },
      state: {
        caseDetail,
        documentToEdit: { draftOrderState },
      },
    });

    expect(result.state.form).toMatchObject(draftOrderState);
    expect(result.output.path).toEqual(
      '/case-detail/123-26/documents/doc-1/grant-deny-motion-edit',
    );
  });

  it('returns the messages-route edit path when parentMessageId is supplied', async () => {
    const result = await runAction(setEditGrantDenyMotionFormAction, {
      modules: { presenter },
      props: {
        caseDetail,
        docketEntryIdToEdit: 'doc-1',
        parentMessageId: 'msg-99',
      },
      state: {
        caseDetail,
        documentToEdit: { draftOrderState },
      },
    });

    expect(result.output.path).toEqual(
      '/messages/123-26/message-detail/msg-99/doc-1/grant-deny-motion-edit',
    );
  });

  it('restores state.docketEntryId from migrated draftOrderState.previousDocument', async () => {
    const motionDocketEntryId = 'motion-entry-99';

    const result = await runAction(setEditGrantDenyMotionFormAction, {
      modules: { presenter },
      props: { caseDetail, docketEntryIdToEdit: 'doc-1' },
      state: {
        caseDetail,
        documentToEdit: {
          draftOrderState: {
            ...draftOrderState,
            previousDocument: { docketEntryId: motionDocketEntryId },
          },
        },
      },
    });

    expect(result.state.docketEntryId).toEqual(motionDocketEntryId);
  });

  it('falls back to empty additionalOrderText when draftOrderState lacks it', async () => {
    const result = await runAction(setEditGrantDenyMotionFormAction, {
      modules: { presenter },
      props: { caseDetail, docketEntryIdToEdit: 'doc-1' },
      state: {
        caseDetail,
        documentToEdit: { draftOrderState: {} },
      },
    });

    expect(result.state.form.additionalOrderText).toEqual([]);
  });
});
