import { CHIEF_JUDGE } from '@shared/business/entities/EntityConstants';
import {
  CaseInventory,
  GetCustomCaseReportRequest,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { Case } from '@shared/business/entities/cases/Case';

export const getCasesByFilters = async ({
  params,
}: {
  params: GetCustomCaseReportRequest;
}): Promise<{
  totalCount: number;
  foundCases: CaseInventory[];
}> => {
  const { count, results } = await getDbReader(async reader => {
    let query = reader.selectFrom('dwCase');
    if (params.startDate) {
      query = query.where(
        'receivedAt',
        '>=',
        calculateDate({ dateString: params.startDate }),
      );
    }
    if (params.endDate) {
      query = query.where(
        'receivedAt',
        '<=',
        calculateDate({ dateString: params.endDate }),
      );
    }
    if (params.caseStatuses.length) {
      query = query.where('status', 'in', params.caseStatuses);
    }
    if (params.caseTypes.length) {
      query = query.where('caseType', 'in', params.caseTypes);
    }
    if (params.preferredTrialCities.length) {
      query = query.where(
        'preferredTrialCity',
        'in',
        params.preferredTrialCities,
      );
    }
    if (params.filingMethod === 'paper') {
      query = query.where('isPaper', 'is', true);
    } else if (params.filingMethod !== 'all') {
      query = query.where('isPaper', 'is', false);
    }
    if (params.procedureType !== 'All') {
      query = query.where('procedureType', '=', params.procedureType);
    }
    if (params.judges.length) {
      if (params.judges.includes(CHIEF_JUDGE)) {
        query = query.where(eb =>
          eb.or([
            eb('associatedJudge', '=', CHIEF_JUDGE),
            eb('associatedJudgeId', 'in', params.judges),
          ]),
        );
      } else {
        query = query.where('associatedJudgeId', 'in', params.judges);
      }
    }

    // Get the total results
    const totalCount = await query
      .select(({ fn }) => fn.count<number>('docketNumber').as('value'))
      .execute();

    // Then order and paginate
    query = query.orderBy('receivedAt', 'asc');
    query = query.orderBy('docketNumber', 'asc'); // for stable sort
    const filteredResults = await query
      .select([
        'associatedJudge',
        'isPaper',
        'procedureType',
        'caption',
        'caseType',
        'docketNumber',
        'docketNumberSuffix',
        'leadDocketNumber',
        'preferredTrialCity',
        'receivedAt',
        'status',
      ])
      .offset(params.page * params.pageSize)
      .limit(params.pageSize)
      .execute();
    return { count: totalCount[0].value, results: filteredResults };
  });

  return {
    foundCases: results.map(r =>
      transformNullToUndefined({
        ...r,
        caseCaption: r.caption,
        docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
          docketNumber: r.docketNumber,
          docketNumberSuffix: r.docketNumberSuffix,
        }),
        receivedAt: r.receivedAt?.toISOString(),
      }),
    ) as CaseInventory[],
    totalCount: count,
  };
};
