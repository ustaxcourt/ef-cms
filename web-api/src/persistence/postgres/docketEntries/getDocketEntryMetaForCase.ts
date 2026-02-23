import { getDbReader } from '@web-api/database';
import {
  SIGNED_DOCUMENT_TYPES,
  UNSERVABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { sql } from 'kysely';

export type DocketEntryMeta = {
  nextDocketEntryIndex: number;
  hasPendingDocketEntries: boolean;
  hasDocketedStipDecision: boolean;
  petitionServedAt: string | null;
};

export const getDocketEntryMetaForCase = async (
  docketNumber: string,
): Promise<DocketEntryMeta> => {
  const [nextIndexResult, hasPendingResult, hasStipResult, petitionResult] =
    await Promise.all([
      getDbReader(db =>
        db
          .selectFrom('dwDocketEntry')
          .where('docketNumber', '=', docketNumber)
          .where('isOnDocketRecord', '=', true)
          .where('index', 'is not', null)
          .select(db => [
            db.fn.count<number>('docketEntryId').as('entryCount'),
          ])
          .executeTakeFirstOrThrow(),
      ),
      getDbReader(db =>
        db
          .selectFrom('dwDocketEntry')
          .where('docketNumber', '=', docketNumber)
          .where('pending', '=', true)
          .where(eb =>
            eb.or([
              eb('servedAt', 'is not', null),
              eb('eventCode', 'in', UNSERVABLE_EVENT_CODES),
            ]),
          )
          .select(sql<boolean>`true`.as('exists'))
          .limit(1)
          .executeTakeFirst(),
      ),
      getDbReader(db =>
        db
          .selectFrom('dwDocketEntry')
          .where('docketNumber', '=', docketNumber)
          .where(
            'eventCode',
            '=',
            SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.eventCode,
          )
          .where('isOnDocketRecord', '=', true)
          .select(sql<boolean>`true`.as('exists'))
          .limit(1)
          .executeTakeFirst(),
      ),
      getDbReader(db =>
        db
          .selectFrom('dwDocketEntry')
          .where('docketNumber', '=', docketNumber)
          .where('eventCode', '=', 'P')
          .select('servedAt')
          .executeTakeFirst(),
      ),
    ]);

  return {
    nextDocketEntryIndex: Number(nextIndexResult.entryCount) + 1,
    hasPendingDocketEntries: !!hasPendingResult,
    hasDocketedStipDecision: !!hasStipResult,
    petitionServedAt: petitionResult?.servedAt
      ? String(petitionResult.servedAt)
      : null,
  };
};
