import {
  CASE_STATUS_TYPES,
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_REMOTE,
} from '../../../test/mockTrial';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { updateTrialSessionInteractor } from './updateTrialSessionInteractor';

describe('updateTrialSessionInteractor should Generate Notices of', () => {
  const mockUser = new User({
    name: 'Docket Clerk',
    role: ROLES.docketClerk,
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  });

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(mockUser);

    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue({
        fileId: 'f1501fb1-c2c8-4489-b28e-00212d45c93e',
        url: 'www.example.com',
      });
  });

  describe('In-Person Proceeding', () => {
    it('should NOT generate a NOIP when the proceeding type changes from remote to in-person, the case status is not closed but the trial session is NOT calendared', async () => {
      const inPersonNonCalendaredTrialSession = {
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [
          {
            docketNumber: MOCK_CASE.docketNumber,
          },
        ],
        isCalendared: false,
      };

      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...inPersonNonCalendaredTrialSession,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        });

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...MOCK_CASE,
          trialDate: MOCK_TRIAL_INPERSON.startDate,
          trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
        });

      await updateTrialSessionInteractor(applicationContext, {
        clientConnectionId: '123',
        trialSession: inPersonNonCalendaredTrialSession,
      });

      expect(
        applicationContext.getUseCaseHelpers()
          .setNoticeOfChangeToInPersonProceeding,
      ).not.toHaveBeenCalled();
    });

    it('should NOT generate a NOIP when the proceeding type changes from remote to in-person, the trial session is calendared but the case is closed', async () => {
      const inPersonCalendaredTrialSession = {
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [
          {
            docketNumber: MOCK_CASE.docketNumber,
          },
        ],
        isCalendared: true,
      };

      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...inPersonCalendaredTrialSession,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        });

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...MOCK_CASE,
          closedDate: '2019-01-01T00:00:00.000Z',
          status: CASE_STATUS_TYPES.closed,
          trialDate: MOCK_TRIAL_INPERSON.startDate,
          trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
        });

      await updateTrialSessionInteractor(applicationContext, {
        clientConnectionId: '123',
        trialSession: inPersonCalendaredTrialSession,
      });

      expect(
        applicationContext.getUseCaseHelpers()
          .setNoticeOfChangeToInPersonProceeding,
      ).not.toHaveBeenCalled();
    });

    it('should NOT generate a NOIP when the case status is open, the trial session is calendared but the trial session proceeding type has not changed', async () => {
      const inPersonCalendaredTrialSession = {
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [
          {
            docketNumber: MOCK_CASE.docketNumber,
          },
        ],
        isCalendared: true,
      };

      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...inPersonCalendaredTrialSession,
        });

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...MOCK_CASE,
          trialDate: MOCK_TRIAL_INPERSON.startDate,
          trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
        });

      await updateTrialSessionInteractor(applicationContext, {
        clientConnectionId: '123',
        trialSession: inPersonCalendaredTrialSession,
      });

      expect(
        applicationContext.getUseCaseHelpers()
          .setNoticeOfChangeToInPersonProceeding,
      ).not.toHaveBeenCalled();
    });

    it('should generate a NOIP when the proceeding type changes from remote to in-person, the case status is not closed, and the trial session is calendared', async () => {
      const inPersonCalendaredTrialSession = {
        ...MOCK_TRIAL_INPERSON,
        caseOrder: [
          {
            docketNumber: MOCK_CASE.docketNumber,
          },
        ],
        isCalendared: true,
      };

      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...inPersonCalendaredTrialSession,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        });

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...MOCK_CASE,
          trialDate: MOCK_TRIAL_INPERSON.startDate,
          trialSessionId: MOCK_TRIAL_INPERSON.trialSessionId,
        });

      await updateTrialSessionInteractor(applicationContext, {
        clientConnectionId: '123',
        trialSession: inPersonCalendaredTrialSession,
      });

      expect(
        applicationContext.getUseCaseHelpers()
          .setNoticeOfChangeToInPersonProceeding,
      ).toHaveBeenCalled();
    });
  });

  describe('Remote Proceeding', () => {
    it('should NOT generate a NORP when the case status is open, trial session is calendared, but the proceeding type has not changed', async () => {
      const remoteCalendaredTrialSession = {
        ...MOCK_TRIAL_REMOTE,
        caseOrder: [
          {
            docketNumber: MOCK_CASE.docketNumber,
          },
        ],
        isCalendared: true,
      };

      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...remoteCalendaredTrialSession,
        });

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...MOCK_CASE,
          trialDate: MOCK_TRIAL_REMOTE.startDate,
          trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
        });

      await updateTrialSessionInteractor(applicationContext, {
        clientConnectionId: '123',
        trialSession: remoteCalendaredTrialSession,
      });

      expect(
        applicationContext.getUseCaseHelpers()
          .setNoticeOfChangeToRemoteProceeding,
      ).not.toHaveBeenCalled();
    });

    it('should NOT generate a NORP when the proceeding type changes from in-person to remote, the trial session is calendared but the case is closed', async () => {
      const remoteCalendaredTrialSession = {
        ...MOCK_TRIAL_REMOTE,
        caseOrder: [
          {
            docketNumber: MOCK_CASE.docketNumber,
          },
        ],
        isCalendared: true,
      };

      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...remoteCalendaredTrialSession,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        });

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...MOCK_CASE,
          closedDate: '2019-01-01T00:00:00.000Z',
          status: CASE_STATUS_TYPES.closed,
          trialDate: MOCK_TRIAL_REMOTE.startDate,
          trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
        });

      await updateTrialSessionInteractor(applicationContext, {
        clientConnectionId: '123',
        trialSession: remoteCalendaredTrialSession,
      });

      expect(
        applicationContext.getUseCaseHelpers()
          .setNoticeOfChangeToRemoteProceeding,
      ).not.toHaveBeenCalled();
    });

    it('should generate a NORP when the proceeding type changes from in-person to remote, the case status is not closed, and the trial session is calendared', async () => {
      const remoteTrialSession = {
        ...MOCK_TRIAL_REMOTE,
        caseOrder: [
          {
            docketNumber: MOCK_CASE.docketNumber,
          },
        ],
      };

      applicationContext
        .getPersistenceGateway()
        .getTrialSessionById.mockReturnValue({
          ...remoteTrialSession,
          isCalendared: true,
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        });

      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue({
          ...MOCK_CASE,
          trialDate: MOCK_TRIAL_REMOTE.startDate,
          trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
        });

      await updateTrialSessionInteractor(applicationContext, {
        clientConnectionId: '123',
        trialSession: remoteTrialSession,
      });

      expect(
        applicationContext.getUseCaseHelpers()
          .setNoticeOfChangeToRemoteProceeding,
      ).toHaveBeenCalled();
    });
  });
});

