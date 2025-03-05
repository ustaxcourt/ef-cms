import {
  ACTION_DOCUMENT_TYPE_OPTIONS,
  ACTION_DOCUMENT_TYPE_OPTIONS_INVERTED,
  CONTACT_TYPES,
  MOTION_OBJECTION_OPTIONS,
  MOTION_OBJECTION_OPTIONS_INVERTED,
  OBJECTIONS_OPTIONS_MAP,
  PETITIONER_ROLE_OPTIONS,
  PETITIONER_ROLE_OPTIONS_INVERTED,
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
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { getFormattedTrialSessionDetails } from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';

jest.mock('@shared/business/utilities/getFormattedCaseDetail', () => ({
  formatCase: jest.fn(),
}));

jest.mock('@shared/business/entities/DocketEntry', () => ({
  DocketEntry: {
    isPending: jest.fn(),
    isNotice: jest.fn(),
    isOrder: jest.fn(),
    isMotion: jest.fn(),
  },
}));

const mockIsNotice = DocketEntry.isNotice as jest.Mock;
const mockIsOrder = DocketEntry.isOrder as jest.Mock;
const mockIsMotion = DocketEntry.isMotion as jest.Mock;

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
    sessionType: 'Regular',
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
  beforeEach(() => {
    mockIsNotice.mockReturnValue(false);
    mockIsOrder.mockReturnValue(false);
    mockIsMotion.mockReturnValue(false);
  });

  it('should return the matching option when documentType directly matches an option value', () => {
    mockIsOrder.mockReturnValue(true);
    const result = getTransformedPendingItemDetails({
      documentType: 'Order to Show Cause',
      eventCode: 'OSC',
    });
    expect(result).toEqual({
      description: '',
      documentType:
        ACTION_DOCUMENT_TYPE_OPTIONS_INVERTED[
          ACTION_DOCUMENT_TYPE_OPTIONS.orderToShowCause
        ],
      objection: '',
    });
  });

  it('should identify and return "notice" category and description for notice documents by eventCode', () => {
    mockIsNotice.mockReturnValue(true);
    const result = getTransformedPendingItemDetails({
      documentType: '30-Day Notice of Trial',
      eventCode: 'NOTT',
    });
    expect(result).toEqual({
      description: '30-Day Notice of Trial',
      documentType:
        ACTION_DOCUMENT_TYPE_OPTIONS_INVERTED[
          ACTION_DOCUMENT_TYPE_OPTIONS.notice
        ],
      objection: '',
    });
  });

  it('should identify and return "order" category and description for order documents by eventCode', () => {
    mockIsOrder.mockReturnValue(true);
    const result = getTransformedPendingItemDetails({
      documentType: 'Order that caption of case is amended',
      eventCode: 'OCA',
    });
    expect(result).toEqual({
      description: 'Order that caption of case is amended',
      documentType:
        ACTION_DOCUMENT_TYPE_OPTIONS_INVERTED[
          ACTION_DOCUMENT_TYPE_OPTIONS.order
        ],
      objection: '',
    });
  });

  it('should identify and return "motion" category and description for motion documents by eventCode', () => {
    mockIsMotion.mockReturnValue(true);
    const result = getTransformedPendingItemDetails({
      documentType: 'Motion for a New Trial',
      eventCode: 'M218',
    });
    expect(result).toEqual({
      description: 'Motion for a New Trial',
      documentType:
        ACTION_DOCUMENT_TYPE_OPTIONS_INVERTED[
          ACTION_DOCUMENT_TYPE_OPTIONS.motion
        ],
      objection: 'unknown',
    });
  });

  it('should identify and return "motion" category and description for motion documents by eventCode, with unknown objection', () => {
    mockIsMotion.mockReturnValue(true);
    const result = getTransformedPendingItemDetails({
      documentType: 'Motion for a New Trial',
      eventCode: 'M218',
      objections: 'unknown',
    });
    expect(result).toEqual({
      description: 'Motion for a New Trial',
      documentType:
        ACTION_DOCUMENT_TYPE_OPTIONS_INVERTED[
          ACTION_DOCUMENT_TYPE_OPTIONS.motion
        ],
      objection: 'unknown',
    });
  });

  it('should identify and return "motion" category and description for motion documents by eventCode, with no objection', () => {
    mockIsMotion.mockReturnValue(true);
    const result = getTransformedPendingItemDetails({
      documentType: 'Motion for a New Trial',
      eventCode: 'M218',
      objections: OBJECTIONS_OPTIONS_MAP.NO,
    });
    expect(result).toEqual({
      description: 'Motion for a New Trial',
      documentType:
        ACTION_DOCUMENT_TYPE_OPTIONS_INVERTED[
          ACTION_DOCUMENT_TYPE_OPTIONS.motion
        ],
      objection:
        MOTION_OBJECTION_OPTIONS_INVERTED[MOTION_OBJECTION_OPTIONS.noObjection],
    });
  });

  it('should identify and return "motion" category and description for motion documents by eventCode, with objection', () => {
    mockIsMotion.mockReturnValue(true);
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

    it('should return "court" when the pending item is an order', () => {
      (DocketEntry.isOrder as jest.Mock).mockReturnValue(true);
      const result = transformFiledBy(mockCase, {
        filers: ['unknown'],
        eventCode: 'O',
      });
      expect(result).toBe('court');
    });
  });

  describe('getPendingItemsFromCase', () => {
    it('should transform pending items into action filing entries', () => {
      (formatCase as jest.Mock).mockReturnValue({
        formattedDocketEntries: [
          {
            createdAt: '2018-11-21T05:00:00.000Z',
            documentType: 'Motion',
            filers: ['pet1'],
          },
        ],
      });
      (DocketEntry.isPending as jest.Mock).mockReturnValue(true);

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

    it('should return only an empty row if there are no pending items', () => {
      (DocketEntry.isPending as jest.Mock).mockReturnValue(false);
      const result = getPendingItemsFromCase({
        caseDetail: MOCK_CASE,
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
