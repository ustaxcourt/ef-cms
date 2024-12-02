import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getDbReader } from '@web-api/database';
import { getDocketEntryOnCase } from '@web-api/persistence/dynamo/cases/getDocketEntryOnCase';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getCaseByDocketNumber = async ({
  applicationContext,
  authorizedUser,
  docketNumber,
}: {
  docketNumber: string;
  authorizedUser?: AuthUser;
  applicationContext: ServerApplicationContext;
}): Promise<Case | undefined> => {
  const dbCase = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .executeTakeFirst(),
  );

  const dbPetitionersOnCase = await getDbReader(reader =>
    reader
      .selectFrom('dwPetitionerOnCase')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .execute(),
  );
  const petitionersOnCase =
    dbPetitionersOnCase.map(x => {
      return new Petitioner(transformNullToUndefined(x))
        .validate()
        .toRawObject();
    }) || [];

  const dbCaseStatusHistory = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseStatusUpdate')
      .where('docketNumber', '=', docketNumber)
      .orderBy('date asc')
      .selectAll()
      .execute(),
  );
  const caseStatusHistory = dbCaseStatusHistory.map(update => {
    return { ...update, date: update.date.toISOString() };
  });

  const dbCaseStatistics = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseStatistic')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .execute(),
  );

  const dbDocketEntries = await getDocketEntryOnCase({
    applicationContext,
    docketNumber,
  });
  const workItems = await getWorkItemsByDocketNumber({ docketNumber });

  // "JOIN" docket entries and work items. Once docket entries are in postgres, this can
  // be done in a single query rather than in an O(n^2) loop.
  for (let item of workItems) {
    for (let entry of dbDocketEntries) {
      if (item.docketEntry.docketEntryId === entry.docketEntryId) {
        entry.workItem = item;
      }
    }
  }

  // 10502 TODO: Still need other case items to be attached to the case. See aggregateCaseItems.

  // console.log('getCaseByDocketNumber');
  // console.log('caseStatistics', caseStatistics);
  // console.log(caseResult);
  // console.log(petitioners);
  // console.log(caseHistory);

  return dbCase
    ? new Case(
        transformNullToUndefined({
          ...dbCase,
          blockedDate: dbCase.blockedDate?.toISOString(),
          caseCaption: dbCase.caption,
          caseStatusHistory,
          closedDate: dbCase.closedDate?.toISOString(),
          createdAt: dbCase.createdAt?.toISOString(),
          docketEntries: dbDocketEntries,
          hearings: dbCase.hearings || [],
          irsNoticeDate: dbCase.irsNoticeDate?.toISOString(),
          noticeOfTrialDate: dbCase.noticeOfTrialDate?.toISOString(),
          petitionPaymentDate: dbCase.petitionPaymentDate?.toISOString(),
          petitionPaymentWaivedDate:
            dbCase.petitionPaymentWaivedDate?.toISOString(),
          petitioners: petitionersOnCase,
          receivedAt: dbCase.receivedAt?.toISOString(),
          sealedDate: dbCase.sealedDate?.toISOString(),
          statistics: dbCaseStatistics,
          trialDate: dbCase.trialDate?.toISOString(),
        }),
        { authorizedUser },
      )
    : undefined;
};
