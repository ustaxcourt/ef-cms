import {
  GRANT_DENY_MOTION_OPTIONS,
  MOTION_DISPOSITIONS,
} from '@shared/business/entities/EntityConstants';
import {
  GrantDenyActionResult,
  baseCaseDetail,
  baseState,
  expectedPreamble,
  motion,
} from './grantDenyMotionActionTestFixtures';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { prepareGrantDenyMotionAction } from './prepareGrantDenyMotionAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('prepareGrantDenyMotionAction movant identification', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('uses the plural petitioner possessive when multiple petitioners filed the motion', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        caseDetail: {
          ...baseCaseDetail,
          petitioners: [{ name: 'Jane Doe' }, { name: 'John Doe' }],
        },
        form: { disposition: MOTION_DISPOSITIONS.GRANTED },
      },
    });

    expect(result.state.form.richText).toContain(
      "ORDERED that petitioners' Motion to Compel is granted.",
    );
  });

  it('uses the plural petitioner possessive for a motion to consolidate on a consolidated lead case', async () => {
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
          docketEntries: [
            {
              ...motion,
              documentTitle:
                'Motion to Consolidate Docket Numbers 124-26, 125-26',
              documentType: 'Motion to Consolidate',
            },
          ],
          leadDocketNumber: '123-26',
          petitioners: [{ name: 'Jane Doe' }, { name: 'John Doe' }],
        },
        form: {
          disposition: MOTION_DISPOSITIONS.GRANTED,
          issueOrder:
            GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.allCasesInGroup,
        },
      },
    });

    expect(result.state.form.richText).toContain(
      "ORDERED that petitioners' Motion to Consolidate Docket Numbers 124-26, 125-26 is granted.",
    );
    expect(result.state.form.richText).not.toContain("petitioner's");
  });

  it('uses "the parties" possessive when the motion was filed jointly by petitioner and respondent', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        caseDetail: {
          ...baseCaseDetail,
          docketEntries: [
            {
              ...motion,
              documentTitle: 'Joint Motion for Continuance',
              filedBy: 'Resp. & Petr. Jane Doe',
              filers: ['petitioner-1'],
              partyIrsPractitioner: true,
            },
          ],
          petitioners: [{ contactId: 'petitioner-1', name: 'Jane Doe' }],
        },
        form: { disposition: MOTION_DISPOSITIONS.GRANTED },
      },
    });

    expect(result.state.form.richText).toContain(
      expectedPreamble({
        motionTitle: 'Joint Motion for Continuance',
        movant: 'the parties',
      }),
    );
    expect(result.state.form.richText).toContain(
      "ORDERED that the parties' Joint Motion for Continuance is granted.",
    );
  });

  it('names the other filing party in the preamble and possessive when a non-party filed', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        caseDetail: {
          ...baseCaseDetail,
          docketEntries: [
            {
              ...motion,
              filedBy: 'A Friend',
              filers: [],
              otherFilingParty: 'A Friend',
            },
          ],
          petitioners: [{ contactId: 'petitioner-1', name: 'Jane Doe' }],
        },
        form: { disposition: MOTION_DISPOSITIONS.GRANTED },
      },
    });

    expect(result.state.form.richText).toContain(
      expectedPreamble({ movant: 'A Friend' }),
    );
    expect(result.state.form.richText).toContain(
      "ORDERED that A Friend's Motion to Compel is granted.",
    );
    expect(result.state.form.richText).not.toContain('respondent');
  });

  describe('precedence when the "Other" filing party is combined with parties', () => {
    const otherPartyName = 'A Friend';
    const twoPetitioners = [
      { contactId: 'petitioner-1', name: 'Jane Doe' },
      { contactId: 'petitioner-2', name: 'John Doe' },
    ];

    const runWithFilers = ({
      motionOverrides,
      petitioners,
    }: {
      motionOverrides: Record<string, unknown>;
      petitioners: { contactId: string; name: string }[];
    }): GrantDenyActionResult =>
      runAction(prepareGrantDenyMotionAction, {
        modules: { presenter },
        state: {
          ...baseState,
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...motion,
                otherFilingParty: otherPartyName,
                ...motionOverrides,
              },
            ],
            petitioners,
          },
          form: { disposition: MOTION_DISPOSITIONS.GRANTED },
        },
      });

    it('names the petitioners, not the other filing party, when multiple petitioners also filed', async () => {
      const result = await runWithFilers({
        motionOverrides: {
          filedBy: 'Petrs. Jane Doe & John Doe, A Friend',
          filers: ['petitioner-1', 'petitioner-2'],
        },
        petitioners: twoPetitioners,
      });

      expect(result.state.form.richText).toContain(
        expectedPreamble({ movant: 'petitioners' }),
      );
      expect(result.state.form.richText).toContain(
        "ORDERED that petitioners' Motion to Compel is granted.",
      );
      expect(result.state.form.richText).not.toContain(otherPartyName);
    });

    it('names the parties, not the other filing party, when a petitioner and respondent also filed', async () => {
      const result = await runWithFilers({
        motionOverrides: {
          filedBy: 'Resp. & Petr. Jane Doe, A Friend',
          filers: ['petitioner-1'],
          partyIrsPractitioner: true,
        },
        petitioners: [{ contactId: 'petitioner-1', name: 'Jane Doe' }],
      });

      expect(result.state.form.richText).toContain(
        expectedPreamble({ movant: 'the parties' }),
      );
      expect(result.state.form.richText).toContain(
        "ORDERED that the parties' Motion to Compel is granted.",
      );
      expect(result.state.form.richText).not.toContain(otherPartyName);
    });

    it('names the parties, not the other filing party, when multiple petitioners and respondent also filed', async () => {
      const result = await runWithFilers({
        motionOverrides: {
          filedBy: 'Resp. & Petrs. Jane Doe & John Doe, A Friend',
          filers: ['petitioner-1', 'petitioner-2'],
          partyIrsPractitioner: true,
        },
        petitioners: twoPetitioners,
      });

      expect(result.state.form.richText).toContain(
        expectedPreamble({ movant: 'the parties' }),
      );
      expect(result.state.form.richText).toContain(
        "ORDERED that the parties' Motion to Compel is granted.",
      );
      expect(result.state.form.richText).not.toContain(otherPartyName);
    });

    it('names the respondent, not the other filing party, when respondent also filed', async () => {
      const result = await runWithFilers({
        motionOverrides: {
          filedBy: 'Resp., A Friend',
          filers: [],
          partyIrsPractitioner: true,
        },
        petitioners: [{ contactId: 'petitioner-1', name: 'Jane Doe' }],
      });

      expect(result.state.form.richText).toContain(
        expectedPreamble({ movant: 'respondent' }),
      );
      expect(result.state.form.richText).toContain(
        "ORDERED that respondent's Motion to Compel is granted.",
      );
      expect(result.state.form.richText).not.toContain(otherPartyName);
    });
  });

  it('names the other filing party when their name contains the petitioner name', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        caseDetail: {
          ...baseCaseDetail,
          docketEntries: [
            {
              ...motion,
              filedBy: 'John Doe Foundation',
              filers: [],
              otherFilingParty: 'John Doe Foundation',
            },
          ],
          petitioners: [{ contactId: 'petitioner-1', name: 'John Doe' }],
        },
        form: { disposition: MOTION_DISPOSITIONS.GRANTED },
      },
    });

    expect(result.state.form.richText).toContain(
      expectedPreamble({ movant: 'John Doe Foundation' }),
    );
    expect(result.state.form.richText).toContain(
      "ORDERED that John Doe Foundation's Motion to Compel is granted.",
    );
    expect(result.state.form.richText).not.toContain('petitioner');
  });

  describe("the acceptance criteria's amicus example", () => {
    const amicusName = 'Chamber of Commerce of the United States of America';
    const amicusMotion = {
      ...motion,
      documentTitle: 'Motion for Leave to File Amicus Brief',
      eventCode: 'M115',
      filedBy: amicusName,
      filers: [],
      otherFilingParty: amicusName,
    };

    const runWithDisposition = (disposition: string): GrantDenyActionResult =>
      runAction(prepareGrantDenyMotionAction, {
        modules: { presenter },
        state: {
          ...baseState,
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [amicusMotion],
            petitioners: [{ contactId: 'petitioner-1', name: 'Jane Doe' }],
          },
          form: { disposition },
        },
      });

    it.each([
      [MOTION_DISPOSITIONS.GRANTED, 'granted'],
      [MOTION_DISPOSITIONS.DENIED, 'denied'],
    ])('reads as the criteria specify when %s', async (disposition, verb) => {
      const result = await runWithDisposition(disposition);

      expect(result.state.form.richText).toContain(
        expectedPreamble({
          motionTitle: 'Motion for Leave to File Amicus Brief',
          movant: amicusName,
        }),
      );
      expect(result.state.form.richText).toContain(
        `ORDERED that ${amicusName}'s Motion for Leave to File Amicus Brief is ${verb}.`,
      );
      expect(result.state.form.richText).not.toContain('respondent');
      expect(result.state.form.richText).not.toContain('petitioner');
    });
  });

  it('uses respondent possessive when respondent filed the motion', async () => {
    const result = await runAction(prepareGrantDenyMotionAction, {
      modules: { presenter },
      state: {
        ...baseState,
        caseDetail: {
          ...baseCaseDetail,
          docketEntries: [
            {
              ...motion,
              filedBy: 'Respt. Commissioner',
            },
          ],
        },
        form: { disposition: MOTION_DISPOSITIONS.GRANTED },
      },
    });

    expect(result.state.form.richText).toContain(
      "ORDERED that respondent's Motion to Compel is granted.",
    );
  });
});
