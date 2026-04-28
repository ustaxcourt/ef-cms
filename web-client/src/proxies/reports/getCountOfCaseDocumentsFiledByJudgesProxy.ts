import { AggregatedEventCodesType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { GetCountOfCaseDocumentsFiledByJudgesRequest } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { get } from '../requests';

export const getCountOfCaseDocumentsFiledByJudgesInteractor = (
  applicationContext,
  params: GetCountOfCaseDocumentsFiledByJudgesRequest,
): Promise<AggregatedEventCodesType> => {
  return get({
    applicationContext,
    endpoint: '/case-documents/count',
    params,
  });
};
