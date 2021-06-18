const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateStandingPretrialOrderForSmallCaseInteractor,
} = require('./generateStandingPretrialOrderForSmallCaseInteractor');
const { DOCKET_NUMBER_SUFFIXES } = require('../../entities/EntityConstants');

describe('generateStandingPretrialOrderForSmallCaseInteractor', () => {
  const TEST_JUDGE = {
    judgeTitle: 'Judge',
    name: 'Test Judge',
  };

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
        joinPhoneNumber: '3333',
        judge: { name: 'Test Judge' },
        meetingId: '1111',
        password: '2222',
        startDate: '2019-08-25T05:00:00.000Z',
        startTime: '10:00',
        trialLocation: 'Boise, Idaho',
      });

    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue([TEST_JUDGE]);
  });

  it('should fetch case and trial information and call the document generator', async () => {
    await generateStandingPretrialOrderForSmallCaseInteractor(
      applicationContext,
      {
        docketNumber: '123-45',
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      },
    );

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
    await generateStandingPretrialOrderForSmallCaseInteractor(
      applicationContext,
      {
        docketNumber: '234-56',
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      },
    );

    const { data } =
      applicationContext.getDocumentGenerators()
        .standingPretrialOrderForSmallCase.mock.calls[0][0];
    expect(data.docketNumberWithSuffix).toEqual('234-56S');
  });

  it('should format trial start info', async () => {
    await generateStandingPretrialOrderForSmallCaseInteractor(
      applicationContext,
      {
        docketNumber: '234-56',
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      },
    );

    const { data } =
      applicationContext.getDocumentGenerators()
        .standingPretrialOrderForSmallCase.mock.calls[0][0];
    expect(data.trialInfo.formattedStartDateWithDayOfWeek).toEqual(
      'Sunday, August 25, 2019',
    );
    expect(data.trialInfo.formattedStartTime).toEqual('10:00 AM');
  });

  it('should add a served stamp to the document', async () => {
    await generateStandingPretrialOrderForSmallCaseInteractor(
      applicationContext,
      {
        docketNumber: '234-56',
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      },
    );

    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument,
    ).toHaveBeenCalled();
  });
});
