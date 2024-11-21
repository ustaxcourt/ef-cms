import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
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
      .selectFrom('dwUserCase as uc')
      .where('docketNumber', '=', docketNumber)
      .leftJoin('dwUser as u', 'u.contactId', 'uc.contactId')
      .selectAll()
      .execute(),
  );

  console.log('getCaseByDocketNumber');
  console.log(caseResult);
  console.log(petitioners);

  const docketEntries = await getDocketEntryOnCase({
    applicationContext,
    docketNumber,
  });

  return caseResult
    ? // TODO 10502: Use CaseFactory
      CaseFactory({
        authorizedUser,
        rawCase: transformNullToUndefined({
          ...caseResult,
          caseCaption: caseResult.caption, // TODO, this is a hack
          docketEntries,
          petitioners:
            transformNullToUndefined(petitioners).map(x => {
              // 10502 TODO: hack to get petitioner validation ok
              x.inCareOf = 'a';
              x.title = 'a';
              x.email = 'a@test.x';
              x.additionalName = x.additionalName || 'TEST';
              return new Petitioner(x).validate().toRawObject();
            }) || [],
        }),
      })
    : undefined;
};
