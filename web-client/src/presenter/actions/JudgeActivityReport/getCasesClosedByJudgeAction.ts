import { MAX_ELASTICSEARCH_PAGINATION } from '../../../../../shared/src/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const getCasesClosedByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judges, startDate } = get(state.judgeActivityReport.filters);

  const casesClosedByJudge = await applicationContext
    .getUseCases()
    .getCasesClosedByJudgeInteractor(applicationContext, {
      endDate,
      judges,
      pageSize: MAX_ELASTICSEARCH_PAGINATION,
      startDate,
    });

  return { casesClosedByJudge };
};
