import { state } from '@web-client/presenter/app.cerebral';

export const updateIrsNoticeCaseTypeAction = ({
  props,
  store,
}: ActionProps) => {
  if (props.value !== '' && props.value !== null) {
    store.set(state.irsNoticeUploadFormInfo[+props.key].caseType, props.value);
  } else {
    store.unset(state.irsNoticeUploadFormInfo[+props.key].caseType);
  }
};
