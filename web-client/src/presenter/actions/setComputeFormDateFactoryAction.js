import { state } from 'cerebral';

export const setComputeFormDateFactoryAction = path => {
  const setComputeFormDateAction = ({ props, store }) => {
    const { computedDate } = props;

    if (computedDate) {
      store.set(state.form[path], computedDate);
    } else {
      store.unset(state.form[path]);
    }

    return { [path]: computedDate };
  };

  return setComputeFormDateAction;
};
