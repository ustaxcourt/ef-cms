import {
  ANSWER_DOCUMENT_CODES,
  CASE_STATUS_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  calculateDate,
  createISODateAtStartOfDayEST,
} from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';

export const getReadyForTrialCases = async () => {
  const results = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as d')
      .innerJoin('dwCase as c', 'd.docketNumber', 'c.docketNumber')
      .where('c.status', '=', CASE_STATUS_TYPES.generalDocket)
      .where('d.eventCode', 'in', ANSWER_DOCUMENT_CODES)
      .where('d.isStricken', 'is not', true)
      .where(
        'createdAt',
        '<=',
        calculateDate({
          dateString: createISODateAtStartOfDayEST(
            calculateDate({ howMuch: -44, units: 'days' }).toISOString(),
          ),
        }),
      )
      .select('d.docketNumber')
      .limit(5000)
      .execute(),
  );
  return results;
};
