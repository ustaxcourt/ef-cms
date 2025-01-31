import { CONTACT_TYPES } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  getPendingItemsFromCase,
  getPetitionersFromCase,
  getRespondentsFromCase,
  getTransformedPendingItemDetails,
  initializeTrialSessionMinuteSheetFormAction,
  transformFiledBy,
} from './initializeTrialSessionMinuteSheetFormAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('initializeTrialSessionMinuteSheetFormAction helper functions', () => {
  describe('getRespondentsFromCase', () => {
    it('should return empty respondent when case has no IRS practitioners', () => {
      const result = getRespondentsFromCase({
        irsPractitioners: [],
      } as any);

      const entries = Object.values(result);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        datesOfAppearance: '',
        name: '',
      });
    });

    it('should transform IRS practitioners into respondent entries', () => {
      const result = getRespondentsFromCase({
        irsPractitioners: [
          { name: 'Test Practitioner 1' },
          { name: 'Test Practitioner 2' },
        ],
      } as any);

      const entries = Object.values(result);
      expect(entries).toHaveLength(2);
      expect(entries[0]).toMatchObject({
        datesOfAppearance: '',
        name: 'Test Practitioner 1',
      });
      expect(entries[1]).toMatchObject({
        datesOfAppearance: '',
        name: 'Test Practitioner 2',
      });
    });
  });

  describe('getPetitionersFromCase', () => {
    it('should return empty petitioner when case has no petitioners', () => {
      const result = getPetitionersFromCase({
        petitioners: [],
        privatePractitioners: [],
      } as any);

      const entries = Object.values(result);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        datesOfAppearance: '',
        name: '',
        role: '',
      });
    });

    it('should mark petitioners as pro se when they have no counsel', () => {
      const result = getPetitionersFromCase({
        petitioners: [
          {
            contactId: '123',
            contactType: CONTACT_TYPES.petitioner,
            name: 'Test Petitioner',
          },
        ],
        privatePractitioners: [],
      } as any);

      const entries = Object.values(result);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        name: 'Test Petitioner',
        role: 'proSe',
      });
    });

    it('should mark petitioners as counsel when they have representation', () => {
      const result = getPetitionersFromCase({
        petitioners: [
          {
            contactId: '123',
            contactType: CONTACT_TYPES.petitioner,
            name: 'Test Petitioner',
          },
        ],
        privatePractitioners: [{ representing: ['123'] }],
      } as any);

      const entries = Object.values(result);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        name: 'Test Petitioner',
        role: 'counsel',
      });
    });
  });

  describe('transformFiledBy', () => {
    const mockCase = {
      irsPractitioners: [{ userId: 'irs1' }],
      petitioners: [{ contactId: 'pet1' }],
    } as any;

    it('should return "petitioner" when filed by petitioner only', () => {
      const result = transformFiledBy(mockCase, {
        filers: ['pet1'],
      });
      expect(result).toBe('petitioner');
    });

    it('should return "respondent" when filed by respondent only', () => {
      const result = transformFiledBy(mockCase, {
        filers: ['irs1'],
      });
      expect(result).toBe('respondent');
    });

    it('should return "petitionerAndRespondent" when filed by both', () => {
      const result = transformFiledBy(mockCase, {
        filers: ['pet1', 'irs1'],
      });
      expect(result).toBe('petitionerAndRespondent');
    });

    it('should return "other" when filed by neither', () => {
      const result = transformFiledBy(mockCase, {
        filers: ['unknown'],
      });
      expect(result).toBe('other');
    });
  });

  describe('getPendingItemsFromCase', () => {
    beforeAll(() => {
      applicationContext.getUtilities().formatCase.mockReturnValue({
        formattedDocketEntries: [
          {
            createdAt: '2023-01-01T00:00:00.000Z',
            documentType: 'Motion',
            filers: ['pet1'],
          },
        ],
      });
      applicationContext.getUtilities().isPending.mockReturnValue(true);
    });

    it('should transform pending items into action filing entries', () => {
      const result = getPendingItemsFromCase({
        caseDetail: MOCK_CASE,
        user: {},
      });

      const entries = Object.values(result);
      expect(entries).toHaveLength(2); // One pending item + one empty row
      expect(entries[0]).toMatchObject({
        date: '2018-11-21',
      });
      expect(entries[1]).toMatchObject({
        date: '',
      });
    });
  });
});

