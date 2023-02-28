import { state } from 'cerebral';

/**
 * Sets the workQueueToDisplay.state on state from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setSectionForWorkQueueAction = ({ props, store }) => {
  store.set(state.workQueueToDisplay.section, props.section);
};
