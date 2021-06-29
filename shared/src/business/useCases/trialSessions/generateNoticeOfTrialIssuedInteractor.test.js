const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateNoticeOfTrialIssuedInteractor,
} = require('./generateNoticeOfTrialIssuedInteractor');
const { DOCKET_NUMBER_SUFFIXES } = require('../../entities/EntityConstants');

describe('generateNoticeOfTrialIssuedInteractor', () => {
  const TEST_JUDGE = {
    judgeTitle: 'Judge',
    name: 'Test Judge',
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => ({
        joinPhoneNumber: '3333',
        judge: { name: 'Test Judge' },
        meetingId: '1111',
        password: '2222',
        startDate: '2019-08-25T05:00:00.000Z',
        startTime: '10:00',
        trialLocation: 'Boise, Idaho',
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
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
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

    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue([TEST_JUDGE]);
  });

  it('should generate a template with the case and trial information and call the pdf generator', async () => {
    await generateNoticeOfTrialIssuedInteractor(applicationContext, {
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
      applicationContext.getDocumentGenerators().noticeOfTrialIssued.mock
        .calls[0][0],
    ).toMatchObject({
      data: {
        docketNumberWithSuffix: '123-45',
        trialInfo: {
          formattedStartDate: 'Sunday, August 25, 2019',
          formattedStartTime: '10:00 AM',
          joinPhoneNumber: '3333',
          meetingId: '1111',
          password: '2222',
          trialLocation: 'Boise, Idaho',
        },
      },
    });
  });

  it('should throw an error when the judge for the trial session is not found in persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => ({
        joinPhoneNumber: '3333',
        judge: { name: 'Bob Judge' },
        meetingId: '1111',
        password: '2222',
        startDate: '2019-08-25T05:00:00.000Z',
        startTime: '10:00',
        trialLocation: 'Boise, Idaho',
      }));

    await expect(
      generateNoticeOfTrialIssuedInteractor(applicationContext, {
        docketNumber: '123-45',
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      }),
    ).rejects.toThrow('Judge Bob Judge was not found');
  });

  it('should append the docket number suffix if present on the caseDetail', async () => {
    await generateNoticeOfTrialIssuedInteractor(applicationContext, {
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
      applicationContext.getDocumentGenerators().noticeOfTrialIssued.mock
        .calls[0][0],
    ).toMatchObject({
      data: {
        docketNumberWithSuffix: '234-56S',
      },
    });
  });
});
