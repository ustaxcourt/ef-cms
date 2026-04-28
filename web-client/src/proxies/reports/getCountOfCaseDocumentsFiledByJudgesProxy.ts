import { AggregatedEventCodesType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { GetCountOfCaseDocumentsFiledByJudgesRequest } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCountOfCaseDocumentsFiledByJudgesInteractor = (
  applicationContext: ClientApplicationContext,
  params: GetCountOfCaseDocumentsFiledByJudgesRequest,
): Promise<AggregatedEventCodesType> => {
  return get({
    applicationContext,
    endpoint: '/case-documents/count',
    params,
  });
};
