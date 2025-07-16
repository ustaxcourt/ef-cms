import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

// TODO: Remove this once associatedJudge stuff is no longer on deadlines.
// Exported just to test.
export async function updateDeadlinesForCasesToCalendar({
  casesToCalendar,
  trialSessionEntity,
}: {
  casesToCalendar: RawCase[];
  trialSessionEntity: RawTrialSession;
}) {
  if (!(trialSessionEntity.judge && trialSessionEntity.judge.name)) {
    return; // Nothing to update if the trial session has no judge
  }
  const values: Pick<CaseDeadline, 'associatedJudge' | 'associatedJudgeId'> = {
    associatedJudge: trialSessionEntity.judge?.name,
    associatedJudgeId: trialSessionEntity.judge?.userId ?? null,
  };
  await pgUpdateTable({
    table: 'dwCaseDeadline',
    values,
    where: db =>
      db.where(
        'docketNumber',
        'in',
        casesToCalendar.map(c => c.docketNumber),
      ),
  });
}
