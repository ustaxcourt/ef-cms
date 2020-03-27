const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateStandingPretrialNoticeInteractor,
} = require('./generateStandingPretrialNoticeInteractor');

describe('generateStandingPretrialNoticeInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockImplementation(
        ({ contentHtml }) => contentHtml,
      );

    applicationContext
      .getTemplateGenerators()
      .generateStandingPretrialNoticeTemplate.mockImplementation(
        ({ content }) => `<html>${content.docketNumberWithSuffix}</html>`,
      );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        if (docketNumber === '123-45') {
          return {
            caseCaption: 'Test Case Caption',
            caseCaptionPostfix: 'Test Caption Postfix',
            docketNumber: '123-45',
          };
        } else {
          return {
            caseCaption: 'Test Case Caption',
            caseCaptionPostfix: 'Test Caption Postfix',
            docketNumber: '234-56',
            docketNumberSuffix: 'S',
          };
        }
      });

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        address1: '123 Some Street',
        address2: 'Courtroom 2',
        city: 'City',
        courthouseName: 'Courthouse 1',
        judge: 'Test Judge',
        postalCode: '12345',
        startDate: '2/2/2020',
        startTime: '10:00',
        state: 'ST',
      });
  });
  it('should generate a template with the case and trial information and call the pdf generator', async () => {
    const result = await generateStandingPretrialNoticeInteractor({
      applicationContext,
      docketNumber: '123-45',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getTemplateGenerators()
        .generateStandingPretrialNoticeTemplate,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().generatePdfFromHtmlInteractor,
    ).toHaveBeenCalled();
    expect(result.indexOf('123-45')).toBeGreaterThan(-1);
  });

  it('should append the docket number suffix if present on the caseDetail', async () => {
    const result = await generateStandingPretrialNoticeInteractor({
      applicationContext,
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getTemplateGenerators()
        .generateStandingPretrialNoticeTemplate,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().generatePdfFromHtmlInteractor,
    ).toHaveBeenCalled();
    expect(result.indexOf('234-56S')).toBeGreaterThan(-1);
  });
});
