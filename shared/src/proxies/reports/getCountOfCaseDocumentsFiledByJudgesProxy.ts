import { AggregatedEventCodesType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { GetCountOfCaseDocumentsFiledByJudgesRequest } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
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
