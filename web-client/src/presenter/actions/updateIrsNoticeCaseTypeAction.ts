import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets props.caseDetail on state.form
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const updateIrsNoticeCaseTypeAction = ({
  props,
  store,
}: ActionProps) => {
  if (props.value !== '' && props.value !== null) {
    store.set(state.irsNoticeUploadFormInfo[+props.key].file, props.value);
  } else {
    store.unset(state.irsNoticeUploadFormInfo[+props.key].file);
  }
};
