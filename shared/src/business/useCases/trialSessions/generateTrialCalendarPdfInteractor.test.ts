import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateTrialCalendarPdfInteractor } from './generateTrialCalendarPdfInteractor';
import {
  irsPractitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';

describe('generateTrialCalendarPdfInteractor', () => {
  // deliberately *not* automatically sorted by docket number for test purposes
  const mockCases: (RawCase & TCaseOrder)[] = [
    {
      ...MOCK_CASE,
      calendarNotes: 'this is a test',
      docketNumber: '102-19',
      docketNumberWithSuffix: '102-19W',
      irsPractitioners: [irsPractitionerUser],
      privatePractitioners: [privatePractitionerUser],
    },
    {
      ...MOCK_CASE,
      docketNumber: '24529-22',
      docketNumberWithSuffix: '24529-22',
      leadDocketNumber: '34189-21',
    },
    {
      ...MOCK_CASE,
      docketNumber: '8904-22',
      docketNumberWithSuffix: '8904-22',
    },
    {
      ...MOCK_CASE,
      docketNumber: '18072-22',
      docketNumberWithSuffix: '18072-22',
      leadDocketNumber: '34189-21',
    },
    {
      ...MOCK_CASE,
      docketNumber: '101-18',
      docketNumberWithSuffix: '101-18',
    },
    {
      ...MOCK_CASE,
      docketNumber: '123-20',
      docketNumberWithSuffix: '123-20W',
      removedFromTrial: true,
    },
    {
      ...MOCK_CASE,
      docketNumber: '34189-21',
      docketNumberWithSuffix: '34189-21',
      leadDocketNumber: '34189-21',
    },
    {
      ...MOCK_CASE,
      docketNumber: '555-13',
      docketNumberWithSuffix: '555-13',
      leadDocketNumber: '234-12',
    },
  ];

  const mockPdfUrl = { url: 'www.example.com' };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_INPERSON);

    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue(mockCases);

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

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .getCalendaredCasesForTrialSession,
    ).toHaveBeenCalled();
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
          courtReporter: 'Not assigned',
          courthouseName: MOCK_TRIAL_INPERSON.courthouseName,
          formattedCityStateZip: 'Scottsburg, IN 47130',
          irsCalendarAdministrator: 'Not assigned',
          judge: MOCK_TRIAL_INPERSON.judge!.name,
          noLocationEntered: false,
          notes: MOCK_TRIAL_INPERSON.notes,
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

  it('should generate the trial session information pdf using new IrsCalendarAdministratorInfo and return the url to access it', async () => {
    const irsCalendarAdministratorInfo = {
      email: 'TEST_EMAIL',
      name: 'TEST_NAME',
      phone: 'TEST_PHONE',
    };

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...MOCK_TRIAL_INPERSON,
        irsCalendarAdministratorInfo,
      });

    const result = await generateTrialCalendarPdfInteractor(
      applicationContext,
      {
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
      },
    );

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .getCalendaredCasesForTrialSession,
    ).toHaveBeenCalled();
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
          courtReporter: 'Not assigned',
          courthouseName: MOCK_TRIAL_INPERSON.courthouseName,
          formattedCityStateZip: 'Scottsburg, IN 47130',
          irsCalendarAdministrator: `${irsCalendarAdministratorInfo.name}\n${irsCalendarAdministratorInfo.email}\n${irsCalendarAdministratorInfo.phone}`,
          judge: MOCK_TRIAL_INPERSON.judge!.name,
          noLocationEntered: false,
          notes: MOCK_TRIAL_INPERSON.notes,
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
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
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
});
