import { state } from 'cerebral';

export const setComputeFormDateFactoryAction = path => {
  const setComputeFormDateAction = ({ props, store }) => {
    const { computedDate } = props;
    store.set(state.form[path], computedDate);
  };

  return setComputeFormDateAction;
};
