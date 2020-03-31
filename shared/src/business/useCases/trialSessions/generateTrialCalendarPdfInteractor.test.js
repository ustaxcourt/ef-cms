const {
  applicationContext,
} = require('../../test/createTestApplicationContext');

const { MOCK_CASE } = require('../../../test/mockCase');

const {
  generateTrialCalendarPdfInteractor,
} = require('./generateTrialCalendarPdfInteractor');

let getCalendaredCasesForTrialSessionStub;
let getTrialSessionByIdStub;
let generatePdfFromHtmlInteractorStub;
let generateTrialCalendarTemplateStub;
let formattedTrialSessionDetailsStub;
let getFormattedCaseDetailStub;

describe('generateTrialCalendarPdfInteractor', () => {
  beforeEach(() => {
    getCalendaredCasesForTrialSessionStub = jest
      .fn()
      .mockReturnValue([MOCK_CASE, MOCK_CASE, MOCK_CASE]);
    getTrialSessionByIdStub = jest.fn();
    generatePdfFromHtmlInteractorStub = jest.fn();
    generateTrialCalendarTemplateStub = jest.fn().mockResolvedValue(true);
    formattedTrialSessionDetailsStub = applicationContext.getUtilities()
      .formattedTrialSessionDetails;
    getFormattedCaseDetailStub = applicationContext.getUtilities()
      .getFormattedCaseDetail;

    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockImplementation(
        getCalendaredCasesForTrialSessionStub,
      );

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(getTrialSessionByIdStub);

    applicationContext
      .getTemplateGenerators()
      .generateTrialCalendarTemplate.mockImplementation(
        generateTrialCalendarTemplateStub,
      );

    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockImplementation(
        generatePdfFromHtmlInteractorStub,
      );
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
    expect(getTrialSessionByIdStub.mock.calls.length).toBe(1);
    expect(formattedTrialSessionDetailsStub.mock.calls.length).toBe(1);
    expect(getFormattedCaseDetailStub.mock.calls.length).toBe(3);
    expect(generateTrialCalendarTemplateStub.mock.calls.length).toBe(1);
    expect(generatePdfFromHtmlInteractorStub.mock.calls.length).toBe(1);
  });
});
