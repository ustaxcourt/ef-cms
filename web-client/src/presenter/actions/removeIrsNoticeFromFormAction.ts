import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets props.caseDetail on state.form
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const removeIrsNoticeFromFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { index } = props;
  console.log('index', index);
  const data = get(state.irsNoticeUploadFormInfo);
  if (data[index]) data.splice(index, 1);
  store.set(state.irsNoticeUploadFormInfo, data);
  //remove here
};
