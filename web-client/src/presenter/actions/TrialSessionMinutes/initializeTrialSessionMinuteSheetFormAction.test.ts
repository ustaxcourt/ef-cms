import {
  CONTACT_TYPES,
  MOTION_OBJECTION_OPTIONS,
  MOTION_OBJECTION_OPTIONS_INVERTED,
  OBJECTIONS_OPTIONS_MAP,
  PETITIONER_ROLE_OPTIONS,
  PETITIONER_ROLE_OPTIONS_INVERTED,
  SESSION_TYPES,
  TrialSessionProceedingType,
  TrialSessionScope,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import {
  casePetitioner as mockCasePetitioner,
  validUser as mockValidUser,
} from '@shared/test/mockUsers';
import {
  getPendingItemsFromCase,
  getPetitionersFromCase,
  getRespondentsFromCase,
  getTransformedPendingItemDetails,
  initializeMinuteSheet,
  initializeTrialSessionMinuteSheetFormAction,
  transformFiledBy,
} from './initializeTrialSessionMinuteSheetFormAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { initialMinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { formatCase } from '@shared/business/utilities/getFormattedCaseDetail';
import { getFormattedTrialSessionDetails } from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';

jest.mock('@shared/business/utilities/getFormattedCaseDetail', () => ({
  formatCase: jest.fn(),
}));

jest.mock(
  '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails',
  () => ({
    getFormattedTrialSessionDetails: jest.fn(),
  }),
);

describe('initializeTrialSessionMinuteSheetFormAction', () => {
  it('should initialize the minute sheet form with all required sections', async () => {
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

    (getFormattedTrialSessionDetails as jest.Mock).mockReturnValue({
      courtReporter: mockTrialSession.courtReporter,
      isRemoteSession: false,
      judge: mockTrialSession.judge,
      trialClerk: mockTrialSession.trialClerk,
      formattedDocketEntries: [],
    });
    const { state } = await runAction(
      initializeTrialSessionMinuteSheetFormAction,
      {
        modules: { presenter },
        props: mockProps,
        state: { user: {} },
      },
    );

    expect(state.minuteSheetForm).toBeDefined();
    expect(state.minuteSheetForm.trialSessionMetadataSection).toBeDefined();
    expect(state.minuteSheetForm.caseMetadataSection).toBeDefined();
    expect(state.minuteSheetForm.petitionersSection).toBeDefined();
    expect(state.minuteSheetForm.respondentsSection).toBeDefined();
    expect(state.minuteSheetForm.motionsSection).toBeDefined();
    expect(state.minuteSheetForm.actionsAndFilingsSection).toBeDefined();
    expect(state.minuteSheetForm.witnessesSection).toBeDefined();
    expect(state.minuteSheetForm.exhibitsSection).toBeDefined();
  });
});

describe('initializeMinuteSheet', () => {
  const mockFormattedTrialSession = {
    caseOrder: [],
    entityName: 'TrialSession',
    hasNOTTBeenServed: false,
    isCalendared: false,
    judge: {
      name: 'Judge Smith',
      userId: '1',
    },
    maxCases: 100,
    paperServicePdfs: [],
    proceedingType: 'In Person' as TrialSessionProceedingType,
    sessionScope: 'Location-based' as TrialSessionScope,
    sessionStatus: 'Open',
    sessionType: SESSION_TYPES.regular,
    startDate: '2019-11-25T15:00:00.000Z',
    startTime: '10:00',
    term: 'Fall',
    termYear: '2019',
    trialLocation: 'Hartford, Connecticut',
    trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    city: 'Hartford',
    courtReporter: 'Test Court Reporter',
    estimatedEndDate: '2040-11-25T15:00:00.000Z',
    irsCalendarAdministrator: 'Test Calendar Admin',
    postalCode: '12345',
    state: 'CT',
    trialClerk: {
      name: 'Test Trial Clerk',
      userId: 'eeeba5a9-b37b-439d-9201-033ec6e335wb',
    },
    chambersPhoneNumber: '123-456-9088',
    calendaredCases: [], // satisfies TrialSessionState
    eligibleCases: [], // satisfies TrialSessionState
    allCases: [],
    formattedChambersPhoneNumber: '123-456-9088',
    formattedCity: 'Hartford,',
    formattedCityStateZip: 'Hartford, CT 12345',
    formattedCourtReporter: 'Test Court Reporter',
    formattedEstimatedEndDate: '11/25/40',
    formattedIrsCalendarAdministrator: 'Test Calendar Admin',
    formattedIrsCalendarAdministratorInfo: undefined,
    formattedJudge: 'Judge Smith',
    formattedStartDate: '11/25/19',
    formattedStartDateFull: 'November 25, 2019',
    formattedStartTime: '10:00 am',
    formattedTerm: 'Fall 19',
    formattedTrialClerk: 'Test Trial Clerk',
    inactiveCases: [],
    isRemoteSession: false,
    noLocationEntered: false,
    openCases: [],
    showSwingSession: false,
    zipName: 'November_25_2019-Hartford_Connecticut.zip',
  };

  (formatCase as jest.Mock).mockReturnValue({
    formattedDocketEntries: [],
  });

  it('should initialize trial session metadata correctly', () => {
    const result = initializeMinuteSheet({
      emptyMinuteSheet: initialMinuteSheetFormState,
      caseDetail: MOCK_CASE,
      formattedTrialSession: mockFormattedTrialSession,
      currentUser: { ...mockValidUser, email: 'test@example.com' },
      judgeOptions: {
        '1': {
          fullName: 'Judge Smith',
          title: 'Judge',
          userId: '1',
        },
      },
    });

    expect(result.trialSessionMetadataSection).toMatchObject({
      courtReporter: 'Test Court Reporter',
      judge: {
        fullName: 'Judge Smith',
        title: 'Judge',
        userId: '1',
      },
      remoteSession: false,
      trialClerk: 'Test Trial Clerk',
    });
  });

  it('should initialize trial session metadata with empty court reporter when trial session has no court reporter assigned', () => {
    const result = initializeMinuteSheet({
      emptyMinuteSheet: initialMinuteSheetFormState,
      caseDetail: MOCK_CASE,
      formattedTrialSession: {
        ...mockFormattedTrialSession,
        courtReporter: undefined,
      },
      currentUser: { ...mockValidUser, email: 'test@example.com' },
      judgeOptions: {
        '1': {
          fullName: 'Judge Smith',
          title: 'Judge',
          userId: '1',
        },
      },
    });

    expect(result.trialSessionMetadataSection).toMatchObject({
      courtReporter: '',
      judge: {
        fullName: 'Judge Smith',
        title: 'Judge',
        userId: '1',
      },
      remoteSession: false,
      trialClerk: 'Test Trial Clerk',
    });
  });

  it('should initialize recalled section with empty row', () => {
    const result = initializeMinuteSheet({
      emptyMinuteSheet: initialMinuteSheetFormState,
      caseDetail: MOCK_CASE,
      formattedTrialSession: mockFormattedTrialSession,
      currentUser: { ...mockValidUser, email: 'test@example.com' },
      judgeOptions: {
        '1': { fullName: 'Judge Smith', title: 'Judge', userId: '1' },
      },
    });

    const recalledEntries = Object.values(result.caseMetadataSection.recalled);
    expect(recalledEntries).toHaveLength(1);
    expect(recalledEntries[0]).toMatchObject({
      date: '',
      note: '',
      transcriptOrdered: false,
    });
  });

  it('should initialize motions section with empty row', () => {
    const result = initializeMinuteSheet({
      emptyMinuteSheet: initialMinuteSheetFormState,
      caseDetail: MOCK_CASE,
      formattedTrialSession: mockFormattedTrialSession,
      currentUser: { ...mockValidUser, email: 'test@example.com' },
      judgeOptions: {
        '1': { fullName: 'Judge Smith', title: 'Judge', userId: '1' },
      },
    });

    const motionEntries = Object.values(result.motionsSection.motions);
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
  });

  it('should initialize witnesses section with empty rows', () => {
    const result = initializeMinuteSheet({
      emptyMinuteSheet: initialMinuteSheetFormState,
      caseDetail: MOCK_CASE,
      formattedTrialSession: mockFormattedTrialSession,
      currentUser: { ...mockValidUser, email: 'test@example.com' },
      judgeOptions: {
        '1': { fullName: 'Judge Smith', title: 'Judge', userId: '1' },
      },
    });

    const petitionerWitnesses = Object.values(
      result.witnessesSection.petitionerWitnesses,
    );
    expect(petitionerWitnesses).toHaveLength(1);
    expect(petitionerWitnesses[0]).toMatchObject({
      name: '',
    });

    const respondentWitnesses = Object.values(
      result.witnessesSection.respondentWitnesses,
    );
    expect(respondentWitnesses).toHaveLength(1);
    expect(respondentWitnesses[0]).toMatchObject({
      name: '',
    });
  });

  it('should initialize exhibits section with empty row', () => {
    const result = initializeMinuteSheet({
      emptyMinuteSheet: initialMinuteSheetFormState,
      caseDetail: MOCK_CASE,
      formattedTrialSession: mockFormattedTrialSession,
      currentUser: { ...mockValidUser, email: 'test@example.com' },
      judgeOptions: {
        '1': { fullName: 'Judge Smith', title: 'Judge', userId: '1' },
      },
    });

    const exhibitEntries = Object.values(result.exhibitsSection.exhibits);
    expect(exhibitEntries).toHaveLength(1);
    expect(exhibitEntries[0]).toMatchObject({
      description: '',
      note: '',
      status: '',
    });
  });

  it('should initialize petitioners section correctly', () => {
    const result = initializeMinuteSheet({
      emptyMinuteSheet: initialMinuteSheetFormState,
      caseDetail: {
        ...MOCK_CASE,
        petitioners: [mockCasePetitioner],
        privatePractitioners: [],
      },
      formattedTrialSession: mockFormattedTrialSession,
      currentUser: { ...mockValidUser, email: 'test@example.com' },
      judgeOptions: {
        '1': { fullName: 'Judge Smith', title: 'Judge', userId: '1' },
      },
    });

    const petitionerEntries = Object.values(
      result.petitionersSection.petitioners,
    );
    expect(petitionerEntries).toHaveLength(1);
    expect(petitionerEntries[0]).toMatchObject({
      name: mockCasePetitioner.name,
      role: PETITIONER_ROLE_OPTIONS_INVERTED[PETITIONER_ROLE_OPTIONS.other],
      datesOfAppearance: '',
    });
  });

  it('should initialize respondents section correctly', () => {
    const result = initializeMinuteSheet({
      emptyMinuteSheet: initialMinuteSheetFormState,
      caseDetail: {
        ...MOCK_CASE,
        irsPractitioners: [{ name: 'IRS Attorney' }],
      },
      formattedTrialSession: mockFormattedTrialSession,
      currentUser: { ...mockValidUser, email: 'test@example.com' },
      judgeOptions: {
        '1': { fullName: 'Judge Smith', title: 'Judge', userId: '1' },
      },
    });

    const respondentEntries = Object.values(
      result.respondentsSection.respondents,
    );
    expect(respondentEntries).toHaveLength(1);
    expect(respondentEntries[0]).toMatchObject({
      name: 'IRS Attorney',
      datesOfAppearance: '',
    });
  });
});

describe('getTransformedPendingItemDetails', () => {
  it('should not specify an objection type if the pending item has no objection data', () => {
    const result = getTransformedPendingItemDetails({
      documentType: 'Order to Show Cause',
      eventCode: 'OSC',
    });
    expect(result).toEqual({
      description: 'Order to Show Cause',
      documentType: 'OSC',
      objection: '',
    });
  });

  it('should specify an objection type if the pending item has objection data', () => {
    const result = getTransformedPendingItemDetails({
      documentType: 'Motion for Continuance',
      eventCode: 'M006',
      objections: OBJECTIONS_OPTIONS_MAP.YES,
    });
    expect(result).toEqual({
      description: 'Motion for Continuance',
      documentType: 'M006',
      objection:
        MOTION_OBJECTION_OPTIONS_INVERTED[MOTION_OBJECTION_OPTIONS.objection],
    });
  });
});

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

    it('should give petitioners a pro se role when they have no counsel', () => {
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
        role: PETITIONER_ROLE_OPTIONS_INVERTED[PETITIONER_ROLE_OPTIONS.proSe],
      });
    });

    it('should give list private practitioner names with counsel role and not the petitioner name when a petitioner has representation', () => {
      const result = getPetitionersFromCase({
        petitioners: [
          {
            contactId: '123',
            contactType: CONTACT_TYPES.petitioner,
            name: 'Test Petitioner',
          },
        ],
        privatePractitioners: [{ name: 'Lawyer X', representing: ['123'] }],
      } as any);

      const entries = Object.values(result);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        name: 'Lawyer X',
        role: PETITIONER_ROLE_OPTIONS_INVERTED[PETITIONER_ROLE_OPTIONS.counsel],
      });
    });

    it('should give petitioners an other role when contact type is not one of the available form options', () => {
      const result = getPetitionersFromCase({
        petitioners: [
          {
            contactId: '123',
            contactType: 'Super Petitioner',
            name: 'Test Petitioner',
          },
        ],
        privatePractitioners: [],
      } as any);

      const entries = Object.values(result);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        name: 'Test Petitioner',
        role: PETITIONER_ROLE_OPTIONS_INVERTED[PETITIONER_ROLE_OPTIONS.other],
      });
    });

    it('should give petitioners a intervenor role when contact type is intervenor', () => {
      const result = getPetitionersFromCase({
        petitioners: [
          {
            contactId: '123',
            contactType: CONTACT_TYPES.intervenor,
            name: 'Test Petitioner',
          },
        ],
        privatePractitioners: [],
      } as any);

      const entries = Object.values(result);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        name: 'Test Petitioner',
        role: PETITIONER_ROLE_OPTIONS_INVERTED[
          PETITIONER_ROLE_OPTIONS.intervenor
        ],
      });
    });

    it('should not include an intervenor party when they have representation', () => {
      const result = getPetitionersFromCase({
        petitioners: [
          {
            contactId: '123',
            contactType: CONTACT_TYPES.intervenor,
            name: 'Test Petitioner',
          },
        ],
        privatePractitioners: [
          { name: 'Practitioner X', representing: ['123'] },
        ],
      } as any);

      const entries = Object.values(result);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        name: 'Practitioner X',
        role: PETITIONER_ROLE_OPTIONS_INVERTED[PETITIONER_ROLE_OPTIONS.counsel],
      });
    });

    it('should handle an undefined privatePractitioners property as if no petitioner has representation', () => {
      const result = getPetitionersFromCase({
        petitioners: [
          {
            contactId: '123',
            contactType: CONTACT_TYPES.petitioner,
            name: 'Test Petitioner',
          },
        ],
      } as any);

      const entries = Object.values(result);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        name: 'Test Petitioner',
        role: PETITIONER_ROLE_OPTIONS_INVERTED[PETITIONER_ROLE_OPTIONS.proSe],
      });
    });
  });

  describe('transformFiledBy', () => {
    let MOCK_DOCKET_ENTRY;

    beforeEach(() => {
      MOCK_DOCKET_ENTRY = MOCK_CASE.docketEntries[0];
    });

    it('should return "petitioner" when filed by petitioner only', () => {
      const result = transformFiledBy({
        ...MOCK_DOCKET_ENTRY,
        filedBy: 'Petr. Bob',
      });
      expect(result).toBe('petitioner');
    });

    it('should return "petitioner" when filed by multiple petitioners', () => {
      const result = transformFiledBy({
        ...MOCK_DOCKET_ENTRY,
        filedBy: 'Petrs. Bob & Bill',
      });
      expect(result).toBe('petitioner');
    });

    it('should return "respondent" when filed by respondent only', () => {
      const result = transformFiledBy({
        ...MOCK_DOCKET_ENTRY,
        filedBy: 'Resp.',
      });
      expect(result).toBe('respondent');
    });

    it('should return "joint" when filed by both', () => {
      const result = transformFiledBy({
        ...MOCK_DOCKET_ENTRY,
        filedBy: 'Resp. & Petr. Bob',
      });
      expect(result).toBe('joint');
    });

    it('should return "other" when filed by an intervenor', () => {
      const result = transformFiledBy({
        ...MOCK_DOCKET_ENTRY,
        filedBy: 'Intv. Alice',
      });
      expect(result).toBe('other');
    });

    it('should return "court" when the pending item is an order', () => {
      const result = transformFiledBy({
        ...MOCK_DOCKET_ENTRY,
        eventCode: 'O',
      });
      expect(result).toBe('court');
    });

    it('should return "other" when filed by multiple intervenors', () => {
      const result = transformFiledBy({
        ...MOCK_DOCKET_ENTRY,
        filedBy: 'Intvs. Alice & Bob',
      });
      expect(result).toBe('other');
    });

    it('should return "other" when filed by both an intervenor and a petitioner', () => {
      const result = transformFiledBy({
        ...MOCK_DOCKET_ENTRY,
        filedBy: 'Petr. Bob & Intv. Alice',
      });
      expect(result).toBe('other');
    });

    it('should return "practitioner" when filed by a private practitioner', () => {
      const result = transformFiledBy({
        ...MOCK_DOCKET_ENTRY,
        filedBy: 'Bob the Private Practitioner',
        privatePractitioners: [{ name: 'Bob' }],
      });
      expect(result).toBe('practitioner');
    });

    it('should return "other" when filedBy is not defined', () => {
      const result = transformFiledBy({
        ...MOCK_DOCKET_ENTRY,
        filedBy: undefined,
      });
      expect(result).toBe('other');
    });
  });

  describe('getPendingItemsFromCase', () => {
    beforeEach(() => {
      (formatCase as jest.Mock).mockClear();
    });

    it('should transform pending items into action filing entries', () => {
      (formatCase as jest.Mock).mockReturnValue({
        formattedDocketEntries: [
          {
            createdAt: '2018-11-21T05:00:00.000Z',
            documentType: 'Tax Court Report Pamphlet',
            eventCode: 'TCRP',
            isUnservable: true,
            filedBy: 'Petr. Bob',
            filers: ['pet1'],
            pending: true,
          },
        ],
      });

      const result = getPendingItemsFromCase({
        caseDetail: MOCK_CASE,
        user: {},
      });

      const entries = Object.values(result);
      expect(entries).toHaveLength(2); // One pending item + one empty row
      expect(entries[0]).toMatchObject({
        date: '11/21/2018',
      });
      expect(entries[1]).toMatchObject({
        date: '',
      });
    });

    it('should return only an empty row if there are no pending items', () => {
      (formatCase as jest.Mock).mockReturnValue({
        formattedDocketEntries: [],
      });

      const result = getPendingItemsFromCase({
        caseDetail: { ...MOCK_CASE, docketEntries: [] },
        user: {},
      });

      const entries = Object.values(result);
      expect(entries).toHaveLength(1); // One empty row
      expect(entries[0]).toMatchObject({
        date: '',
        documentType: '',
        filedBy: '',
        note: '',
        objection: '',
        oralMotion: false,
        status: '',
      });
    });
  });
});
