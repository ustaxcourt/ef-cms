import { CHIEF_JUDGE } from '@shared/business/entities/EntityConstants';
import {
  CaseInventory,
  GetCustomCaseReportRequest,
} from '../../business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getCasesByFiltersPostgres = async ({
  params,
}: {
  params: GetCustomCaseReportRequest;
}): Promise<{
  totalCount: number;
  foundCases: CaseInventory[];
}> => {
  console.log('HERE WE GO', params);
  const results = await getDbReader(reader => {
    let query = reader.selectFrom('dwCase');
    if (params.startDate && params.endDate) {
      query = query
        .where(
          'receivedAt',
          '>=',
          calculateDate({ dateString: params.startDate }),
        )
        .where(
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
    if (params.highPriority) {
      query = query.where('highPriority', 'is', true);
    }
    if (params.judges.length) {
      if (params.judges.includes(CHIEF_JUDGE)) {
        query = query.where(eb =>
          eb.or([
            eb('associatedJudge', '=', CHIEF_JUDGE),
            eb(
              'associatedJudgeId',
              'in',
              params.judges.filter(judge => judge !== CHIEF_JUDGE),
            ),
          ]),
        );
      } else {
        query = query.where(
          'associatedJudgeId',
          'in',
          params.judges.filter(judge => judge !== CHIEF_JUDGE),
        );
      }
    }
    query = query.orderBy('receivedAt', 'asc');
    query = query.orderBy('docketNumber', 'asc'); // for stable sort
    return query
      .select([
        'associatedJudge',
        'isPaper',
        'procedureType',
        'caption',
        'caseType',
        'docketNumber',
        'leadDocketNumber',
        'preferredTrialCity',
        'receivedAt',
        'status',
        'highPriority',
      ])
      .offset((params.page - 1) * params.pageSize)
      .limit(params.pageSize)
      .execute();
  });

  console.log(
    'foundCases results',
    results.map(r => transformNullToUndefined(r)) as CaseInventory[],
  );

  return {
    foundCases: results.map(r =>
      transformNullToUndefined(r),
    ) as CaseInventory[],
    totalCount: results.length,
  };
};
