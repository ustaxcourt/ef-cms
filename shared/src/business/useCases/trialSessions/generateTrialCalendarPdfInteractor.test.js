const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateTrialCalendarPdfInteractor,
} = require('./generateTrialCalendarPdfInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { US_STATES } = require('../../entities/EntityConstants');

describe('generateTrialCalendarPdfInteractor', () => {
  const mockPdfUrl = { url: 'www.example.com' };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([
        {
          ...MOCK_CASE,
          docketNumber: '101-18',
          docketNumberWithSuffix: '101-18',
        },
        {
          ...MOCK_CASE,
          docketNumber: '102-19',
          docketNumberWithSuffix: '102-19W',
        },
        {
          ...MOCK_CASE,
          docketNumber: '123-20',
          docketNumberWithSuffix: '123-20W',
          removedFromTrial: true,
        },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue(mockPdfUrl);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        address1: '123 Some Street',
        address2: 'Suite B',
        caseOrder: [
          { calendarNotes: 'Calendar notes.', docketNumber: '123-20' },
        ],
        city: US_STATES.NY,
        courtReporter: 'Lois Lane',
        courthouseName: 'Test Courthouse',
        irsCalendarAdministrator: 'iCalRS Admin',
        judge: { name: 'Joseph Dredd' },
        notes:
          'The one with the velour shirt is definitely looking at me funny.',
        sessionType: 'Hybrid',
        startDate: '2019-12-02T05:00:00.000Z',
        startTime: '09:00',
        state: 'NY',
        term: 'Fall',
        termYear: '2019',
        trialClerk: 'Clerky McGee',
        trialLocation: 'New York City, New York',
        zip: '10108',
      });
  });

  it('should find the cases for a trial session successfully', async () => {
    await expect(
      generateTrialCalendarPdfInteractor({
        applicationContext,
        content: {
          trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById.mock.calls
        .length,
    ).toBe(1);
    expect(
      applicationContext.getPersistenceGateway()
        .getCalendaredCasesForTrialSession.mock.calls.length,
    ).toBe(1);
    expect(
      applicationContext.getUtilities().formattedTrialSessionDetails.mock.calls
        .length,
    ).toBe(1);
    expect(
      applicationContext.getDocumentGenerators().trialCalendar.mock.calls
        .length,
    ).toBe(1);
    expect(
      applicationContext.getDocumentGenerators().trialCalendar,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          cases: expect.arrayContaining([
            expect.objectContaining({
              docketNumber: '101-18',
            }),
            expect.objectContaining({
              docketNumber: '102-19',
            }),
            expect.not.objectContaining({
              docketNumber: '123-20',
            }),
          ]),
        }),
      }),
    );
  });

  it('should return the trial session calendar pdf url', async () => {
    const result = await generateTrialCalendarPdfInteractor({
      applicationContext,
      content: {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    expect(result.url).toBe(mockPdfUrl.url);
  });

  it('should set calendarNotes for each case in trialSession.caseOrder when the case has calendarNotes', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        address1: '123 Some Street',
        address2: 'Suite B',
        caseOrder: [
          { calendarNotes: 'this is a test', docketNumber: '102-19' },
        ],
        city: US_STATES.NY,
        courtReporter: 'Lois Lane',
        courthouseName: 'Test Courthouse',
        irsCalendarAdministrator: 'iCalRS Admin',
        judge: { name: 'Joseph Dredd' },
        notes:
          'The one with the velour shirt is definitely looking at me funny.',
        sessionType: 'Hybrid',
        startDate: '2019-12-02T05:00:00.000Z',
        startTime: '09:00',
        state: 'NY',
        term: 'Fall',
        termYear: '2019',
        trialClerk: 'Clerky McGee',
        trialLocation: 'New York City, New York',
        zip: '10108',
      });

    await generateTrialCalendarPdfInteractor({
      applicationContext,
      content: {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    const caseWithCalendarNotes = applicationContext
      .getDocumentGenerators()
      .trialCalendar.mock.calls[0][0].data.cases.find(
        c => c.docketNumber === '102-19',
      );
    expect(caseWithCalendarNotes.calendarNotes).toBe('this is a test');
  });
});
