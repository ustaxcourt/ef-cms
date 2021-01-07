const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateStandingPretrialOrderForSmallCaseInteractor,
} = require('./generateStandingPretrialOrderForSmallCaseInteractor');
const { DOCKET_NUMBER_SUFFIXES } = require('../../entities/EntityConstants');

describe('generateStandingPretrialOrderForSmallCaseInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockImplementation(
        ({ contentHtml }) => contentHtml,
      );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        if (docketNumber === '123-45') {
          return {
            caseCaption: 'Test Case Caption',
            docketNumber: '123-45',
            docketNumberSuffix: '',
            docketNumberWithSuffix: '123-45',
            irsPractitioners: [],
          };
        } else {
          return {
            caseCaption: 'Test Case Caption',
            docketNumber: '234-56',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
            docketNumberWithSuffix: '234-56S',
            irsPractitioners: [
              {
                contact: { phone: '123-123-1234' },
                name: 'Test IRS Practitioner',
              },
            ],
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
        startDate: '2020-02-03T09:00:00.000Z',
        startTime: '09:00',
        state: 'AL',
      });
  });

  it('should fetch case and trial information and call the document generator', async () => {
    await generateStandingPretrialOrderForSmallCaseInteractor({
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
      applicationContext.getDocumentGenerators()
        .standingPretrialOrderForSmallCase,
    ).toHaveBeenCalled();
  });

  it('should append the docket number suffix if present on the caseDetail', async () => {
    await generateStandingPretrialOrderForSmallCaseInteractor({
      applicationContext,
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    const {
      data,
    } = applicationContext.getDocumentGenerators().standingPretrialOrderForSmallCase.mock.calls[0][0];

    expect(data.docketNumberWithSuffix).toEqual('234-56S');
  });

  it('return the respondent contact info if present', async () => {
    await generateStandingPretrialOrderForSmallCaseInteractor({
      applicationContext,
      docketNumber: '123-45',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getDocumentGenerators()
        .standingPretrialOrderForSmallCase.mock.calls[0][0].data.trialInfo
        .respondentContactText,
    ).toEqual('not available at this time');

    await generateStandingPretrialOrderForSmallCaseInteractor({
      applicationContext,
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getDocumentGenerators()
        .standingPretrialOrderForSmallCase.mock.calls[1][0].data.trialInfo
        .respondentContactText,
    ).toEqual('Test IRS Practitioner (123-123-1234)');
  });

  it('should format trial start info', async () => {
    await generateStandingPretrialOrderForSmallCaseInteractor({
      applicationContext,
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    const {
      data,
    } = applicationContext.getDocumentGenerators().standingPretrialOrderForSmallCase.mock.calls[0][0];

    expect(data.trialInfo.fullStartDate).toEqual('Monday, February 3, 2020');
    expect(data.trialInfo.startDay).toEqual('Monday');
    expect(data.trialInfo.startTime).toEqual('09:00 AM');
  });

  it('should add a served stamp to the document', async () => {
    await generateStandingPretrialOrderForSmallCaseInteractor({
      applicationContext,
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });
    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument,
    ).toHaveBeenCalled();
  });
});
