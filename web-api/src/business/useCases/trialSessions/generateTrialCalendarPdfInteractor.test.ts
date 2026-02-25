import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateTrialCalendarPdfInteractor } from './generateTrialCalendarPdfInteractor';
import {
  irsPractitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import {
  getCalendaredCasesForTrialSession as getCalendaredCasesForTrialSessionMock,
  RawCaseAndCaseOrder,
} from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

describe('generateTrialCalendarPdfInteractor', () => {
  const getCalendaredCasesForTrialSession = jest.mocked(
    getCalendaredCasesForTrialSessionMock,
  );
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);

  // deliberately *not* automatically sorted by docket number for test purposes
  const mockCases: RawCaseAndCaseOrder[] = [
    {
      ...MOCK_CASE,
      calendarNotes: 'this is a test',
      docketNumber: '102-19',
      docketNumberWithSuffix: '102-19W',
      irsPractitioners: [irsPractitionerUser],
      privatePractitioners: [privatePractitionerUser],
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    },
    {
      ...MOCK_CASE,
      docketNumber: '24529-22',
      docketNumberWithSuffix: '24529-22',
      leadDocketNumber: '34189-21',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    },
    {
      ...MOCK_CASE,
      docketNumber: '8904-22',
      docketNumberWithSuffix: '8904-22',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    },
    {
      ...MOCK_CASE,
      docketNumber: '18072-22',
      docketNumberWithSuffix: '18072-22',
      leadDocketNumber: '34189-21',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    },
    {
      ...MOCK_CASE,
      docketNumber: '101-18',
      docketNumberWithSuffix: '101-18',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    },
    {
      ...MOCK_CASE,
      docketNumber: '123-20',
      docketNumberWithSuffix: '123-20W',
      removedFromTrial: true,
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
    },
    {
      ...MOCK_CASE,
      docketNumber: '34189-21',
      docketNumberWithSuffix: '34189-21',
      leadDocketNumber: '34189-21',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    },
    {
      ...MOCK_CASE,
      docketNumber: '555-13',
      docketNumberWithSuffix: '555-13',
      leadDocketNumber: '234-12',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    },
  ];

  const mockPdfUrl = { url: 'www.example.com' };

  beforeEach(() => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_INPERSON,
      chambersPhoneNumber: '1234567890',
      irsCalendarAdministratorInfo: {
        email: 'emailbond@me.com',
        name: 'James Bond',
        phone: '1234567890',
      },
      joinPhoneNumber: '1234567890',
      meetingId: 'meetingid',
      password: 'pass1',
    });

    getCalendaredCasesForTrialSession.mockResolvedValue(mockCases);

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue(mockPdfUrl);
  });

  it('should generate the trial session information pdf and return the url to access it', async () => {
    const result = await generateTrialCalendarPdfInteractor(
      applicationContext,
      {
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      },
    );

    expect(getTrialSessionById).toHaveBeenCalled();
    expect(getCalendaredCasesForTrialSession).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().trialCalendar,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      data: {
        cases: [
          {
            calendarNotes: undefined,
            caseTitle: 'Test Petitioner',
            docketNumber: '555-13',
            docketNumberWithSuffix: '555-13',
            inConsolidatedGroup: true,
            isLeadCase: false,
            petitionerCounsel: [],
            respondentCounsel: [],
            shouldIndent: false,
          },
          {
            calendarNotes: undefined,
            caseTitle: 'Test Petitioner',
            docketNumber: '101-18',
            docketNumberWithSuffix: '101-18',
            inConsolidatedGroup: false,
            isLeadCase: false,
            petitionerCounsel: [],
            respondentCounsel: [],
            shouldIndent: false,
          },
          {
            calendarNotes: 'this is a test',
            caseTitle: 'Test Petitioner',
            docketNumber: '102-19',
            docketNumberWithSuffix: '102-19W',
            inConsolidatedGroup: false,
            isLeadCase: false,
            petitionerCounsel: ['Private Practitioner (BN1234)'],
            respondentCounsel: ['IRS Practitioner (BN2345)'],
            shouldIndent: false,
          },
          {
            calendarNotes: undefined,
            caseTitle: 'Test Petitioner',
            docketNumber: '34189-21',
            docketNumberWithSuffix: '34189-21',
            inConsolidatedGroup: true,
            isLeadCase: true,
            petitionerCounsel: [],
            respondentCounsel: [],
            shouldIndent: false,
          },
          {
            calendarNotes: undefined,
            caseTitle: 'Test Petitioner',
            docketNumber: '18072-22',
            docketNumberWithSuffix: '18072-22',
            inConsolidatedGroup: true,
            isLeadCase: false,
            petitionerCounsel: [],
            respondentCounsel: [],
            shouldIndent: true,
          },
          {
            calendarNotes: undefined,
            caseTitle: 'Test Petitioner',
            docketNumber: '24529-22',
            docketNumberWithSuffix: '24529-22',
            inConsolidatedGroup: true,
            isLeadCase: false,
            petitionerCounsel: [],
            respondentCounsel: [],
            shouldIndent: true,
          },
          {
            calendarNotes: undefined,
            caseTitle: 'Test Petitioner',
            docketNumber: '8904-22',
            docketNumberWithSuffix: '8904-22',
            inConsolidatedGroup: false,
            isLeadCase: false,
            petitionerCounsel: [],
            respondentCounsel: [],
            shouldIndent: false,
          },
        ],
        sessionDetail: {
          address1: MOCK_TRIAL_INPERSON.address1,
          address2: MOCK_TRIAL_INPERSON.address2,
          chambersPhoneNumber: '1234567890',
          courtReporter: 'Not assigned',
          courthouseName: MOCK_TRIAL_INPERSON.courthouseName,
          formattedCityStateZip: 'Scottsburg, IN 47130',
          irsCalendarAdministrator: 'Not assigned',
          irsCalendarAdministratorInfo: {
            email: 'emailbond@me.com',
            name: 'James Bond',
            phone: '1234567890',
          },
          joinPhoneNumber: '1234567890',
          judge: MOCK_TRIAL_INPERSON.judge!.name,
          meetingId: 'meetingid',
          notes: MOCK_TRIAL_INPERSON.notes,
          password: 'pass1',
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
          sessionType: MOCK_TRIAL_INPERSON.sessionType,
          startDate: 'February 28, 3000',
          startTime: undefined,
          trialClerk: 'Not assigned',
          trialLocation: MOCK_TRIAL_INPERSON.trialLocation,
        },
      },
    });
    expect(result.url).toBe(mockPdfUrl.url);
  });

  it('should NOT include cases that have been removed from trial on the generated PDF', async () => {
    await generateTrialCalendarPdfInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
    });

    const casesOnPDF =
      applicationContext.getDocumentGenerators().trialCalendar.mock.calls[0][0]
        .data.cases;
    const mockRemovedFromTrialCase = mockCases.find(m => m.removedFromTrial);
    expect(mockRemovedFromTrialCase).toBeTruthy(); // there is a case in the mocks which is removed from trial
    expect(
      casesOnPDF.find(
        m => m.docketNumber === mockRemovedFromTrialCase!.docketNumber,
      ),
    ).toBeFalsy();
  });

  it('should format trial session start time when it has been set', async () => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_INPERSON,
      startTime: '15:00',
    });

    await generateTrialCalendarPdfInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
    });

    const formattedTrialSession =
      applicationContext.getDocumentGenerators().trialCalendar.mock.calls[0][0]
        .data.sessionDetail;
    expect(formattedTrialSession.startTime).toBe('3:00 pm');
  });

  it('should throw a NotFoundError when the trial session is not found', async () => {
    getTrialSessionById.mockResolvedValue(undefined as any);

    await expect(
      generateTrialCalendarPdfInteractor(applicationContext, {
        trialSessionId: 'nonexistent-id',
      }),
    ).rejects.toThrow('was not found');
  });

  it('should format AM start time correctly', async () => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_INPERSON,
      startTime: '10:00',
    });

    await generateTrialCalendarPdfInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
    });

    const formattedTrialSession =
      applicationContext.getDocumentGenerators().trialCalendar.mock.calls[0][0]
        .data.sessionDetail;
    expect(formattedTrialSession.startTime).toBe('10:00 am');
  });

  it('should use fallback values for courtReporter, irsCalendarAdministrator, judge, and trialClerk when not assigned', async () => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_INPERSON,
      courtReporter: undefined,
      irsCalendarAdministrator: undefined,
      judge: undefined,
      trialClerk: undefined,
      alternateTrialClerkName: undefined,
    });

    await generateTrialCalendarPdfInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
    });

    const sessionDetail =
      applicationContext.getDocumentGenerators().trialCalendar.mock.calls[0][0]
        .data.sessionDetail;
    expect(sessionDetail.courtReporter).toBe('Not assigned');
    expect(sessionDetail.irsCalendarAdministrator).toBe('Not assigned');
    expect(sessionDetail.judge).toBe('Not assigned');
    expect(sessionDetail.trialClerk).toBe('Not assigned');
  });

  it('should use alternateTrialClerkName when trialClerk is not assigned but alternateTrialClerkName is set', async () => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_INPERSON,
      trialClerk: undefined,
      alternateTrialClerkName: 'Alternate Clerk',
    });

    await generateTrialCalendarPdfInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
    });

    const sessionDetail =
      applicationContext.getDocumentGenerators().trialCalendar.mock.calls[0][0]
        .data.sessionDetail;
    expect(sessionDetail.trialClerk).toBe('Alternate Clerk');
  });

  it('should handle trial session without city', async () => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_INPERSON,
      city: undefined,
    });

    await generateTrialCalendarPdfInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
    });

    const sessionDetail =
      applicationContext.getDocumentGenerators().trialCalendar.mock.calls[0][0]
        .data.sessionDetail;
    expect(sessionDetail.formattedCityStateZip).not.toContain(',');
  });

  it('should format 12:00 start time as pm', async () => {
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_INPERSON,
      startTime: '12:00',
    });

    await generateTrialCalendarPdfInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
    });

    const formattedTrialSession =
      applicationContext.getDocumentGenerators().trialCalendar.mock.calls[0][0]
        .data.sessionDetail;
    expect(formattedTrialSession.startTime).toBe('12:00 pm');
  });
});
