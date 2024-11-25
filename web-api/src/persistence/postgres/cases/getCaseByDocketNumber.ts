import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getDbReader } from '@web-api/database';
import { getDocketEntryOnCase } from '@web-api/persistence/dynamo/cases/getDocketEntryOnCase';
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
  const caseResult = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .executeTakeFirst(),
  );

  const petitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwPetitionerOnCase')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .execute(),
  );

  const caseHistory = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseStatusUpdate')
      .where('docketNumber', '=', docketNumber)
      .orderBy('date asc')
      .selectAll()
      .execute(),
  );

  const caseStatistics = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseStatistic')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .execute(),
  );

  // 10502 TODO: Get work items and other aggregated things that getCaseByDocketNumber is doing in dynamo

  console.log('caseStatistics', caseStatistics);

  console.log('getCaseByDocketNumber');
  console.log(caseResult);
  // console.log(petitioners);
  // console.log(caseHistory);

  const docketEntries = await getDocketEntryOnCase({
    applicationContext,
    docketNumber,
  });

  // TODO, this is a hack
  return caseResult
    ? // 10502 TODO: Use CaseFactory
      new Case(
        transformNullToUndefined({
          ...caseResult,
          caseCaption: caseResult.caption,
          caseStatusHistory: caseHistory.map(d => {
            return {
              ...d,
              date: d.date.toISOString(),
            };
          }),
          createdAt: caseResult.createdAt?.toISOString(),
          docketEntries,
          hearings: caseResult.hearings || [],
          petitionPaymentDate: caseResult.petitionPaymentDate?.toISOString(),
          petitioners:
            transformNullToUndefined(petitioners).map(x => {
              // 10502 TODO: hack to get petitioner validation ok
              x.inCareOf = 'a';
              x.title = 'a';
              x.email = 'a@test.x';
              x.additionalName = x.additionalName || 'TEST';
              x.paperPetitionEmail = 'a@test.x';
              return new Petitioner(x).validate().toRawObject();
            }) || [],

          receivedAt: caseResult.receivedAt?.toISOString(),
          statistics: caseStatistics,
          trialDate: caseResult.trialDate?.toISOString(),
        }),
        { authorizedUser },
      )
    : undefined;
};