describe('getTransformedPendingItemDetails', () => {
  it('should return the matching option when documentType directly matches an option value', () => {
    const result = getTransformedPendingItemDetails({
      documentType: 'Order to Show Cause',
      eventCode: 'OSC',
    });
    expect(result).toEqual({
      description: '',
      documentType: 'orderToShowCause',
      objection: '',
    });
  });

  it('should identify and return "notice" category and description for notice documents by eventCode', () => {
    const result = getTransformedPendingItemDetails({
      documentType: '30-Day Notice of Trial',
      eventCode: 'NOTT',
    });
    expect(result).toEqual({
      description: '30-Day Notice of Trial',
      documentType: 'notice',
      objection: '',
    });
  });

  it('should identify and return "order" category and description for order documents by eventCode', () => {
    const result = getTransformedPendingItemDetails({
      documentType: 'Order that caption of case is amended',
      eventCode: 'OCA',
    });
    expect(result).toEqual({
      description: 'Order that caption of case is amended',
      documentType: 'order',
      objection: '',
    });
  });

  it('should identify and return "motion" category and description for motion documents by eventCode', () => {
    const result = getTransformedPendingItemDetails({
      documentType: 'Motion for a New Trial',
      eventCode: 'M218',
    });
    expect(result).toEqual({
      description: 'Motion for a New Trial',
      documentType: 'motion',
      objection: 'unknown',
    });
  });

  it('should identify and return "motion" category and description for motion documents by eventCode, with unknown objection', () => {
    const result = getTransformedPendingItemDetails({
      documentType: 'Motion for a New Trial',
      eventCode: 'M218',
      objections: 'unknown',
    });
    expect(result).toEqual({
      description: 'Motion for a New Trial',
      documentType: 'motion',
      objection: 'unknown',
    });
  });

  it('should identify and return "motion" category and description for motion documents by eventCode, with no objection', () => {
    const result = getTransformedPendingItemDetails({
      documentType: 'Motion for a New Trial',
      eventCode: 'M218',
      objections: 'noObjection',
    });
    expect(result).toEqual({
      description: 'Motion for a New Trial',
      documentType: 'motion',
      objection: 'unknown',
    });
  });

  it('should identify and return "motion" category and description for motion documents by eventCode, with objection', () => {
    const result = getTransformedPendingItemDetails({
      documentType: 'Motion for a New Trial',
      eventCode: 'M218',
      objections: 'objection',
    });
    expect(result).toEqual({
      description: 'Motion for a New Trial',
      documentType: 'motion',
      objection: 'unknown',
    });
  });

  it('should return "other" category and description when no match is found', () => {
    const result = getTransformedPendingItemDetails({
      documentType: 'Something Else Entirely',
      eventCode: 'XXX',
    });
    expect(result).toEqual({
      description: 'Something Else Entirely',
      documentType: 'other',
      objection: '',
    });
  });
});

