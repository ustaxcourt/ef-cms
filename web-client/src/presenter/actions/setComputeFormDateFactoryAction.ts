import { state } from 'cerebral';

/**
 * sets the state.form[path] to whatever the computedDate value is from props
 * @param {string} path the path in the form state to set the computed date to
 * @returns {Function} the primed action
 */
export const setComputeFormDateFactoryAction = path => {
  /**
   * sets the state.modal[path] to whatever was passed in through props.computedDate
   * @param {object} providers the providers object
   * @param {object} providers.props the cerebral props used for getting the computedDate
   * @param {object} providers.store the cerebral store used for setting state.users
   * @returns {object} path as prop with computedDate as value
   */
  const setComputeFormDateAction = ({ props, store }: ActionProps) => {
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
