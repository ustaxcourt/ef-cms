import { createISODateString } from '@shared/business/utilities/DateHandler';
import { formatDateIfToday } from '@web-client/presenter/computeds/formattedWorkQueue';
import { state } from '@web-client/presenter/app.cerebral';

export const setCompleteMessageAlertAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  store.set(state.messagesPage.messagesCompletedBy, get(state.user).name);
  store.set(
    state.messagesPage.messagesCompletedAt,
    formatDateIfToday(createISODateString(), applicationContext),
  );
  store.set(state.screenMetadata.completionSuccess, true);
};
