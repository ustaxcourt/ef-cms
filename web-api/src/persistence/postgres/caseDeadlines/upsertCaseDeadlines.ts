import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import {
  caseDeadlineEntity,
  toKyselyNewCaseDeadline,
} from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { getDbWriter } from '@web-api/database';
import { isEmpty } from 'lodash';

export const upsertCaseDeadlines = async (
  caseDeadlinesToUpsert: RawCaseDeadline[],
) => {
  if (isEmpty(caseDeadlinesToUpsert)) {
    return [];
  }

  const caseDeadlines = await getDbWriter(writer =>
    writer
      .insertInto('dwCaseDeadline')
      .values(caseDeadlinesToUpsert.map(cd => toKyselyNewCaseDeadline(cd)))
      .onConflict(oc =>
        oc.column('caseDeadlineId').doUpdateSet(cd => {
          return {
            associatedJudge: cd.ref('excluded.associatedJudge'),
            associatedJudgeId: cd.ref('excluded.associatedJudgeId'),
            createdAt: cd.ref('excluded.createdAt'),
            deadlineDate: cd.ref('excluded.deadlineDate'),
            description: cd.ref('excluded.description'),
            docketNumber: cd.ref('excluded.docketNumber'),
            sortableDocketNumber: cd.ref('excluded.sortableDocketNumber'),
          };
        }),
      )
      .returningAll()
      .execute(),
  );
  return caseDeadlines.map(cd => caseDeadlineEntity(cd));
};
