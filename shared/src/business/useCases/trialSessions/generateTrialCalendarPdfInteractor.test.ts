import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  formatCases,
  generateTrialCalendarPdfInteractor,
  getPractitionerName,
} from './generateTrialCalendarPdfInteractor';
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
      docketNumber: '150-19',
      docketNumberWithSuffix: '150-19',
      leadDocketNumber: '150-19',
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

  it('should generate the trial session calendar pdf including open cases', async () => {
    await generateTrialCalendarPdfInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
    });

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
            docketNumber: '101-18',
            docketNumberWithSuffix: '101-18',
            inConsolidatedGroup: false,
            isLeadCase: false,
            petitionerCounsel: [],
            respondentCounsel: [],
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
          },
          {
            calendarNotes: undefined,
            caseTitle: 'Test Petitioner',
            docketNumber: '150-19',
            docketNumberWithSuffix: '150-19',
            inConsolidatedGroup: true,
            isLeadCase: true,
            petitionerCounsel: [],
            respondentCounsel: [],
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
  });

  it('should return the trial session calendar pdf url', async () => {
    const result = await generateTrialCalendarPdfInteractor(
      applicationContext,
      {
        trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
      },
    );

    expect(result.url).toBe(mockPdfUrl.url);
  });

  it('should set calendarNotes for each case in trialSession.caseOrder when the case has calendarNotes', async () => {
    await generateTrialCalendarPdfInteractor(applicationContext, {
      trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId!,
    });

    const caseWithCalendarNotes = applicationContext
      .getDocumentGenerators()
      .trialCalendar.mock.calls[0][0].data.cases.find(
        c => c.docketNumber === '102-19',
      );
    expect(caseWithCalendarNotes.calendarNotes).toBe('this is a test');
  });

  describe('format cases', () => {
    it('should filter out cases that have been removed from trial', () => {
      const result = formatCases({
        applicationContext,
        calendaredCases: mockCases,
      });

      expect(mockCases.find(m => m.removedFromTrial)).toBeTruthy(); // there is a case in the mocks which is removed from trial
      expect(result.find(m => m.docketNumber === '123-20')).toBeFalsy();
    });

    it('should sort cases by ascending docket number', () => {
      const result = formatCases({
        applicationContext,
        calendaredCases: mockCases,
      });

      expect(result[0].docketNumber).toBe('101-18');
      expect(result[1].docketNumber).toBe('102-19');
    });

    it('should set casse title to an empty string when caseCaption is undefined', () => {
      const result = formatCases({
        applicationContext,
        calendaredCases: [{ ...mockCases[0], caseCaption: undefined }],
      });

      expect(result[0].caseTitle).toBe('');
    });

    it('should format practitioner name + barNumber', () => {
      const result = formatCases({
        applicationContext,
        calendaredCases: mockCases,
      });

      expect(result[1].petitionerCounsel[0]).toBe(
        'Private Practitioner (BN1234)',
      );
      expect(result[1].respondentCounsel[0]).toBe('IRS Practitioner (BN2345)');
    });
  });

  describe('getPractitionerName', () => {
    it('should return the name and bar number of the practitioner as one string', () => {
      const result = getPractitionerName({
        barNumber: '123',
        name: 'Prac',
      });

      expect(result).toEqual('Prac (123)');
    });

    it('should return the name of the practitioner when bar number is undefined', () => {
      const result = getPractitionerName({
        barNumber: undefined,
        name: 'Prac',
      });

      expect(result).toEqual('Prac');
    });
  });
});
