import { state } from '@web-client/presenter/app.cerebral';

export const setMultiDocketedOriginalCaseAction = ({
  props,
  store,
}: ActionProps<{ multiDocketedOriginalCaseDetail: RawCase }>) => {
  store.set(
    state.multiDocketedOriginalCaseDetail,
    props.multiDocketedOriginalCaseDetail,
  );
};
