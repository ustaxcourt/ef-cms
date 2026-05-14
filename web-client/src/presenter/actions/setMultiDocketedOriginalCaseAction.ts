import { state } from '@web-client/presenter/app.cerebral';

export const setMultiDocketedOriginalCaseAction = ({
  props,
  store,
}: ActionProps<{ multiDocketedOriginalCaseDetail: RawCase }>) => {
  if (props.multiDocketedOriginalCaseDetail) {
    store.set(
      state.multiDocketedOriginalCaseDetail,
      props.multiDocketedOriginalCaseDetail,
    );
  } else {
    store.unset(state.multiDocketedOriginalCaseDetail);
  }
};
