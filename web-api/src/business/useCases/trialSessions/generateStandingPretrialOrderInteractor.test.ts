import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
jest.mock('@web-api/persistence/postgres/users/getUsersInSections');
import {
  DOCKET_NUMBER_SUFFIXES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateStandingPretrialOrderInteractor } from './generateStandingPretrialOrderInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { getUsersInSections as getUsersInSectionsMock } from '@web-api/persistence/postgres/users/getUsersInSections';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

describe('generateStandingPretrialOrderInteractor', () => {
  const TEST_JUDGE = {
    judgeTitle: 'Judge',
    name: 'Test Judge',
  };
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const getUsersInSections = jest.mocked(getUsersInSectionsMock);

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

    getTrialSessionById.mockResolvedValue({
      joinPhoneNumber: '3333',
      judge: { name: 'Test Judge' },
      meetingId: '1111',
      password: '2222',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      startDate: '2019-08-25T05:00:00.000Z',
      startTime: '10:00',
      trialLocation: 'Boise, Idaho',
    } as RawTrialSession);

    getUsersInSections.mockResolvedValue([TEST_JUDGE as DbUser]);
  });

  it('should get the case detail and trial session detail', async () => {
    await generateStandingPretrialOrderInteractor(applicationContext, {
      docketNumber: '123-45',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(getTrialSessionById).toHaveBeenCalled();
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
    getTrialSessionById.mockResolvedValue({
      joinPhoneNumber: '3333',
      judge: { name: 'Test Judge' },
      meetingId: '1111',
      password: '2222',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
      startDate: '2019-08-25T05:00:00.000Z',
      startTime: '10:00',
      trialLocation: 'Boise, Idaho',
    } as RawTrialSession);

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
