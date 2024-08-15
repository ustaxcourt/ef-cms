import { state } from '@web-client/presenter/app.cerebral';

export const unsetParentMessageIdAction = ({ store }: ActionProps) => {
  store.unset(state.parentMessageId);
};
