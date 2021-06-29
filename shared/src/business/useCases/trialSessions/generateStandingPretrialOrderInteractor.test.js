const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateStandingPretrialOrderInteractor,
} = require('./generateStandingPretrialOrderInteractor');
const { DOCKET_NUMBER_SUFFIXES } = require('../../entities/EntityConstants');

describe('generateStandingPretrialOrderInteractor', () => {
  const TEST_JUDGE = {
    judgeTitle: 'Judge',
    name: 'Test Judge',
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        if (docketNumber === '123-45') {
          return {
            caseCaption: 'Test Case Caption',
            docketNumber: '123-45',
          };
        } else {
          return {
            caseCaption: 'Test Case Caption',
            docketNumber: '234-56',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
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

  it('get the case detail and trial session detail', async () => {
    await generateStandingPretrialOrderInteractor(applicationContext, {
      docketNumber: '123-45',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
  });

  it('should call the Standing Pretrial Order document generator with correct data', async () => {
    await generateStandingPretrialOrderInteractor(applicationContext, {
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getDocumentGenerators().standingPretrialOrder.mock
        .calls[0][0].data,
    ).toMatchObject({
      trialInfo: {
        formattedJudgeName: 'Judge Test Judge',
        formattedServedDate: expect.anything(),
        formattedStartDate: 'August 25, 2019',
        formattedStartDateWithDayOfWeek: 'Sunday, August 25, 2019',
        formattedStartTime: '10:00 AM',
        joinPhoneNumber: '3333',
        meetingId: '1111',
        password: '2222',
        trialLocation: 'Boise, Idaho',
      },
    });
  });

  it('should add a served stamp to the document', async () => {
    await generateStandingPretrialOrderInteractor(applicationContext, {
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });
    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument,
    ).toHaveBeenCalled();
  });
});
