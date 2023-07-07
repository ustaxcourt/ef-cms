import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeActivityReportOrdersAndOpinionsDataAction = ({
  props,
  store,
}: ActionProps) => {
  const { opinions, orders } = props;

  if (opinions) {
    store.set(
      state.judgeActivityReport.judgeActivityReportData.opinions,
      opinions,
    );
  }

  if (orders) {
    store.set(state.judgeActivityReport.judgeActivityReportData.orders, orders);
  }
};
