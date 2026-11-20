import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { shouldGenerateNoticeOfChangeOfTrialJudge } from './updateTrialSessionInteractorHelper';

describe('updateTrialSessionInteractorHelper for Reporting sessions', () => {
  describe('shouldGenerateNoticeOfChangeOfTrialJudge', () => {
    const buildCalendaredSession = (
      judgeUserId: string,
      proceedingType: string,
    ): RawTrialSession =>
      ({
        isCalendared: true,
        judge: {
          userId: judgeUserId,
        },
        proceedingType,
      }) as RawTrialSession;

    it('should return "false" when a calendared Reporting session went from one Judge Id to a different Judge Id', () => {
      expect(
        shouldGenerateNoticeOfChangeOfTrialJudge(
          buildCalendaredSession(
            'current-id',
            TRIAL_SESSION_PROCEEDING_TYPES.reporting,
          ),
          buildCalendaredSession(
            'updated-id',
            TRIAL_SESSION_PROCEEDING_TYPES.reporting,
          ),
        ),
      ).toEqual(false);
    });

    it.each([
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      TRIAL_SESSION_PROCEEDING_TYPES.remote,
    ])(
      'should still return "true" when a calendared %s session went from one Judge Id to a different Judge Id',
      proceedingType => {
        expect(
          shouldGenerateNoticeOfChangeOfTrialJudge(
            buildCalendaredSession('current-id', proceedingType),
            buildCalendaredSession('updated-id', proceedingType),
          ),
        ).toEqual(true);
      },
    );
  });
});
