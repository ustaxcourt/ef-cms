import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { UNSERVABLE_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import { Case } from '@shared/business/entities/cases/Case';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';

export const fetchPendingItems = async ({
  applicationContext,
  docketNumber,
  judge,
  page,
}: {
  applicationContext: IApplicationContext;
  docketNumber?: string;
  judge?: string;
  page?: number;
}): Promise<{ foundDocuments: PendingItem[]; total: number }> => {
  const { PENDING_ITEMS_PAGE_SIZE } = applicationContext.getConstants();

  const size = page ? PENDING_ITEMS_PAGE_SIZE : 5000;

  const offset = page ? page * size : 0;

  const { count, results } = await getDbReader(async reader => {
    let query = reader
      .selectFrom('dwDocketEntry as d')
      .innerJoin('dwCase as c', 'd.docketNumber', 'c.docketNumber')
      .where('d.pending', 'is', true)
      .where(eb =>
        eb.or([
          eb('d.servedAt', 'is not', null),
          eb('d.isLegacyServed', 'is', true),
          eb('d.eventCode', 'in', UNSERVABLE_EVENT_CODES),
        ]),
      );

    if (docketNumber) {
      query = query.where('c.docketNumber', '=', docketNumber);
    }
    if (judge) {
      query = query.where('c.associatedJudge', '=', judge);
    }

    const countResult = await query
      .select(reader.fn.countAll().as('count'))
      .execute();

    const dataResult = await query
      .select([
        'c.associatedJudge',
        'c.associatedJudgeId',
        'c.caption',
        'c.docketNumber',
        'c.docketNumberSuffix',
        'c.status',
        'c.leadDocketNumber',
        'c.trialDate',
        'c.trialLocation',
        'd.docketEntryId',
        'd.documentType',
        'd.documentTitle',
        'd.receivedAt',
        'd.createdAt',
      ])
      .orderBy('d.receivedAt', 'asc')
      .orderBy('d.docketEntryId', 'asc') // This was how our secondary sort was originally set up. In moving to Postgres, we kept it.
      .orderBy('d.docketNumber', 'asc') // We added this tertiary sort to add some clarity around sorting when receivedAt and docketEntryId are the same.
      .offset(offset)
      .limit(size)
      .execute();

    return { count: Number(countResult[0].count), results: dataResult };
  });

  return {
    foundDocuments: results.map(r => ({
      ...fromKyselyCase(r),
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: r.docketNumber,
        docketNumberSuffix: r.docketNumberSuffix,
      }),
    })),
    total: count,
  };
};
