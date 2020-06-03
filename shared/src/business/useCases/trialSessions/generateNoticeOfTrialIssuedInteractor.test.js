const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateNoticeOfTrialIssuedInteractor,
} = require('./generateNoticeOfTrialIssuedInteractor');

describe('generateNoticeOfTrialIssuedInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => ({
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

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        if (docketNumber === '123-45') {
          return {
            caseCaption: 'Test Case Caption',
            docketNumber: '123-45',
            docketNumberWithSuffix: '123-45',
          };
        } else {
          return {
            caseCaption: 'Test Case Caption',
            docketNumber: '234-56',
            docketNumberSuffix: 'S',
            docketNumberWithSuffix: '234-56S',
          };
        }
      });

    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockImplementation(
        ({ contentHtml }) => contentHtml,
      );

    applicationContext
      .getTemplateGenerators()
      .generateNoticeOfTrialIssuedTemplate.mockImplementation(
        ({ content }) => `<html>${content.docketNumberWithSuffix}</html>`,
      );
  });

  it('should generate a template with the case and trial information and call the pdf generator', async () => {
    const result = await generateNoticeOfTrialIssuedInteractor({
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
        .generateNoticeOfTrialIssuedTemplate,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().generatePdfFromHtmlInteractor,
    ).toHaveBeenCalled();
    expect(result.indexOf('123-45')).toBeGreaterThan(-1);
  });

  it('should append the docket number suffix if present on the caseDetail', async () => {
    const result = await generateNoticeOfTrialIssuedInteractor({
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
        .generateNoticeOfTrialIssuedTemplate,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().generatePdfFromHtmlInteractor,
    ).toHaveBeenCalled();
    expect(result.indexOf('234-56S')).toBeGreaterThan(-1);
  });
});
