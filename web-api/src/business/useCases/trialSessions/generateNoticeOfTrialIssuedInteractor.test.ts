import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import {
  DOCKET_NUMBER_SUFFIXES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateNoticeOfTrialIssuedInteractor } from './generateNoticeOfTrialIssuedInteractor';
import { getFeatureFlagValues as getFeatureFlagValuesMock } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { getUsersInSections as getUsersInSectionsMock } from '@web-api/persistence/postgres/users/getUsersInSections';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

describe('generateNoticeOfTrialIssuedInteractor', () => {
  const getFeatureFlagValues = jest.mocked(getFeatureFlagValuesMock);
  getFeatureFlagValues.mockResolvedValue([
    {
      name: 'clerk-of-court-configuration',
      value: {
        current: {
          name: 'bob',
          title: 'clerk of court',
        },
      },
    },
  ]);

  const getUsersInSections = jest.mocked(getUsersInSectionsMock);
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;

  const TEST_JUDGE = {
    judgeTitle: 'Judge',
    name: 'Test Judge',
  };

  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);

  beforeEach(() => {
    getTrialSessionById.mockResolvedValue({
      joinPhoneNumber: '3333',
      judge: {
        name: 'Test Judge',
      },
      meetingId: '1111',
      password: '2222',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
      startDate: '2019-08-25T05:00:00.000Z',
      startTime: '10:00',
      trialLocation: 'Boise, Idaho',
    } as RawTrialSession);

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

    getUsersInSections.mockResolvedValue([TEST_JUDGE as DbUser]);
  });

  it('should generate a template with the case and trial information and call the pdf generator', async () => {
    await generateNoticeOfTrialIssuedInteractor(applicationContext, {
      docketNumber: '123-45',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(getTrialSessionById).toHaveBeenCalled();
    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfTrialIssued.mock
        .calls[0][0],
    ).toMatchObject({
      data: {
        docketNumberWithSuffix: '123-45',
        trialInfo: {
          formattedStartDate: 'Sunday, August 25, 2019',
          formattedStartTime: '10:00 am',
          joinPhoneNumber: '3333',
          meetingId: '1111',
          password: '2222',
          trialLocation: 'Boise, Idaho',
        },
      },
    });
  });

  it('call the noticeOfTrialIssued pdf generator with the title and name of the clerk of the court', async () => {
    await generateNoticeOfTrialIssuedInteractor(applicationContext, {
      docketNumber: '123-45',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfTrialIssued.mock
        .calls[0][0],
    ).toMatchObject({
      data: {
        nameOfClerk: 'bob',
        titleOfClerk: 'clerk of court',
      },
    });
  });

  it('call the noticeOfTrialIssuedInPerson pdf generator with the title and name of the clerk of the court', async () => {
    getTrialSessionById.mockResolvedValue({
      address1: '1111',
      address2: '2222',
      city: 'troutville',
      judge: { name: 'Test Judge' },
      postalCode: 'Boise, Idaho',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      startDate: '2019-08-25T05:00:00.000Z',
      startTime: '10:00',
      state: '33333',
      trialLocation: 'Boise, Idaho',
    } as RawTrialSession);

    await generateNoticeOfTrialIssuedInteractor(applicationContext, {
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfTrialIssuedInPerson
        .mock.calls[0][0],
    ).toMatchObject({
      data: {
        nameOfClerk: 'bob',
        titleOfClerk: 'clerk of court',
      },
    });
  });

  it('should throw an error when the judge for the trial session is not found in persistence', async () => {
    getTrialSessionById.mockResolvedValue({
      joinPhoneNumber: '3333',
      judge: { name: 'Bob Judge' },
      meetingId: '1111',
      password: '2222',
      startDate: '2019-08-25T05:00:00.000Z',
      startTime: '10:00',
      trialLocation: 'Boise, Idaho',
    } as RawTrialSession);

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

    expect(getTrialSessionById).toHaveBeenCalled();
    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfTrialIssued.mock
        .calls[0][0],
    ).toMatchObject({
      data: {
        docketNumberWithSuffix: '234-56S',
      },
    });
  });

  it('should create notice of trial issued for an in-person session', async () => {
    getTrialSessionById.mockResolvedValue({
      address1: '1111',
      address2: '2222',
      city: 'troutville',
      judge: { name: 'Test Judge' },
      postalCode: 'Boise, Idaho',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      startDate: '2019-08-25T05:00:00.000Z',
      startTime: '10:00',
      state: '33333',
      trialLocation: 'Boise, Idaho',
    } as RawTrialSession);

    await generateNoticeOfTrialIssuedInteractor(applicationContext, {
      docketNumber: '234-56',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfTrialIssuedInPerson
        .mock.calls[0][0],
    ).toMatchObject({
      data: {
        docketNumberWithSuffix: '234-56S',
      },
    });
  });
});
