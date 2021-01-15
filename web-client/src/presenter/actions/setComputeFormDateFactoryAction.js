import { state } from 'cerebral';

export const setComputeFormDateFactoryAction = path => {
  const setComputeFormDateAction = ({ props, store }) => {
    const { computedDate } = props;

    if (computedDate) {
      store.set(state.form[path], computedDate);
    } else {
      store.unset(state.form[path]);
    }

    store.unset(state.form.day);
    store.unset(state.form.month);
    store.unset(state.form.year);

    return { [path]: computedDate };
  };

  return setComputeFormDateAction;
};
