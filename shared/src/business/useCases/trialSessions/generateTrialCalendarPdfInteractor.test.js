const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateTrialCalendarPdfInteractor,
} = require('./generateTrialCalendarPdfInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('generateTrialCalendarPdfInteractor', () => {
  const mockPdfUrl = { url: 'www.example.com' };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([
        MOCK_CASE,
        MOCK_CASE,
        MOCK_CASE,
      ]);

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue(mockPdfUrl);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        address1: '123 Some Street',
        address2: 'Suite B',
        city: 'New York',
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
});
