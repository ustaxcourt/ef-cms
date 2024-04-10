import { state } from '@web-client/presenter/app.cerebral';

export const updateIrsNoticeIndexPropertyAction = ({
  props,
  store,
}: ActionProps) => {
  const { key, property, value } = props;
  if (props.value !== '' && props.value !== null) {
    store.set(state.irsNoticeUploadFormInfo[+key][property], value);
  } else {
    store.unset(state.irsNoticeUploadFormInfo[+key][property]);
  }
};
