const {
  generateTrialCalendarPdfInteractor,
} = require('./generateTrialCalendarPdfInteractor');

const getCalendaredCasesForTrialSessionStub = jest
    .fn()
    .mockReturnValue(['case1', 'case2', 'case3']),
  getTrialSessionByIdStub = jest.fn(),
  generatePdfFromHtmlInteractorStub = jest.fn(),
  generateTrialCalendarTemplateStub = jest.fn(),
  formattedTrialSessionDetailsStub = jest.fn(),
  getFormattedCaseDetailStub = jest.fn();

describe('generateTrialCalendarPdfInteractor', () => {
  const applicationContext = {
    getPersistenceGateway: () => ({
      getCalendaredCasesForTrialSession: getCalendaredCasesForTrialSessionStub,
      getTrialSessionById: getTrialSessionByIdStub,
    }),
    getTemplateGenerators: () => ({
      generateTrialCalendarTemplate: generateTrialCalendarTemplateStub,
    }),
    getUseCases: () => ({
      generatePdfFromHtmlInteractor: generatePdfFromHtmlInteractorStub,
    }),
    getUtilities: () => ({
      formattedTrialSessionDetails: formattedTrialSessionDetailsStub,
      getFormattedCaseDetail: getFormattedCaseDetailStub,
    }),
  };

  it('should find the cases for a trial session successfully', async () => {
    await expect(
      generateTrialCalendarPdfInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).resolves.not.toThrow();
    expect(getTrialSessionByIdStub.mock.calls.length).toBe(1);
    expect(formattedTrialSessionDetailsStub.mock.calls.length).toBe(1);
    expect(getFormattedCaseDetailStub.mock.calls.length).toBe(3);
    expect(generateTrialCalendarTemplateStub.mock.calls.length).toBe(1);
    expect(generatePdfFromHtmlInteractorStub.mock.calls.length).toBe(1);
  });
});
