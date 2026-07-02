import { state } from '@web-client/presenter/app.cerebral';

export const setupGrantDenyMotionRedirectUrlAction = ({
  get,
  props,
  store,
}: ActionProps): void => {
  if (props.redirectUrl) {
    store.set(state.redirectUrl, props.redirectUrl);
    return;
  }

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
