import { state } from '@web-client/presenter/app.cerebral';

/**
 * Unsets the props.key from the confirmationText object on state
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const unsetNegativeValueConfirmationTextAction = ({
  props,
  store,
}: ActionProps) => {
  store.unset(state.confirmationText[props.key]);
};
