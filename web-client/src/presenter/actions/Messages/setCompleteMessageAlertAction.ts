import { createISODateString } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const setCompleteMessageAlertAction = ({ get, store }: ActionProps) => {
  store.set(state.messagesPage.messagesCompletedBy, get(state.user));
  store.set(state.messagesPage.messagesCompletedAt, createISODateString());
};
