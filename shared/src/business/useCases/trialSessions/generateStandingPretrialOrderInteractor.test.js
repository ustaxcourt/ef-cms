const {
  generateStandingPretrialOrderInteractor,
} = require('./generateStandingPretrialOrderInteractor');

let applicationContext;
let generatePdfFromHtmlInteractorMock;
let generateStandingPretrialOrderTemplateMock;
let getCaseByDocketNumberMock;
let getTrialSessionByIdMock;

describe('generateStandingPretrialOrderInteractor', () => {
  beforeEach(() => {
    generatePdfFromHtmlInteractorMock = jest.fn();
    generateStandingPretrialOrderTemplateMock = jest.fn(() => '<html></html>');

    getCaseByDocketNumberMock = jest.fn(() => ({
      caseCaption: 'Test Case Caption',
      caseCaptionPostfix: 'Test Caption Postfix',
      docketNumber: '123-45',
      docketNumberSuffix: 'S',
    }));

    getTrialSessionByIdMock = jest.fn(() => ({
      address1: '123 Some Street',
      address2: 'Courtroom 2',
      city: 'City',
      courthouseName: 'Courthouse 1',
      judge: 'Test Judge',
      postalCode: '12345',
      startDate: '2/2/2020',
      startTime: '10:00',
      state: 'ST',
    }));

    applicationContext = {
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: getCaseByDocketNumberMock,
        getTrialSessionById: getTrialSessionByIdMock,
      }),
      getTemplateGenerators: () => ({
        generateStandingPretrialOrderTemplate: generateStandingPretrialOrderTemplateMock,
      }),
      getUseCases: () => ({
        generatePdfFromHtmlInteractor: generatePdfFromHtmlInteractorMock,
      }),
    };
  });
  it('should generate a template with the case and trial information and call the pdf generator', async () => {
    await generateStandingPretrialOrderInteractor({
      applicationContext,
      docketNumber: '123-45',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(getTrialSessionByIdMock).toHaveBeenCalled();
    expect(getCaseByDocketNumberMock).toHaveBeenCalled();
    expect(generateStandingPretrialOrderTemplateMock).toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorMock).toHaveBeenCalled();
  });
});
