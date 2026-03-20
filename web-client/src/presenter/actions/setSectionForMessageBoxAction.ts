import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the messageBoxToDisplay.state on state from props
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setSectionForMessageBoxAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const section =
    props.section !== undefined
      ? props.section
      : get(state.messageBoxToDisplay.section);
  store.set(state.messageBoxToDisplay.section, section);
};
