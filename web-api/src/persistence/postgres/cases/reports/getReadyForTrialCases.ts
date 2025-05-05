import {
  ANSWER_DOCUMENT_CODES,
  CASE_STATUS_TYPES,
} from '@shared/business/entities/EntityConstants';
import { calculateDateAtStartOfDayEST } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';

export const getReadyForTrialCases = async (): Promise<
  { docketNumber: string }[]
> => {
  const results = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as d')
      .innerJoin('dwCase as c', 'd.docketNumber', 'c.docketNumber')
      .where('c.status', '=', CASE_STATUS_TYPES.generalDocket)
      .where('d.eventCode', 'in', ANSWER_DOCUMENT_CODES)
      .where('d.isStricken', 'is not', true)
      .where(
        'd.createdAt',
        '<=',
        calculateDateAtStartOfDayEST({
          howMuch: -44,
          units: 'days',
        }),
      )
      .select('d.docketNumber')
      .limit(5000)
      .execute(),
  );
  return results;
};
