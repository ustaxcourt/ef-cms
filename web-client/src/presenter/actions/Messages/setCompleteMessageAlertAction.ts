import { BatchCompleteResultType } from '../batchCompleteMessageAction';
import { state } from '@web-client/presenter/app.cerebral';

export const setCompleteMessageAlertAction = ({
  props,
  store,
}: ActionProps) => {
  const {
    batchCompleteResult,
  }: { batchCompleteResult: BatchCompleteResultType } = props;

  store.set(state.messagesPage.completionSuccess, batchCompleteResult.success);
  store.set(
    state.messagesPage.completedAtFormatted,
    batchCompleteResult.completedAtFormatted,
  );
  store.set(state.messagesPage.completedBy, batchCompleteResult.completedBy);
};
