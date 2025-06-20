import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import {
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateNoticeOfChangeToRemoteProceedingInteractor } from './generateNoticeOfChangeToRemoteProceedingInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getUsersInSections as getUsersInSectionMock } from '@web-api/persistence/postgres/users/getUsersInSection';
import { User } from '@shared/business/entities/User';

const getUsersInSection = getUsersInSectionMock as jest.Mock;

describe('generateNoticeOfChangeToRemoteProceedingInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;

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

    getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
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

    getUsersInSection.mockReturnValue([
      new User({
        isSeniorJudge: false,
        judgeFullName: 'Test Judge',
        judgePhoneNumber: '(123) 123-1234',
        judgeTitle: 'Judge',
        name: 'Test Judge',
        role: ROLES.judge,
        section: 'testJudge1sChambers',
        userId: 'ce5add74-1559-448d-a67d-c887c8351b2e',
      }),
    ]);
  });

  it('should generate a template with the case and formatted trial information and call the pdf generator', async () => {
    await generateNoticeOfChangeToRemoteProceedingInteractor(
      applicationContext,
      {
        docketNumber: '123-45',
        trialSessionInformation: mockTrialSessionInformation,
      },
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
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
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
          trialLocation: 'Boise, Idaho',
        },
      },
    });
  });

  it('should append the docket number suffix when present on the caseDetail', async () => {
    await generateNoticeOfChangeToRemoteProceedingInteractor(
      applicationContext,
      {
        docketNumber: '234-56',
        trialSessionInformation: mockTrialSessionInformation,
      },
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators()
        .noticeOfChangeToRemoteProceeding.mock.calls[0][0],
    ).toMatchObject({
      data: {
        docketNumberWithSuffix: '234-56S',
      },
    });
  });

  it('should call the noticeOfChangeToRemoteProceeding pdf generator with the name and title of the clerk', async () => {
    await generateNoticeOfChangeToRemoteProceedingInteractor(
      applicationContext,
      {
        docketNumber: '234-56',
        trialSessionInformation: mockTrialSessionInformation,
      },
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators()
        .noticeOfChangeToRemoteProceeding.mock.calls[0][0].data,
    ).toMatchObject({
      nameOfClerk: 'bob',
      titleOfClerk: 'clerk of court',
    });
  });
});