describe('Change of Trial Judge', () => {
  const mockJudgeOne = {
    name: 'Mock Judge',
    userId: '544a2727-d5ee-4108-9689-69cecad86018',
  };
  const mockJudgeTwo = {
    name: 'Different Mock Judge',
    userId: 'd457d96f-6213-47f3-8794-63b7c7032af1',
  };

  it('should NOT generate a NOT when the trial judge has not changed, the case status is not closed, and the trial session is calendared', async () => {
    const remoteCalendaredTrialSession = {
      ...MOCK_TRIAL_REMOTE,
      caseOrder: [
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
      ],
      isCalendared: true,
    };

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...remoteCalendaredTrialSession,
        isCalendared: true,
        judge: mockJudgeOne,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        trialDate: MOCK_TRIAL_REMOTE.startDate,
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
      });

    await updateTrialSessionInteractor(applicationContext, {
      clientConnectionId: '123',
      trialSession: {
        ...remoteCalendaredTrialSession,
        judge: mockJudgeOne,
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialJudge,
    ).not.toHaveBeenCalled();
  });

  it('should NOT generate a NOT when the trial judge has changed, the case status is closed, and the trial session is calendared', async () => {
    const remoteCalendaredTrialSession = {
      ...MOCK_TRIAL_REMOTE,
      caseOrder: [
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
      ],
      isCalendared: true,
    };

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...remoteCalendaredTrialSession,
        isCalendared: true,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        closedDate: '2019-03-01T21:42:29.073Z',
        status: CASE_STATUS_TYPES.closed,
        trialDate: MOCK_TRIAL_REMOTE.startDate,
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
      });

    await updateTrialSessionInteractor(applicationContext, {
      clientConnectionId: '123',
      trialSession: {
        ...remoteCalendaredTrialSession,
        judge: mockJudgeTwo,
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialJudge,
    ).not.toHaveBeenCalled();
  });

  it('should NOT generate a NOT when the trial judge has changed, the case status is not closed, but the trial session is NOT calendared', async () => {
    const remoteCalendaredTrialSession = {
      ...MOCK_TRIAL_REMOTE,
      caseOrder: [
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
      ],
      isCalendared: false,
    };

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...remoteCalendaredTrialSession,
        isCalendared: false,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        trialDate: MOCK_TRIAL_REMOTE.startDate,
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
      });

    await updateTrialSessionInteractor(applicationContext, {
      clientConnectionId: '123',
      trialSession: {
        ...remoteCalendaredTrialSession,
        judge: mockJudgeTwo,
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialJudge,
    ).not.toHaveBeenCalled();
  });

  it('should NOT generate a NOT when the case status is not closed, and the trial session is calendared, but the trial judge was not set prior to being added,', async () => {
    const remoteCalendaredTrialSession = {
      ...MOCK_TRIAL_REMOTE,
      caseOrder: [
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
      ],
      isCalendared: true,
      judge: undefined,
    };

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...remoteCalendaredTrialSession,
        isCalendared: true,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        trialDate: MOCK_TRIAL_REMOTE.startDate,
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
      });

    await updateTrialSessionInteractor(applicationContext, {
      clientConnectionId: '123',
      trialSession: {
        ...remoteCalendaredTrialSession,
        judge: mockJudgeOne,
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialJudge,
    ).not.toHaveBeenCalled();
  });

  it('should NOT generate a NOT when the case status is not closed, and the trial session is calendared, but the trial judge is being unset,', async () => {
    const remoteCalendaredTrialSession = {
      ...MOCK_TRIAL_REMOTE,
      caseOrder: [
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
      ],
      isCalendared: true,
    };

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...remoteCalendaredTrialSession,
        isCalendared: true,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        trialDate: MOCK_TRIAL_REMOTE.startDate,
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
      });

    await updateTrialSessionInteractor(applicationContext, {
      clientConnectionId: '123',
      trialSession: {
        ...remoteCalendaredTrialSession,
        judge: undefined,
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialJudge,
    ).not.toHaveBeenCalled();
  });

  it('should generate a NOT when the trial judge has changed, the case status is not closed, and the trial session is calendared', async () => {
    const remoteCalendaredTrialSession = {
      ...MOCK_TRIAL_REMOTE,
      caseOrder: [
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
      ],
      isCalendared: true,
      judge: mockJudgeOne,
    };

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        ...remoteCalendaredTrialSession,
        isCalendared: true,
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        trialDate: MOCK_TRIAL_REMOTE.startDate,
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId,
      });

    await updateTrialSessionInteractor(applicationContext, {
      clientConnectionId: '123',
      trialSession: {
        ...remoteCalendaredTrialSession,
        judge: mockJudgeTwo,
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().setNoticeOfChangeOfTrialJudge,
    ).toHaveBeenCalledTimes(1);
  });
});