describe('initializeTrialSessionMinuteSheetFormAction', () => {
  const mockJudge = {
    fullName: 'Judge Test',
    title: 'Chief Judge',
    userId: 'judge-123',
  };

  const mockTrialSession = {
    ...MOCK_TRIAL_REGULAR,
    judge: { userId: mockJudge.userId },
    trialClerk: { name: 'Clerk Test' },
  };

  const mockProps = {
    caseDetail: MOCK_CASE,
    judgeOptions: {
      'judge-123': mockJudge,
    },
    trialSession: mockTrialSession,
  };

  beforeEach(() => {
    applicationContext
      .getUtilities()
      .getFormattedTrialSessionDetails.mockReturnValue({
        courtReporter: mockTrialSession.courtReporter,
        isRemoteSession: false,
        judge: mockTrialSession.judge,
        trialClerk: mockTrialSession.trialClerk,
      });
  });

  it('should initialize the minute sheet form with trial session metadata', async () => {
    const { state } = await runAction(
      initializeTrialSessionMinuteSheetFormAction,
      {
        modules: {
          presenter,
        },
        props: mockProps,
        state: {
          user: {},
        },
      },
    );

    expect(state.minuteSheetForm.trialSessionMetadataSection).toMatchObject({
      courtReporter: mockTrialSession.courtReporter,
      judge: {
        fullName: mockJudge.fullName,
        title: mockJudge.title,
        userId: mockJudge.userId,
      },
      remoteSession: false,
      trialClerk: mockTrialSession.trialClerk.name,
    });
  });

  it('should initialize empty rows for recalled, motions, witnesses, and exhibits sections', async () => {
    const { state } = await runAction(
      initializeTrialSessionMinuteSheetFormAction,
      {
        modules: {
          presenter,
        },
        props: mockProps,
        state: {
          user: {},
        },
      },
    );

    // Check recalled section
    const recalledEntries = Object.values(
      state.minuteSheetForm.caseMetadataSection.recalled,
    );
    expect(recalledEntries).toHaveLength(1);
    expect(recalledEntries[0]).toMatchObject({
      date: '',
      note: '',
      transcriptOrdered: false,
    });

    // Check motions section
    const motionEntries = Object.values(
      state.minuteSheetForm.motionsSection.motions,
    );
    expect(motionEntries).toHaveLength(1);
    expect(motionEntries[0]).toMatchObject({
      date: '',
      filedBy: '',
      note: '',
      objection: '',
      oralMotion: false,
      status: '',
      type: '',
    });

    // Check witnesses sections
    const petitionerWitnesses = Object.values(
      state.minuteSheetForm.witnessesSection.petitionerWitnesses,
    );
    expect(petitionerWitnesses).toHaveLength(1);
    expect(petitionerWitnesses[0]).toMatchObject({
      name: '',
    });

    const respondentWitnesses = Object.values(
      state.minuteSheetForm.witnessesSection.respondentWitnesses,
    );
    expect(respondentWitnesses).toHaveLength(1);
    expect(respondentWitnesses[0]).toMatchObject({
      name: '',
    });

    // Check exhibits section
    const exhibitEntries = Object.values(
      state.minuteSheetForm.exhibitsSection.exhibits,
    );
    expect(exhibitEntries).toHaveLength(1);
    expect(exhibitEntries[0]).toMatchObject({
      description: '',
      note: '',
      status: '',
    });
  });

  it('should initialize petitioners and respondents sections using helper functions', async () => {
    const { state } = await runAction(
      initializeTrialSessionMinuteSheetFormAction,
      {
        modules: {
          presenter,
        },
        props: mockProps,
        state: {
          user: {},
        },
      },
    );

    expect(state.minuteSheetForm.petitionersSection.petitioners).toBeDefined();
    expect(state.minuteSheetForm.respondentsSection.respondents).toBeDefined();
  });

  it('should initialize actions and filings section with pending items', async () => {
    applicationContext.getUtilities().formatCase.mockReturnValue({
      formattedDocketEntries: [
        {
          createdAt: '2023-01-01T00:00:00.000Z',
          documentType: 'Motion',
          filers: ['pet1'],
        },
      ],
    });
    applicationContext.getUtilities().isPending.mockReturnValue(true);

    const { state } = await runAction(
      initializeTrialSessionMinuteSheetFormAction,
      {
        modules: {
          presenter,
        },
        props: mockProps,
        state: {
          user: {},
        },
      },
    );

    const actionsAndFilings = Object.values(
      state.minuteSheetForm.actionsAndFilingsSection.actionsAndFilings,
    );
    expect(actionsAndFilings.length).toBeGreaterThan(0);
  });
});
