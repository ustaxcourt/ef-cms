import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import {
  DOCKET_NUMBER_SUFFIXES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateStandingPretrialOrderInteractor } from './generateStandingPretrialOrderInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getUsersInSections as getUsersInSectionMock } from '@web-api/persistence/postgres/users/getUsersInSections';

describe('generateStandingPretrialOrderInteractor', () => {
  const TEST_JUDGE = {
    judgeTitle: 'Judge',
    name: 'Test Judge',
  };
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getUsersInSection = getUsersInSectionMock as jest.Mock;

  beforeEach(() => {
    getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
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
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        startDate: '2019-08-25T05:00:00.000Z',
        startTime: '10:00',
        trialLocation: 'Boise, Idaho',
      });

    getUsersInSection.mockReturnValue([TEST_JUDGE]);
  });

  it('should get the case detail and trial session detail', async () => {
    await generateStandingPretrialOrderInteractor(applicationContext, {
      docketNumber: '123-45',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalled();
    expect(getCaseByDocketNumber).toHaveBeenCalled();
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
        formattedStartTime: '10:00 am',
        formattedTrialLocation: 'Boise, Idaho',
        joinPhoneNumber: '3333',
        meetingId: '1111',
        password: '2222',
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

  it('should send formattedTrialLocation with Remote Proceedings text when proceedingType is remote', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        joinPhoneNumber: '3333',
        judge: { name: 'Test Judge' },
        meetingId: '1111',
        password: '2222',
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        startDate: '2019-08-25T05:00:00.000Z',
        startTime: '10:00',
        trialLocation: 'Boise, Idaho',
      });

    await generateStandingPretrialOrderInteractor(applicationContext, {
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getDocumentGenerators().standingPretrialOrder.mock
        .calls[0][0].data,
    ).toMatchObject({
      trialInfo: {
        formattedTrialLocation: 'Boise, Idaho - Remote Proceedings',
      },
    });
  });
});
