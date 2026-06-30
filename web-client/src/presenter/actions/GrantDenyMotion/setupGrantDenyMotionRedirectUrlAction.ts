import { state } from '@web-client/presenter/app.cerebral';

export const setupGrantDenyMotionRedirectUrlAction = ({
  get,
  props,
  store,
}: ActionProps): void => {
  if (get(state.redirectUrl)) {
    return;
  }

  const parentMessageId = props.parentMessageId ?? get(state.parentMessageId);
  const caseDetail = get(state.caseDetail);

  if (parentMessageId && caseDetail?.docketNumber) {
    store.set(
      state.redirectUrl,
      `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}`,
    );
  }
};
