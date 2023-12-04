import {
  DOCKET_NUMBER_SUFFIXES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateNoticeOfChangeToRemoteProceedingInteractor } from './generateNoticeOfChangeToRemoteProceedingInteractor';

describe('generateNoticeOfChangeToRemoteProceedingInteractor', () => {
  const TEST_JUDGE = {
    judgeTitle: 'Judge',
    name: 'Test Judge',
  };

  const formattedPhoneNumber = '123-456-7890';

  const mockTrialSessionInformation = {
    chambersPhoneNumber: '1234567890',
    joinPhoneNumber: '1234567890',
    judgeName: 'Test Judge',
    meetingId: '1111',
    password: '2222',
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    startDate: '2019-08-25T05:00:00.000Z',
    startTime: '10:00',
    trialLocation: 'Boise, Idaho',
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => ({
        ...mockTrialSessionInformation,
        judge: { name: 'Test Judge' },
      }));

    applicationContext
      .getPersistenceGateway()
      .getConfigurationItemValue.mockImplementation(() => ({
        name: 'bob',
        title: 'clerk of court',
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
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue([TEST_JUDGE]);
  });

  it('should generate a template with the case and formatted trial information and call the pdf generator', async () => {
    await generateNoticeOfChangeToRemoteProceedingInteractor(
      applicationContext,
      {
        docketNumber: '123-45',
        trialSessionInformation: mockTrialSessionInformation,
      },
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators()
        .noticeOfChangeToRemoteProceeding.mock.calls[0][0],
    ).toMatchObject({
      data: {
        caseCaptionExtension: '',
        caseTitle: 'Test Case Caption',
        docketNumberWithSuffix: '123-45',
        trialInfo: {
          chambersPhoneNumber: formattedPhoneNumber,
          formattedJudge: 'Judge Test Judge',
          formattedStartDate: 'Sunday, August 25, 2019',
          formattedStartTime: '10:00 am',
          joinPhoneNumber: formattedPhoneNumber,
          meetingId: '1111',
          password: '2222',
          proceedingType: 'Remote',
          trialLocation: 'Boise, Idaho',
        },
      },
    });
  });

  it('should append the docket number suffix if present on the caseDetail', async () => {
    await generateNoticeOfChangeToRemoteProceedingInteractor(
      applicationContext,
      {
        docketNumber: '234-56',
        trialSessionInformation: mockTrialSessionInformation,
      },
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators()
        .noticeOfChangeToRemoteProceeding.mock.calls[0][0],
    ).toMatchObject({
      data: {
        docketNumberWithSuffix: '234-56S',
      },
    });
  });
});
