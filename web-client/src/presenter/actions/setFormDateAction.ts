import { state } from 'cerebral';

/**
 * sets and unsets state.form.date from props.computedDate
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setFormDateAction = ({ props, store }: ActionProps) => {
  if (props.computedDate) {
    store.set(state.form.date, props.computedDate);
  } else {
    store.unset(state.form.date);
  }
};
