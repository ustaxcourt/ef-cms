import {
  CASE_STATUS_TYPES,
  GRANT_DENY_MOTION_OPTIONS,
  MOTION_DISPOSITIONS,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { prepareGrantDenyMotionAction } from './prepareGrantDenyMotionAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('prepareGrantDenyMotionAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  const motionId = 'motion-docket-entry-id';
  const motion = {
    docketEntryId: motionId,
    documentTitle: 'Motion to Compel',
    filedBy: 'Petr. Jane Doe',
    filingDate: '2026-03-15T10:00:00.000Z',
    index: 7,
  };

  const baseCaseDetail = {
    consolidatedCases: [],
    docketEntries: [motion],
    docketNumber: '123-26',
    petitioners: [{ name: 'Jane Doe' }],
    status: CASE_STATUS_TYPES.generalDocket,
  };

  const baseState = {
    caseDetail: baseCaseDetail,
    docketEntryId: motionId,
    form: {},
    parentMessageId: undefined,
  };

  it('builds a granted disposition clause and a docketEntryDescription', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: { disposition: MOTION_DISPOSITIONS.GRANTED },
      },
    });

    expect(result.state.form.documentTitle).toEqual(
      'Order - Motion to Compel is granted',
    );
    expect(result.state.form.documentType).toEqual('Order');
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.orderType).toEqual(
      GRANT_DENY_MOTION_OPTIONS.orderType,
    );
    expect(result.state.form.richText).toContain(
      'On March 15, 2026, petitioner filed a Motion to Compel (doc. no. 7).',
    );
    expect(result.state.form.richText).toContain(
      'ORDERED that the Motion to Compel is granted.',
    );
  });

  it('builds a denied-as-moot-without-prejudice phrase', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: {
          deniedAsMoot: true,
          deniedWithoutPrejudice: true,
          disposition: MOTION_DISPOSITIONS.DENIED,
        },
      },
    });

    expect(result.state.form.documentTitle).toEqual(
      'Order - Motion to Compel is denied as moot without prejudice',
    );
    expect(result.state.form.richText).toContain(
      'ORDERED that the Motion to Compel is denied as moot without prejudice.',
    );
  });

  it('rewrites doc. no. to lead case doc. no. when on lead case with allCasesInGroup', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        caseDetail: {
          ...baseCaseDetail,
          consolidatedCases: [
            { docketNumber: '123-26', docketNumberWithSuffix: '123-26' },
            { docketNumber: '124-26', docketNumberWithSuffix: '124-26' },
          ],
          leadDocketNumber: '123-26',
        },
        form: {
          disposition: MOTION_DISPOSITIONS.GRANTED,
          issueOrder:
            GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.allCasesInGroup,
        },
      },
    });

    expect(result.state.form.richText).toContain('(lead case doc. no. 7)');
    expect(result.state.createOrderSelectedCases).toHaveLength(2);
  });

  it('keeps doc. no. when justThisCase is selected', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        caseDetail: {
          ...baseCaseDetail,
          consolidatedCases: [
            { docketNumber: '123-26', docketNumberWithSuffix: '123-26' },
          ],
          leadDocketNumber: '123-26',
        },
        form: {
          disposition: MOTION_DISPOSITIONS.GRANTED,
          issueOrder:
            GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.justThisCase,
        },
      },
    });

    expect(result.state.form.richText).toContain('(doc. no. 7)');
    expect(result.state.form.richText).not.toContain('lead case doc. no.');
    expect(result.state.createOrderSelectedCases).toEqual([]);
  });

  it('prepends trial preamble when calendared', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        caseDetail: {
          ...baseCaseDetail,
          status: CASE_STATUS_TYPES.calendared,
          trialDate: '2026-09-15',
          trialLocation: 'Washington, DC',
        },
        form: { disposition: MOTION_DISPOSITIONS.GRANTED },
      },
    });

    expect(result.state.form.richText).toContain(
      'This case is set for trial at the session of the Court commencing on September 15, 2026 in Washington, DC.',
    );
  });

  it('appends stricken-from-trial clause referencing the trial date and location', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        caseDetail: {
          ...baseCaseDetail,
          status: CASE_STATUS_TYPES.calendared,
          trialDate: '2026-09-15',
          trialLocation: 'Washington, DC',
        },
        form: {
          disposition: MOTION_DISPOSITIONS.GRANTED,
          strickenFromTrialSession: true,
        },
      },
    });

    expect(result.state.form.richText).toContain(
      'ORDERED that this case is stricken from the September 15, 2026 Washington, DC trial session.',
    );
    expect(result.state.form.richText).toContain('It is further');
  });

  it('appends restored-to-docket clause when jurisdiction = restored', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: {
          disposition: MOTION_DISPOSITIONS.GRANTED,
          jurisdiction:
            GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.restored,
        },
      },
    });

    expect(result.state.form.richText).toContain(
      'ORDERED that this case is restored to the general docket.',
    );
    expect(result.state.form.richText).not.toContain(
      'jurisdiction is retained',
    );
  });

  it('appends jurisdiction-retained clause when jurisdiction = retained', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: {
          disposition: MOTION_DISPOSITIONS.GRANTED,
          jurisdiction:
            GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.retained,
        },
      },
    });

    expect(result.state.form.richText).toContain(
      'ORDERED that jurisdiction is retained by the undersigned.',
    );
    expect(result.state.form.richText).not.toContain('restored');
  });

  it('appends a status-report clause with filing party and due date', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: {
          disposition: MOTION_DISPOSITIONS.GRANTED,
          dueDate: '2026-12-31',
          dueDateMessage:
            GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport,
          filingParty:
            GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.respondent,
        },
      },
    });

    expect(result.state.form.richText).toContain(
      'ORDERED that Respondent shall file a status report by December 31, 2026.',
    );
  });

  it('appends a status-report-or-stip-decision clause', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: {
          disposition: MOTION_DISPOSITIONS.GRANTED,
          dueDate: '2026-12-31',
          dueDateMessage:
            GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions
              .statusReportOrStipulatedDecision,
          filingParty: GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.joint,
        },
      },
    });

    expect(result.state.form.richText).toContain(
      'ORDERED that Joint shall file a status report or proposed stipulated decision by December 31, 2026.',
    );
  });

  it('appends one ORDERED clause per non-empty additionalOrderText entry, ignoring empties', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: {
          additionalOrderText: ['first thing', '   ', '', 'second thing'],
          disposition: MOTION_DISPOSITIONS.GRANTED,
        },
      },
    });

    const occurrences = (result.state.form.richText.match(
      /ORDERED that /g,
    ) || []).length;
    expect(occurrences).toBe(3); // 1 disposition + 2 additional
    expect(result.state.form.richText).toContain('ORDERED that first thing.');
    expect(result.state.form.richText).toContain('ORDERED that second thing.');
  });

  it('joins multiple clauses with "It is further" between them', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: {
          additionalOrderText: ['extra'],
          disposition: MOTION_DISPOSITIONS.GRANTED,
          jurisdiction:
            GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.retained,
        },
      },
    });

    const matches = result.state.form.richText.match(/It is further/g) || [];
    expect(matches.length).toBe(2); // disposition→jurisdiction, jurisdiction→additional
  });

  it('throws when motion docket entry not found', async () => {
    await expect(
      runAction(prepareGrantDenyMotionAction, {
        modules: { presenter },
        state: {
          ...baseState,
          docketEntryId: 'nonexistent-id',
          form: { disposition: MOTION_DISPOSITIONS.GRANTED },
        },
      }),
    ).rejects.toThrow(
      'Could not find docket entry with id nonexistent-id',
    );
  });
});
